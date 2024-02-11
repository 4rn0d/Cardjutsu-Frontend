import {Component, OnInit} from '@angular/core';
import { MatchService } from './services/match.service';
import { Router } from '@angular/router';
import {ApiService} from "./services/api.service";
import {connect, lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'supercartesinfinies';
  baseUrl = "https://localhost:7219/api/";
  accountBaseUrl = this.baseUrl + "Account/";
  username = "";

  constructor(public router: Router, public matchService:MatchService,public http: HttpClient, public cookieService: CookieService) { }


 async ngOnInit(): Promise<void> {
    this.username = await this.getUsername();
  }
 async getUsername(){
   let options = { withCredentials: true };
   if (this.isLoggedIn())
   {
     let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'GetUsername'));
     return result.email;
   }

  }



  async register(usernameQuestion: string | null | undefined, passwordQuestion: string | null | undefined, passwordConfirm: any){
    let registerData = {
      email : usernameQuestion,
      password : passwordQuestion,
      passwordConfirm : passwordConfirm,
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
    console.log(result);
  }

  async connect(email: string | null | undefined, password: string | null | undefined){
    let registerData = {
      username : email,
      password : password,

    }//"autre2@test2.com" //"Passw0rd!2"
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));
    console.log(result);
  }

  async privateRequest(){
    let options = {withCredentials :true};
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'PrivateData', options));
    console.log(result);
  }

  async publicRequest(){
    let options = {withCredentials :true};
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'PublicData'));
    console.log(result);
  }

  async logout(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'Logout'));
    console.log(result);
  }

  isLoggedIn(){
    return this.cookieService.get(".AspNetCore.Identity.Application");
  }



  protected readonly connwect = connect;



}
