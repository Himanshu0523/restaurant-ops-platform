export enum MenuStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum MenuItemStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  HIDDEN = 'HIDDEN',
}

export enum MenuItemType {
  FOOD = 'FOOD',
  BEVERAGE = 'BEVERAGE',
  DESSERT = 'DESSERT',
  COMBO = 'COMBO',
  ADDON = 'ADDON',
}

export enum PricingType {
  FIXED = 'FIXED',
  SIZE_BASED = 'SIZE_BASED',
  VARIANT_BASED = 'VARIANT_BASED',
}

export enum SpiceLevel {
  NONE = 'NONE',
  MILD = 'MILD',
  MEDIUM = 'MEDIUM',
  HOT = 'HOT',
  EXTRA_HOT = 'EXTRA_HOT',
}
