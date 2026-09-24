import {
  Allergen,
  DietaryPreference,
  UserRole,
  UserStatus,
} from '../user.types.js';

export interface SafeUser {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  role: UserRole;
  status: UserStatus;
  tenantId: string | null;
  emailVerified: boolean;
  preferences: {
    dietaryPreferences: DietaryPreference[];
    excludedAllergens: Allergen[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}