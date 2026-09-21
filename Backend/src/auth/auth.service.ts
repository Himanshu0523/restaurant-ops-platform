import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UserService } from '../user/user.service.js';
import { MailService } from './mail.service.js';
import { RegisterDto } from './dto/registerUser.dto.js';
import { LoginDto } from './dto/loginUser.dto.js';
import { ForgotPasswordDto } from './dto/forgotPassword.dto.js';
import { ResetPasswordDto } from './dto/resetPassword.dto.js';
import { RefreshTokenDto } from './dto/refreshToken.dto.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {
    this.accessExpiresIn = this.config.get<string>('jwt.expiresIn') ?? '15m';
    this.refreshExpiresIn =
      this.config.get<string>('jwt.refreshExpiresIn') ?? '7d';
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: this.accessExpiresIn as any}),
      this.jwtService.signAsync(payload, { expiresIn: this.refreshExpiresIn as any}),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      access_token,
      refresh_token,
    };
  }

  async registerUser(registerUserDto: RegisterDto) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    return this.generateTokens(user._id.toString(), user.email);
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user._id.toString(), user.email);
  }

  async refreshToken(refreshDto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshDto.refreshToken,
      );
      const user = await this.userService.getUserById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access denied');
      }

      const isTokenMatching = await bcrypt.compare(
        refreshDto.refreshToken,
        user.refreshToken,
      );
      if (!isTokenMatching) {
        throw new UnauthorizedException('Access denied');
      }

      return this.generateTokens(user._id.toString(), user.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const genericResponse = {
      message: 'If the email exists, a reset link will be sent.',
    };

    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const expires = new Date(Date.now() + 3600000);

    await this.userService.setResetPasswordToken(
      user.email,
      hashedResetToken,
      expires,
    );

    try {
      await this.mailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (err) {
      this.logger.error(
        `Failed to send password reset email to ${user.email}`,
        err instanceof Error ? err.stack : String(err),
      );
      // Do not reveal failure to caller — return same generic response.
    }

    return genericResponse;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');
    const user = await this.userService.findByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    const newPasswordHash = await bcrypt.hash(
      resetPasswordDto.newPassword,
      10,
    );
    await this.userService.updatePassword(
      user._id.toString(),
      newPasswordHash,
    );

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }
}