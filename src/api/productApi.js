import axiosClient from "./axiosClient";
export const getProducts = (page = 0, pageSize = 20) =>
  axiosClient.get(`/api/products?page=${page}&pageSize=${pageSize}`);
export const getProductDetail = (id) => axiosClient.get(`/api/products/${id}`);
export const searchProducts = (data) =>
  axiosClient.post("/api/products/search", data);
export const getProductsByShop = (shopId, page = 0) =>
  axiosClient.get(`/api/products/shop/${shopId}?page=${page}`);
export const getProductsByCategory = (categoryId, page = 0) =>
  axiosClient.get(`/api/products/category/${categoryId}?page=${page}`);
