import { InjectModel } from '@nestjs/mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { RegisterDto } from '../auth/dto/registerUser.dto.js';
import { User, UserDocument } from './schemes/user.schema.js';
import { Role } from './user.types.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async createUser(registerUserDto: RegisterDto) {
    try {
      return await this.UserModel.create({
        fname: registerUserDto.fname,
        lname: registerUserDto.lname,
        email: registerUserDto.email,
        password: registerUserDto.password,
      });
    } catch (err) {
      const e = err as { code?: number };
      if (e.code === 11000) {
        throw new ConflictException('Email is already registered');
      }
      throw err;
    }
  }

  async getUserById(id: string) {
    return await this.UserModel.findOne({ _id: id }).exec();
  }

  async findByEmail(email: string) {
    return await this.UserModel.findOne({ email }).exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return await this.UserModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }

  async setResetPasswordToken(email: string, token: string, expires: Date) {
    return await this.UserModel.findOneAndUpdate(
      { email },
      { resetPasswordToken: token, resetPasswordExpires: expires },
    ).exec();
  }

  async findByResetToken(token: string) {
    return await this.UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).exec();
  }

  async updatePassword(userId: string, passwordHash: string) {
    return await this.UserModel.findByIdAndUpdate(userId, {
      password: passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    }).exec();
  }


  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.UserModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true },
    ).exec();
    if (!user) return null;
    return this.toSafeUser(user);
  }

  async setTenantAndRole(userId: string, tenantId: string, role: Role) {
    return await this.UserModel.findByIdAndUpdate(
      userId,
      { tenantId: new Types.ObjectId(tenantId), role },
      { new: true },
    ).exec();
  }

  toSafeUser(user: UserDocument) {
    const obj = user.toObject() as unknown as Record<string, unknown>;
    delete obj.password;
    delete obj.refreshToken;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    return obj;
  }
}