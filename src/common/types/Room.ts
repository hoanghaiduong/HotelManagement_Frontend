export interface Room {
  roomNumber: string;
  floor: number;
  status: string;
  cleanStatus:string;
  bookings: [];
  id: number;
  createdAt: string;
  updatedAt: string;
  roomTypeName?:string;
  roomTypeId?:number;
}

export interface RoomFilter{
  status:string;
  roomType:string;
  cleanStatus:string;
}