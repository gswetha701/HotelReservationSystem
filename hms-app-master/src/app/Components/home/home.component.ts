import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

import { SharedServiceService } from '../../Services/shared-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  location = {
    dataset: {}
  };

  checkInDates = {
    dataset: []
  }

  checkOutDates = {
    dataset: []
  }

  rooms = {
    dataset: []
  }

  selectedLocation:string = null;
  selectedCheckInDate:string = null;
  selectedCheckOutDate:string = null;
  selectedRoomType:string = null;
  CheckAvailabilityError: boolean = false;
  CheckAvailabilityErrorMsg: string;
  checkInMinDate;
  checkOutMinDate;

  constructor(private router: Router, public ss: SharedServiceService) {
  }

  OnLocationSelection(value) {
    this.selectedLocation = (value != 0)? value : null;
  }

  OnCheckInDateSelection(value) {
    this.selectedCheckInDate = (value != 0)? value : null;
  }

  OnCheckOutDateSelection(value) {
    this.selectedCheckOutDate = (value != 0)? value : null;
  }

  OnRoomTypeSelection(value) {
    this.selectedRoomType = (value != 0)? value : null  
  }

  OnCheckAvailability() {

    if(this.selectedLocation && this.selectedCheckInDate && this.selectedCheckOutDate && this.selectedRoomType) {
      this.ss.setGlobalLocation(this.selectedLocation);
      this.ss.setGlobalCheckInDate(this.selectedCheckInDate);
      this.ss.setGlobalCheckOutDate(this.selectedCheckOutDate);
      this.ss.setGlobalRoomType(this.selectedRoomType);
      this.router.navigate(["/results"]);
    } else {
      this.CheckAvailabilityError = true;
      this.CheckAvailabilityErrorMsg = "Please select the proper values";
    }
  }

  generateDates(inputDate, count) {
    var currentDate = (inputDate)? inputDate : new Date();
    let dateArray = [];

    for(var x=0; x < count; x++) {
      if(x > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      var formattedDate = formatDate(currentDate, 'y-M-d', 'en-UK');
      dateArray.push(formattedDate);
    }
    return dateArray;
  }

  ngOnInit(): void {
    this.location = {
      dataset : [
        { 
          value: "london",
          name : "London"
        },
        {
          value : "glasgow",
          name : "Glasgow"
        }
      ]
    }

    this.rooms = {
      dataset : [
        { 
          value: "single",
          name : "Single"
        },
        {
          value : "double",
          name : "Double"
        },
        {
          value : "family",
          name : "Family"
        }
      ]
    }

    this.checkInDates.dataset = this.generateDates(new Date(), 5);

    var coDate = new Date();
    this.checkInMinDate = formatDate(coDate, 'y-M-dd', 'en-UK');
    coDate.setDate(coDate.getDate()+1);
    this.checkOutMinDate = formatDate(coDate, 'y-M-dd', 'en-UK');

    this.checkOutDates.dataset = this.generateDates(coDate, 5);
  }

}
