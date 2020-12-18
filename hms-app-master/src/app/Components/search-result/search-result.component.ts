import { Component, OnInit, ɵEMPTY_MAP } from '@angular/core';
import { SharedServiceService } from 'src/app/Services/shared-service.service';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [ TitleCasePipe ]
})
export class SearchResultComponent implements OnInit {

  selectedLocation;
  selectedCheckInDate;
  selectedCheckOutDate;
  selectedRoomType;
  selectedCurrency: string = "EUR";

  results = {
    data : []
  }

  constructor(private router: Router, public ss: SharedServiceService, private titlecasePipe:TitleCasePipe) { }

  OnSelectHotel(data) {
    if(data) {
      if(data.hotelRoomType) {
        this.ss.setGlobalRoomType(data.hotelRoomType);
      }
      if(data.hotelName) {
        this.ss.setGlobalHotelName(data.hotelName);
      }
      if(data.hotelAddress) {
        this.ss.setGlobalHotelAddress(data.hotelAddress);
      }
      if(data.hotelPrice) {
        this.ss.setGlobalHotelRoomPrice(data.hotelPrice);
      }
      if(this.selectedCurrency) {
        this.ss.setGlobalSelectedCurrency(this.selectedCurrency);
      }
    }
    this.router.navigate(["/payment"]);
  }

  onChangeCurrency(data) {
    if(data) {
      this.selectedCurrency = data;
      var dataArr = this.results.data;

      var changeVal_USD = 0.20;
      var changeVal_INR = 88.00;

      for(var i=0; i < dataArr.length; i++) {
        var currentPrice = (i == 0)? 110 : (i == 1)? 210 : (i == 2)? 280 : 0;
        var convertedPrice = currentPrice;
        if(data == "USD") {
          convertedPrice = currentPrice + (currentPrice * changeVal_USD)
        } else if(data == "INR") {
          convertedPrice = currentPrice + (currentPrice * changeVal_INR)
        }
        this.results.data[i].hotelPrice = convertedPrice.toFixed(2);
      }
    }
  }

  ngOnInit(): void {

    this.selectedLocation = this.ss.getGlobalLocation();
    this.selectedLocation = (this.selectedLocation)? this.titlecasePipe.transform(this.selectedLocation) : null;
    this.selectedRoomType = this.ss.getGlobalRoomType();
    this.selectedRoomType = (this.selectedRoomType)? this.titlecasePipe.transform(this.selectedRoomType) : null;
    this.selectedCheckInDate = this.ss.getGlobalCheckInDate();
    this.selectedCheckOutDate = this.ss.getGlobalCheckOutDate();

    if(!this.selectedLocation) {
      this.router.navigate(["/home"]);
    }

    var locationHotels = 2;
    var hotelLocations = [];

    for(var y=0; y < locationHotels; y++) {
      var hotelLocation;
      if(y == 0) {
        hotelLocation = (this.selectedLocation == "London")? "Stratford" : "Buchanan Street";
      } else if(y == 1) {
        hotelLocation = (this.selectedLocation == "London")? "Luton" : "Dennistoun";
      }
      hotelLocations.push(hotelLocation);
    }

    var tempArr = [];

    for(var x=0; x < locationHotels; x++) {

      var priceValue;
      var roomType;
      var roomImage;
      if(this.selectedRoomType == "Single") {
        priceValue = "110.00";
        roomType = "single";
        roomImage = "assets/images/singleroom.jpg";
      } else if(this.selectedRoomType == "Double") {
        priceValue = "210.00";
        roomType = "double";
        roomImage = "assets/images/doubleroom.jpg";
      } else if(this.selectedRoomType == "Family") {
        priceValue = "280.00";
        roomType = "family";
        roomImage = "assets/images/familyroom.jpg";
      }

      var hotelLoc = hotelLocations[x]  + ", " + this.selectedLocation;

      var data = {
        hotelName: 'Serene Neuk Hotels',
        hotelAddress: hotelLoc,
        hotelReservation: '000 800 050 218' + x,
        hotelFrontDesk: '1-918-728244' + x,
        hotelFeatures: [
          'Free Breakfast', 'Indoor Pool', 'Wireless Internet'
        ],
        hotelPrice: priceValue,
        hotelRoomType: roomType,
        hotelRoomImage: roomImage
      }
      tempArr.push(data)
      
    }

    this.results.data = tempArr;
  }

}
