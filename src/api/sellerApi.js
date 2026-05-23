import axiosClient from "./axiosClient";

export const getSellerProducts = (page = 0, pageSize = 20) =>
  axiosClient.get(`/api/seller/products?page=${page}&pageSize=${pageSize}`);

export const createProduct = (data) =>
  axiosClient.post("/api/seller/products", data);

export const updateProduct = (productId, data) =>
  axiosClient.put(`/api/seller/products/${productId}`, data);

export const deleteProduct = (productId) =>
  axiosClient.delete(`/api/seller/products/${productId}`);
