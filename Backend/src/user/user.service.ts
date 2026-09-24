import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  User,
  UserDocument,
} from './schemas/user.schema.js';
import {
  UserRole,
  UserStatus,
} from './user.types.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdatePreferencesDto } from './dto/update-preferences.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { RegisterDto } from '../auth/dto/registerUser.dto.js';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Create user (called by AuthService or directly).
   */
  async createUser(data: RegisterDto | {
    fname: string;
    lname: string;
    email: string;
    password: string;
    role?: UserRole;
    tenantId?: string | null;
  }): Promise<UserDocument> {
    const rawFname = (data as RegisterDto).fname || (data as any).firstName || (data as any).fname || '';
    const rawLname = (data as RegisterDto).lname || (data as any).lastName || (data as any).lname || '';
    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser = await this.userModel
      .findOne({ email: normalizedEmail })
      .lean();

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    // If password is raw, hash it. If already hashed (e.g. from AuthService), use as is.
    const isHashed = data.password.startsWith('$2b$') || data.password.startsWith('$2a$');
    const hashedPassword = isHashed
      ? data.password
      : await bcrypt.hash(data.password, this.saltRounds);

    const user = new this.userModel({
      fname: rawFname.trim(),
      lname: rawLname.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: (data as any).role ?? UserRole.CUSTOMER,
      tenantId: (data as any).tenantId
        ? new Types.ObjectId((data as any).tenantId)
        : null,
    });

    return user.save();
  }

  /**
   * Find user by ID.
   */
  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Alias for findById (backward compatibility).
   */
  async getUserById(userId: string): Promise<UserDocument | null> {
    return await this.userModel.findById(userId).exec();
  }

  /**
   * Find user by email.
   */
  async findByEmail(
    email: string,
    includeSensitive = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (includeSensitive) {
      query.select(
        '+password +refreshTokenHash +resetPasswordTokenHash',
      );
    }

    return query.exec();
  }

  /**
   * Find active user.
   */
  async findActiveUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      _id: userId,
      status: UserStatus.ACTIVE,
    });

    if (!user) {
      throw new NotFoundException('Active user not found');
    }

    return user;
  }

  /**
   * Update user's own profile.
   */
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    const user = await this.findById(userId);

    if (dto.fname !== undefined) {
      user.fname = dto.fname.trim();
    }
    if (dto.lname !== undefined) {
      user.lname = dto.lname.trim();
    }

    const updatedUser = await user.save();
    return this.toSafeUser(updatedUser);
  }

  /**
   * Update dietary preferences & allergen exclusions.
   */
  async updatePreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ) {
    const user = await this.findById(userId);

    if (dto.dietaryPreferences !== undefined) {
      user.preferences.dietaryPreferences = dto.dietaryPreferences;
    }
    if (dto.excludedAllergens !== undefined) {
      user.preferences.excludedAllergens = dto.excludedAllergens;
    }

    const updatedUser = await user.save();
    return this.toSafeUser(updatedUser);
  }

  /**
   * Update user password.
   */
  async updatePassword(
    userId: string,
    newPasswordHash: string,
  ): Promise<void> {
    const isHashed = newPasswordHash.startsWith('$2b$') || newPasswordHash.startsWith('$2a$');
    const passwordHash = isHashed
      ? newPasswordHash
      : await bcrypt.hash(newPasswordHash, this.saltRounds);

    await this.userModel.findByIdAndUpdate(userId, {
      password: passwordHash,
      refreshTokenHash: null,
      refreshToken: null,
      resetPasswordToken: null,
      resetPasswordTokenHash: null,
      resetPasswordExpires: null,
    }).exec();
  }

  /**
   * Save hashed refresh token.
   */
  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        refreshTokenHash,
        refreshToken: refreshTokenHash,
      },
      { runValidators: true },
    ).exec();
  }

  /**
   * Alias for updateRefreshTokenHash (backward compatibility).
   */
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.updateRefreshTokenHash(userId, refreshToken);
  }

  /**
   * Password reset helpers (backward compatibility for AuthService).
   */
  async setResetPasswordToken(email: string, token: string, expires: Date) {
    return await this.userModel.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordTokenHash: token,
        resetPasswordExpires: expires,
      },
    ).exec();
  }

  async findByResetToken(token: string) {
    return await this.userModel.findOne({
      $or: [
        { resetPasswordToken: token },
        { resetPasswordTokenHash: token },
      ],
      resetPasswordExpires: { $gt: new Date() },
    }).exec();
  }

  /**
   * Get safe profile by userId.
   */
  async getProfile(userId: string) {
    const user = await this.findById(userId);
    return this.toSafeUser(user);
  }

  /**
   * Administrative user update.
   */
  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.findById(userId);

    if (dto.role !== undefined) {
      user.role = dto.role;
    }
    if (dto.status !== undefined) {
      user.status = dto.status;
    }

    const updatedUser = await user.save();
    return this.toSafeUser(updatedUser);
  }

  /**
   * Assign tenant and role (called by TenantsService during tenant onboarding).
   */
  async setTenantAndRole(userId: string, tenantId: string, role: UserRole) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { tenantId: new Types.ObjectId(tenantId), role },
      { new: true },
    ).exec();
  }

  /**
   * Convert database user document to safe API response object.
   */
  toSafeUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone ?? null,
      phoneVerified: user.phoneVerified ?? false,
      role: user.role,
      status: user.status ?? UserStatus.ACTIVE,
      tenantId: user.tenantId ? user.tenantId.toString() : null,
      emailVerified: user.emailVerified ?? false,
      preferences: {
        dietaryPreferences: user.preferences?.dietaryPreferences ?? [],
        excludedAllergens: user.preferences?.excludedAllergens ?? [],
      },
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
  }
}

// Backward compatibility export alias
export const UsersService = UserService;
export type UsersService = UserService;