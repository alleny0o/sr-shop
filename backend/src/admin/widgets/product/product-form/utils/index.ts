// Types
import { Field } from "../types";

/**
 * Compares two Image objects to determine if they are identical.
 * @param imageA - The first Image object.
 * @param imageB - The second Image object.
 * @returns A boolean indicating whether the two Image objects are equal.
 */
export const compareImages = (imageA: Field["image"], imageB: Field["image"]): boolean => {
  // If both images are null or undefined, they are considered equal
  if (!imageA && !imageB) {
    return true;
  }

  // If one is null and the other is not, they are not equal
  if (!imageA || !imageB) {
    return false;
  }

  // If both images are strings, compare them directly
  if ("temp_url" in imageA && "temp_url" in imageB) {
    return imageA.temp_url === imageB.temp_url && imageA.file === imageB.file;
  }

  // Compare the properties of the guide_image objects
  if ("id" in imageA && "id" in imageB) {
    return (
      imageA.id === imageB.id &&
      imageA.file_id === imageB.file_id &&
      imageA.name === imageB.name &&
      imageA.size === imageB.size &&
      imageA.mime_type === imageB.mime_type &&
      imageA.url === imageB.url
    );
  }

  // Mismatch 
  return false;
};
