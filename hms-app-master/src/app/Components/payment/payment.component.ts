import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SharedServiceService } from 'src/app/Services/shared-service.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  selectedLocation;
  selectedCheckInDate;
  selectedCheckOutDate;
  selectedRoomType;
  selectedHotelName;
  selectedHotelAddress;
  selectedHotelRoomPrice;
  selectedCurrency;
  days;
  defaultRoomPrice;
  bookingId;
  selectedRoomImage;

  showBookingLoader: boolean = false;
  bookingSuccessMsg: boolean = false;
  bookingFormSubmitAttempt: boolean = false;

  bookingForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    adults: new FormControl('0', [Validators.required, Validators.pattern("^[0-9]*$")]),
    children: new FormControl('0'),
    rooms: new FormControl(''),
    check_in: new FormControl(''),
    check_out: new FormControl(''),
    days: new FormControl('0'),
    location: new FormControl(''),
    room_type: new FormControl(''),
    price_rate: new FormControl(''),
    
    card_number: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(16)]),
    card_exp_month: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.max(12)]),
    cardexp_year: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4), Validators.min(2020)])
  });

  constructor(private router: Router, public ss: SharedServiceService, private http: HttpClient) { }

  onBookingSubmit() {
    this.bookingFormSubmitAttempt = true;

    if(this.bookingForm.valid) {
      this.showBookingLoader = true;
      console.log(" items - ", this.bookingForm.value)

      var formData: any = new FormData();
      formData.append("first_name", this.bookingForm.controls['first_name'].value);
      formData.append("last_name", this.bookingForm.controls['last_name'].value);
      formData.append("email", this.bookingForm.controls['email'].value);
      formData.append("phone_no", this.bookingForm.controls['phone'].value);
      formData.append("adults", this.bookingForm.controls['adults'].value);
      formData.append("children", this.bookingForm.controls['children'].value);

      formData.append("rooms", "1");
      formData.append("days", this.days);
      formData.append("room_type", this.selectedRoomType);
      formData.append("price_rate", this.selectedHotelRoomPrice);
      formData.append("location", this.selectedLocation);
      formData.append("check_in", this.selectedCheckInDate);
      formData.append("check_out", this.selectedCheckOutDate);

      formData.append("confirm_status", "Confirmed");
      formData.append("payment_status", "Confirmed");

      var userInfo = localStorage.getItem("appuser");
      formData.append("unique_id", userInfo);

      // console.log(formData.get('first_name'));

      this.http.post('https://hotelmanagementapp.herokuapp.com/booking', formData).subscribe(
        (response) => {
          this.showBookingLoader = false;
          if(response) {
            console.log(" booking response - ", response)
            this.bookingSuccessMsg = true;
            this.bookingId = response["Booking Id"];
            this.bookingForm.reset();
          }
          this.bookingFormSubmitAttempt = false;
        },
        (error) => console.log(error)
      )
    }

  }

  parseDate(str) {
    var ymd = str.split('-');
    return new Date(ymd[0], ymd[1]-1, ymd[2]);
  }

  datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
  }

  ngOnInit(): void {
    this.selectedLocation = this.ss.getGlobalLocation();
    this.selectedRoomType = this.ss.getGlobalRoomType();
    this.selectedCheckInDate = this.ss.getGlobalCheckInDate();
    this.selectedCheckOutDate = this.ss.getGlobalCheckOutDate();
    this.selectedHotelName = this.ss.getGlobalHotelName();
    this.selectedHotelAddress = this.ss.getGlobalHotelAddress();
    this.selectedHotelRoomPrice = this.ss.getGlobalHotelRoomPrice();
    this.selectedCurrency = this.ss.getGlobalSelectedCurrency();
    this.defaultRoomPrice = this.selectedHotelRoomPrice;

    if(!this.selectedLocation) {
      this.router.navigate(["/home"]);
    } else {
      var userInfo = localStorage.getItem("appuser");
      if(userInfo && userInfo != "") {

        if(this.selectedRoomType == "single") {
          this.selectedRoomImage = "assets/images/singleroom.jpg";
        } else if(this.selectedRoomType == "double") {
          this.selectedRoomImage = "assets/images/doubleroom.jpg";
        } else if(this.selectedRoomType == "family") {
          this.selectedRoomImage = "assets/images/familyroom.jpg";
        }

        this.days = this.datediff(this.parseDate(this.selectedCheckInDate), this.parseDate(this.selectedCheckOutDate));

        if(this.days) {
          this.selectedHotelRoomPrice = (this.selectedHotelRoomPrice * this.days);
        } else {
          this.days = 1;
        }
      } else {
        this.router.navigate(["/signin"]);
      }
    }


  }

}
