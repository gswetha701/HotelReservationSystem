import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  globalLocation:string;
  globalCheckInDate: string;
  globalCheckOutDate: string;
  globalRoomType: string;
  globalHotelName: string;
  globalHotelAddress: string;
  globalHotelRoomPrice: string;
  globalSelectedCurrency: string;

  constructor() { }

  setGlobalLocation(currentLocation:string) {
    this.globalLocation = currentLocation;
  }

  getGlobalLocation():string{
    return this.globalLocation;
  }

  setGlobalCheckInDate(currentCheckInDate:string) {
    this.globalCheckInDate = currentCheckInDate;
  }

  getGlobalCheckInDate():string{
    return this.globalCheckInDate;
  }

  setGlobalCheckOutDate(currentCheckOutDate:string) {
    this.globalCheckOutDate = currentCheckOutDate;
  }

  getGlobalCheckOutDate():string{
    return this.globalCheckOutDate;
  }

  setGlobalRoomType(currentRoomType:string) {
    this.globalRoomType = currentRoomType;
  }

  getGlobalRoomType():string{
    return this.globalRoomType;
  }

  setGlobalHotelName(currentHotelName:string) {
    this.globalHotelName = currentHotelName;
  }

  getGlobalHotelName():string{
    return this.globalHotelName;
  }

  setGlobalHotelAddress(currentHotelAddress:string) {
    this.globalHotelAddress = currentHotelAddress;
  }

  getGlobalHotelAddress():string{
    return this.globalHotelAddress;
  }

  setGlobalHotelRoomPrice(currentRoomPrice:string) {
    this.globalHotelRoomPrice = currentRoomPrice;
  }

  getGlobalHotelRoomPrice():string{
    return this.globalHotelRoomPrice;
  }

  setGlobalSelectedCurrency(selectedCurrency:string) {
    this.globalSelectedCurrency = selectedCurrency;
  }

  getGlobalSelectedCurrency():string{
    return this.globalSelectedCurrency;
  }
}
