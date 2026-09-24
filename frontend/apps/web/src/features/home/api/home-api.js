import { RESTAURANTS_DATA } from "../data/restaurants";
import { CUISINES_DATA } from "../data/cuisines";
import { PROMOTIONS_DATA } from "../data/promotions";

export async function getFeaturedRestaurants() {
  // Mock async API call for initial development
  return RESTAURANTS_DATA;
}

export async function getPopularCuisines() {
  return CUISINES_DATA;
}

export async function getHomePromotions() {
  return PROMOTIONS_DATA;
}
