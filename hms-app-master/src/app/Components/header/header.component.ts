import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userLoggedIn = false;
  showUserName = false;
  userName;

  constructor(private router: Router) { }

  ngDoCheck() {
    var userInfo = localStorage.getItem("appuser");
    if(userInfo && userInfo != "") {
      this.userLoggedIn = true;
      var userName = localStorage.getItem("appuserfirstname");
      if(userName && userName != "") {
        this.userName = userName;
        this.showUserName = true
      } else {
        this.showUserName = false;
        this.userName = "";
      }
    } else {
      this.showUserName = false;
      this.userLoggedIn = false;
      this.userName = "";
    }
  }

  OnSignOutClick() {
    localStorage.removeItem("appuser");
    localStorage.removeItem("role");
    localStorage.removeItem("appuseremail");
    localStorage.removeItem("appuserfirstname");
    this.userLoggedIn = false;
    this.router.navigate(['/home'])
  }

  ngOnInit(): void {
    var userInfo = localStorage.getItem("appuser");
    console.log("userInfo")
    if(userInfo && userInfo != "") {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
  }

}
