import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss']
})
export class ViewBookingComponent implements OnInit {

  isUserLoggedIn: boolean = false;

  noBookingInfo: boolean = false;
  hasBookingInfo: boolean = false;
  showBookingLoader: boolean = false;
  cancelBookingLoader: boolean = false;

  showMyBookings: boolean = false;
  myBookingData;

  bookingInfo = {
    adults: '0',
    booking_id: '0',
    check_in: '',
    check_out: '',
    children: 0,
    confirm_status: '',
    days: '0',
    location: '',
    payment_status: '',
    price: '',
    room_type: '',
    rooms: '',
  }

  viewBookingForm = new FormGroup({
    bookingId: new FormControl('')
  });

  constructor(private http: HttpClient) { }

  onCancelBookingSubmit() {
    this.cancelBookingLoader = true;

    var bookingIdObj = document.getElementById("booking_id");
    var booking_id = (bookingIdObj)? bookingIdObj["value"] : "";

    var formData: any = new FormData();
    formData.append("booking_id", booking_id);

    this.http.post('https://hotelmanagementapp.herokuapp.com/cancelbooking', formData).subscribe(
      (response) => {
        this.cancelBookingLoader = false;
        this.onViewBookingSubmit();
      },
      (error) => console.log(error)
    )
  }

  onViewBookingSubmit() {
    this.showBookingLoader = true;
    this.hasBookingInfo = false;
    this.noBookingInfo = false;

    var formData: any = new FormData();
    formData.append("booking_id", this.viewBookingForm.controls['bookingId'].value);

    this.http.post('https://hotelmanagementapp.herokuapp.com/getdatabybookingid', formData).subscribe(
      (response) => {
        this.showBookingLoader = false;
        console.log("booking response - ", response)
        if(response && response[0]) {
          var res = response[0]
          this.bookingInfo.adults = (res.adults)? res.adults : 0;
          this.bookingInfo.booking_id = (res.booking_id)? res.booking_id : 0;
          this.bookingInfo.check_in = (res.check_in)? res.check_in : 0;
          this.bookingInfo.check_out = (res.check_out)? res.check_out : null;
          this.bookingInfo.children = (res.children)? res.children : null;
          this.bookingInfo.confirm_status = (res.confirm_status)? res.confirm_status : null;
          this.bookingInfo.days = (res.days)? res.days : 0;
          this.bookingInfo.location = (res.location)? res.location : null;
          this.bookingInfo.payment_status = (res.payment_status)? res.payment_status : null;
          this.bookingInfo.price = (res.price)? res.price : 0.00;
          this.bookingInfo.room_type = (res.room_type)? res.room_type : null;
          this.bookingInfo.rooms = (res.rooms)? res.rooms : 0;
          this.hasBookingInfo = true;
        } else {
          this.noBookingInfo = true;
        }
      },
      (error) => console.log(error)
    )
  }

  ngOnInit(): void {
    var formData: any = new FormData();
    var userInfo = localStorage.getItem("appuser");
    var userRole = localStorage.getItem("role");

    if(userInfo) {
      this.isUserLoggedIn = true;
      if(userRole != "admin") {
        formData.append("unique_id", userInfo);
      }
      formData.append("role", userRole);
  
      this.http.post('https://hotelmanagementapp.herokuapp.com/getbookinginfo', formData).subscribe(
        (response) => {
          this.showBookingLoader = false;
          console.log("getLoginBooking response - ", response)
          if(response) {
            this.showMyBookings = true;
            this.myBookingData = response;
          } else {
            this.showMyBookings = false;
          }
        },
        (error) => console.log(error)
      )
    } else {
      this.isUserLoggedIn = false;
    }
    

  }

}
