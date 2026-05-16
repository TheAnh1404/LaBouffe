/**
 * LaBouffe — Food & Category Type Definitions
 * Shared types for food items and categories across the app.
 */

export interface Food {
  id: string;
  name: string;
  desc: string;
  price: number;
  rating: string;
  categoryId: string;
  isPopular: boolean;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  iconUrl: string;
}
