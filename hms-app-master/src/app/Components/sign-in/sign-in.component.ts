import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/Services/shared-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  isUserSignedIn:boolean = false;
  LoginError: boolean = false;
  LoginErrorMsg: string;

  SignUpError: boolean = false;
  SignUpErrorMsg: string;

  SignUpSuccess: boolean = false;
  SignUpSuccessMsg: string;

  showLoginLoader: boolean = false;
  showSignUpLoader: boolean = false;

  selectedHotelName: string = null;

  username;

  loginFormSubmitAttempt: boolean = false;
  signupFormSubmitAttempt: boolean = false;

  signUpForm = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    address: new FormControl(''),
    country: new FormControl(''),
    postal_code: new FormControl('')
  });

  logInForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  constructor(private http: HttpClient, public ss: SharedServiceService, private router: Router) { 
    
  }

  onLogInSubmit() {
    this.loginFormSubmitAttempt = true;

    if(this.logInForm.valid) {
      this.showLoginLoader = true;
      console.log(" items - ", this.logInForm.value)

      var formData: any = new FormData();
      formData.append("email", this.logInForm.controls['email'].value);
      formData.append("password", this.logInForm.controls['password'].value);

      this.http.post('https://hotelmanagementapp.herokuapp.com/login', formData).subscribe(
        (response) => {
          this.showLoginLoader = false;
          this.LoginErrorMsg = "Incorrect Email or Password";
          if(response && response[0]) {
            var responseEmail = (response[0] && response[0].email)? response[0].email : "";
            var responseFirstname = (response[0] && response[0].first_name)? response[0].first_name : "";
            var responseUser = (response[0] && response[0].unique_id)? response[0].unique_id : "";
            var responseRole = (response[0] && response[0].role)? response[0].role : "";

            if(responseEmail == this.logInForm.controls['email'].value) {
              this.isUserSignedIn = true;
              localStorage.setItem("appuser", responseUser);
              localStorage.setItem("role", responseRole)
              localStorage.setItem("appuseremail", responseEmail);
              localStorage.setItem("appuserfirstname", responseFirstname);
              this.logInForm.reset();
              
              this.selectedHotelName = this.ss.getGlobalHotelName();
              if(this.selectedHotelName && this.selectedHotelName != '') {
                this.router.navigate(["/payment"]);
              } else {
                this.router.navigate(["/welcome"]);
              }

            } else {
              this.LoginError = true;
              this.isUserSignedIn = false;
            }
          } else {
            this.LoginError = true;
          }
          this.loginFormSubmitAttempt = false;
        },
        (error) => console.log(error)
      )
    }

  }

  onSignUpSubmit() {
    this.signupFormSubmitAttempt = true;

    if(this.signUpForm.valid) {
      this.showSignUpLoader = true;
      console.log(" items - ", this.signUpForm.value)

      var formData: any = new FormData();
      formData.append("first_name", this.signUpForm.controls['first_name'].value);
      formData.append("last_name", this.signUpForm.controls['last_name'].value);
      formData.append("user_name", '');
      formData.append("email", this.signUpForm.controls['email'].value);
      formData.append("password", this.signUpForm.controls['password'].value);
      formData.append("phone_no", this.signUpForm.controls['phone'].value);
      formData.append("address", this.signUpForm.controls['address'].value);
      formData.append("country", this.signUpForm.controls['country'].value);
      formData.append("postal_code", this.signUpForm.controls['postal_code'].value);

      // console.log(formData.get('first_name'));

      this.http.post('https://hotelmanagementapp.herokuapp.com/register', formData).subscribe(
        (response) => {
          this.showSignUpLoader = false;
          if(response) {
            if(response["id"] > 0) {
              this.SignUpSuccess = true;
              this.SignUpError = false;
              this.SignUpSuccessMsg = "Successfully Registered. Sign In to Continue"
              this.signUpForm.reset();
            } else {
              this.SignUpError = true;
              this.SignUpSuccess = false;
              this.SignUpErrorMsg = "User Already Exists";
            }
            
          }
          this.signupFormSubmitAttempt = false;
        },
        (error) => console.log(error)
      )

    }

    
  }

  ngOnInit(): void {
    var userInfo = localStorage.getItem("appuser");
    console.log("userInfo")
    if(userInfo && userInfo != "") {
      this.isUserSignedIn = true;
      // this.router.navigate(['/welcome'])
      window.location.href = "/welcome";
    } else {
      this.isUserSignedIn = false;
    }
  }

}
