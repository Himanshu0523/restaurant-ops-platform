"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/lib/api/restaurants.api";

export const RESTAURANTS_KEY = ["restaurants"];

export function useRestaurants(params = {}) {
  return useQuery({
    queryKey: [...RESTAURANTS_KEY, params],
    queryFn: () => getRestaurants(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRestaurant(id) {
  return useQuery({
    queryKey: [...RESTAURANTS_KEY, id],
    queryFn: () => getRestaurant(id),
    enabled: !!id,
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESTAURANTS_KEY }),
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateRestaurant(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESTAURANTS_KEY }),
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESTAURANTS_KEY }),
  });
}
