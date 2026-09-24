import { Types } from 'mongoose';

import {
  StaffDepartment,
  StaffStatus,
  StaffType,
} from '../staff.types.js';

export interface IStaff {
    _id: Types.ObjectId;

    tenantId: Types.ObjectId;
    userId: Types.ObjectId;

    restaurantId: Types.ObjectId;
    branchId: Types.ObjectId;

    employeeCode: string;
    position: string;

    type: StaffType;
    department: StaffDepartment;
    status: StaffStatus;

    contact?: {
        phone?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
    };

    schedule?: {
        weeklyHours?: number;
        flexibleSchedule?: boolean;
    };

    joinedAt?: Date;
    terminatedAt?: Date;

    notes?: string;

    isActive: boolean;
    deletedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}