import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { StaffDepartment, StaffStatus, StaffType } from "../staff.types.js";

export type StaffDocument = HydratedDocument<Staff>;






@Schema({
    _id : false,
})
export class StaffContact {
    @Prop({
        trim: true,
    })
    phone?: string;

    @Prop({
        trim: true,
    })
    emergencyContactName?: string;

    @Prop({
        trim: true,
    })
    emergencyContactPhone?: string;
}

export const StaffContactSchema = SchemaFactory.createForClass(StaffContact);

@Schema({
    _id: false,
}) 
export class StaffSchedule {
    @Prop({
        default: 0,
    })
    weeklyHours?: number;

    @Prop({
        default: false,
    })
    flexibleSchedule?: boolean;
}

export const StaffScheduleSchema = SchemaFactory.createForClass(StaffSchedule);

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Staff {
    @Prop({
        type: Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true,
    })
    tenantId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    userId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        index: true,
    })
    restaurantId: Types.ObjectId;

    @Prop({
    type: Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true,
    })
    branchId: Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
        maxlength: 50,
    })
    employeeCode: string;

    @Prop({
        required: true,
        trim: true,
        maxlength: 100,
    })
    position: string;

    @Prop({
        type: String,
        enum: Object.values(StaffType),
        default: StaffType.FULL_TIME,
        index: true,
    })
    type: StaffType;

    @Prop({
        type: String,
        enum: Object.values(StaffDepartment),
        default: StaffDepartment.FRONT_OF_HOUSE,
        index: true,
    })
    department: StaffDepartment;

    @Prop({
        type: String,
        enum: Object.values(StaffStatus),
        default: StaffStatus.ACTIVE,
        index: true,
    })
    status: StaffStatus;

    @Prop({
        type: StaffContactSchema,
        default: () => ({}),
    })
    contact: StaffContact;

    @Prop({
        type: StaffScheduleSchema,
        default: () => ({}),
    })
    schedule: StaffSchedule;
    
    @Prop({
        type: Date,
    })
    joinedAt?: Date;

    @Prop({
        type: Date,
    })
    terminatedAt?: Date;

    @Prop({
        trim: true,
    })
    notes?: string;

    @Prop({
        default: true,
        index: true,
    })
    isActive: boolean;

    @Prop({
        type: Date,
        default: null,
    })
    deletedAt?: Date | null;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);


// One Employee code per branch
StaffSchema.index(
    {
        branchId: 1,
        employeeCode: 1,
    },
    {
        unique: true,
    },
);


// Prevent duplicate staff profile for the user in the same branch
StaffSchema.index(
    {
        branchId: 1,
        userId: 1,
    },
    {
        unique: true,
    },
);


StaffSchema.index({
    tenantId: 1,
    status: 1,
});

StaffSchema.index({
    branchId: 1,
    department: 1,
});

StaffSchema.index({
    branchId: 1,
    isActive: 1,
});

StaffSchema.index({
    deletedAt: 1,
});