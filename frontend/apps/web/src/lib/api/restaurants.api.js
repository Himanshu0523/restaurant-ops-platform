import { apiClient } from "@/lib/api-client";

/** GET /restaurants?page=&limit=&search=&cuisine= */
export async function getRestaurants(params = {}) {
  const res = await apiClient.get("/restaurants", { params });
  return res.data;
}

/** GET /restaurants/:id */
export async function getRestaurant(id) {
  const res = await apiClient.get(/restaurants/);
  return res.data;
}

/** POST /restaurants */
export async function createRestaurant(data) {
  const res = await apiClient.post("/restaurants", data);
  return res.data;
}

/** PATCH /restaurants/:id */
export async function updateRestaurant(id, data) {
  const res = await apiClient.patch(/restaurants/, data);
  return res.data;
}

/** DELETE /restaurants/:id */
export async function deleteRestaurant(id) {
  const res = await apiClient.delete(/restaurants/);
  return res.data;
}
