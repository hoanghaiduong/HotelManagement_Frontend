import { Room } from "./Room";

export interface RoomType {
  id?: number;
  name?: string;
  description?: string;
  pricePerNight?: number;
  numberOfBathrooms?: number;
  numberOfBeds?: number;
  singleBed?: number;
  doubleBed?: number;
  capacity?: number;
  sizes?: number;
  thumbnail?: string; // Optional file for the thumbnail
  Images?: string[] | any; // Optional array of filesfor images
  rooms?: Room[] | any;
  amenities?: Amenities[] | [];
}

interface Amenities {
  name: string;
  icon: string;
  description: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}
