"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMenus,
  getCategories,
  getMenuItems,
  createMenu,
  createMenuItem,
  updateMenuItem,
  updateMenuItemStatus,
  deleteMenuItem,
} from "@/lib/api/menu.api";

export const MENUS_KEY = ["menus"];

export function useMenus(branchId) {
  return useQuery({
    queryKey: [...MENUS_KEY, "branch", branchId],
    queryFn: () => getMenus(branchId),
    enabled: !!branchId,
  });
}

export function useCategories(menuId) {
  return useQuery({
    queryKey: [...MENUS_KEY, menuId, "categories"],
    queryFn: () => getCategories(menuId),
    enabled: !!menuId,
  });
}

export function useMenuItems(menuId, params = {}) {
  return useQuery({
    queryKey: [...MENUS_KEY, menuId, "items", params],
    queryFn: () => getMenuItems(menuId, params),
    enabled: !!menuId,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ branchId, data }) => createMenu(branchId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, data }) => createMenuItem(menuId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }) => updateMenuItem(itemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });
}

export function useUpdateMenuItemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }) => updateMenuItemStatus(itemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });
}
