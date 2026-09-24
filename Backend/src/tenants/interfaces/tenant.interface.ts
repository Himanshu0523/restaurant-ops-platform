import {
  TenantPlan,
  TenantStatus,
} from '../tenant.types.js';

export interface SafeTenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: TenantStatus;
  plan: TenantPlan;
  ownerId: string;
  email?: string;
  phone?: string;
  settings: {
    currency: string;
    timezone: string;
    locale: string;
    enableNotifications: boolean;
    enableAI: boolean;
    enableAnalytics: boolean;
    enableInventory: boolean;
    enableReservations: boolean;
    enableDelivery: boolean;
    enableCustomerReviews: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}