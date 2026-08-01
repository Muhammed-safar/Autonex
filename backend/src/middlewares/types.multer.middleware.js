import { createUpload } from "./upload.middleware.js";

export const brandUpload = createUpload("brands", ["image/svg+xml"]);

export const categoryUpload = createUpload("categories", ["image/svg+xml"]);

export const productUpload = createUpload("products", [
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const profileUpload = createUpload("profiles", [
  "image/png",
  "image/jpeg",
  "image/webp",
]);