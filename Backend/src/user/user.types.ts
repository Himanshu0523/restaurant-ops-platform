export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer',
  ADMIN = 'ADMIN',
}

// Backward compatibility alias for Role
export const Role = UserRole;
export type Role = UserRole;

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum DietaryPreference {
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
  JAIN = 'JAIN',
  VEGAN = 'VEGAN',
  HALAL = 'HALAL',
  KOSHER = 'KOSHER',
  PALEO = 'PALEO',
}

export enum Allergen {
  DAIRY = 'DAIRY',
  EGG = 'EGG',
  FISH = 'FISH',
  GLUTEN = 'GLUTEN',
  PEANUT = 'PEANUT',
  SHELLFISH = 'SHELLFISH',
  SOY = 'SOY',
  TREE_NUT = 'TREE_NUT',
  WHEAT = 'WHEAT',
  SESAME = 'SESAME',
  CORIANDER = 'CORIANDER',
  MUSTARD = 'MUSTARD',
  NIGHTSHADE = 'NIGHTSHADE',
  SEAFOOD = 'SEAFOOD',
  OTHER = 'Other',
}

export enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  SYSTEM = 'SYSTEM',
}

export enum SocialProvider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  GITHUB = 'GITHUB',
  INSTAGRAM = 'INSTAGRAM',
  APPLE = 'APPLE',
  OTHER = 'Other',
}

export enum Language {
  ENGLISH = 'ENGLISH',
  HINDI = 'HINDI',
  GUJARATI = 'GUJARATI',
  MARATHI = 'MARATHI',
  PUNJABI = 'PUNJABI',
  BENGALI = 'BENGALI',
  TAMIL = 'TAMIL',
  TELUGU = 'TELUGU',
  KANNADA = 'KANNADA',
  MALAYALAM = 'MALAYALAM',
  URDU = 'URDU',
  OTHER = 'Other',
}