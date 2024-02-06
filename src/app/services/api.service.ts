import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Card } from '../models/models';
import { environment } from 'src/environments/environment';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //baseUrl = "https://localhost:7286/api/";
  baseUrl = "https://localhost:7219/api/";
  accountBaseUrl = this.baseUrl + "Account/";

  constructor(public http: HttpClient, public cookieService: CookieService) { }

  async getAllCards(): Promise<Card[]> {
    let result = await lastValueFrom(this.http.get<Card[]>(environment.apiUrl+'api/card/GetAllCards'));
    return result;
  }

  async getPlayersCards(): Promise<Card[]> {
    let result = await lastValueFrom(this.http.get<Card[]>(environment.apiUrl+'api/card/GetPlayersCards'));
    return result;
  }


  async register(){
    let registerData = {
      email : "autre2@test.com",
      password : "Passw0rd!",
      passwordConfirm : "Passw0rd!",
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
    console.log(result);
  }

  async connect(){
    let registerData = {
      username : "autre2@test.com",
      password : "Passw0rd!"
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));
    console.log(result);
  }

  async privateRequest(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'PrivateData'));
    console.log(result);
  }

  async publicRequest(){
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
}
