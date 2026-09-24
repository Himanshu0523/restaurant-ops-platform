import { apiClient } from "@/lib/api-client";

/** GET /branches/:branchId/menus */
export async function getMenus(branchId) {
  const res = await apiClient.get(/branches//menus);
  return res.data;
}

/** GET /menus/:menuId/categories */
export async function getCategories(menuId) {
  const res = await apiClient.get(/menus//categories);
  return res.data;
}

/** GET /menus/:menuId/items?category=&available= */
export async function getMenuItems(menuId, params = {}) {
  const res = await apiClient.get(/menus//items, { params });
  return res.data;
}

/** POST /branches/:branchId/menus */
export async function createMenu(branchId, data) {
  const res = await apiClient.post(/branches//menus, data);
  return res.data;
}

/** POST /menus/:menuId/items */
export async function createMenuItem(menuId, data) {
  const res = await apiClient.post(/menus//items, data);
  return res.data;
}

/** PATCH /menu-items/:itemId */
export async function updateMenuItem(itemId, data) {
  const res = await apiClient.patch(/menu-items/, data);
  return res.data;
}

/** PATCH /menu-items/:itemId/status */
export async function updateMenuItemStatus(itemId, data) {
  const res = await apiClient.patch(/menu-items//status, data);
  return res.data;
}

/** DELETE /menu-items/:itemId */
export async function deleteMenuItem(itemId) {
  const res = await apiClient.delete(/menu-items/);
  return res.data;
}
