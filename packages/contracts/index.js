export const OrderSource = Object.freeze({
  FOLLOWER: "FOLLOWER",
  QR: "QR",
  DISCOVERY: "DISCOVERY",
  CREATOR: "CREATOR",
  DIRECT: "DIRECT",
  WALKIN: "WALKIN",
});

export const LiveStatus = Object.freeze({
  OPEN: "OPEN",
  BUSY: "BUSY",
  PAUSED: "PAUSED",
  CLOSED: "CLOSED",
});

export const Role = Object.freeze({
  CUSTOMER: "CUSTOMER",
  RESTAURANT_OWNER: "RESTAURANT_OWNER",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  KITCHEN: "KITCHEN",
  DELIVERY: "DELIVERY",
  ADMIN: "ADMIN",
});

export const Events = Object.freeze({
  ORDER_CREATED: "order.created",
  ORDER_UPDATED: "order.updated",
  FRESH_BATCH: "kitchen.fresh_batch",
  SHOCK_MODE_TRIGGERED: "shock_mode.triggered",
  CHANNEL_POSTED: "channel.posted",
});

export const RankingWeights = Object.freeze({
  DISTANCE_KM_MAX: 10,
  FOLLOWER_BOOST: 1.5,
  FRESH_BATCH_BOOST: 2.0,
});
