/**
 * LaBouffe — Restaurant Type Definitions
 */

export interface Restaurant {
  id: string;
  name: string;
  desc: string;
  rating: string;
  time: string;
  price: string;
  km?: string;
  imageUrl: string;
}
