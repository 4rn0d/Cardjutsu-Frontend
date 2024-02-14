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

  constructor(public router: Router, public matchService:MatchService,public http: HttpClient, public cookieService: CookieService, public apiService:ApiService) { }


 async ngOnInit(): Promise<void> {
    if(this.isLoggedIn()){
        this.username = await this.apiService.getUsername();

    }else{
      this.router.navigate(['/login']);
    }


  }


 async getUsername(){
   let options = { withCredentials: true };

     let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'GetUsername'));
      this.username = result.email
  }



  async register(usernameQuestion: string | null | undefined, passwordQuestion: string | null | undefined, passwordConfirm: any){
      await this.apiService.register(usernameQuestion,passwordQuestion,passwordConfirm);
  }

  async connect(email: string | null | undefined, password: string | null | undefined){
    await this.apiService.connect(email,password);
    await this.router.navigate(['']);
    this.username =await this.apiService.getUsername();
  }

  async logout(){
    await this.apiService.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(){
    return this.cookieService.get(".AspNetCore.Identity.Application");
  }



  protected readonly connwect = connect;

}
