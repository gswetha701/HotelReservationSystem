import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isUserSignedIn:boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {

    var userInfo = localStorage.getItem("appuser");
    console.log("userInfo")
    if(userInfo && userInfo != "") {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      // this.router.navigate(['/signin'])
      window.location.href = "/signin";
    }

  }

}
