export enum ReviewStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

export enum ReviewTargetType {
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
  MENU_ITEM = 'MENU_ITEM',
  DELIVERY = 'DELIVERY',
}

export enum ReviewSource {
  CUSTOMER_APP = 'CUSTOMER_APP',
  WEB = 'WEB',
  STAFF = 'STAFF',
}

export enum ReviewVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
