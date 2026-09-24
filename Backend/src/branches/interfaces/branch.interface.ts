import {
  BranchStatus,
  BranchType,
} from '../branch.types.js';

export interface SafeBranch {

  id: string;

  tenantId: string;

  restaurantId: string;

  name: string;

  slug: string;

  description?: string;

  type: BranchType;

  status: BranchStatus;

  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  location: {
    latitude: number;
    longitude: number;
  };

  phone?: string;

  email?: string;

  managerId?: string;

  totalTables: number;

  totalSeats: number;

  settings: Record<string, unknown>;

  createdAt: Date;

  updatedAt: Date;
}