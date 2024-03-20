import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Card } from '../models/models';
import { environment } from 'src/environments/environment';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {MatchService} from "./match.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = "https://localhost:7219/api/";
  accountBaseUrl = this.baseUrl + "Account/";
  deckBaseURL = this.baseUrl+ "Deck/"

  constructor(public http: HttpClient, public cookieService: CookieService, public matchService: MatchService) { }

  async getAllCards(): Promise<Card[]> {
    let result = await lastValueFrom(this.http.get<Card[]>(environment.apiUrl+'api/card/GetAllCards'));
    return result;
  }

  async getPlayersCards(): Promise<Card[]> {
    let result = await lastValueFrom(this.http.get<Card[]>(environment.apiUrl+'api/card/GetPlayersCards'));
    return result;
  }
  async getUsername(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'GetUsername'));
    localStorage.setItem("currentPlayerId", result.id)
    return result.email;
  }

  async getCurrentPlayerId(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'getCurrentPlayerId'));
    localStorage.setItem("currentPlayerId", result.id)
    return result.email;
  }

  async register(usernameQuestion: string | null | undefined, passwordQuestion: string | null | undefined, passwordConfirm: any){
    let registerData = {
      email : usernameQuestion,
      password : passwordQuestion,
      passwordConfirm : passwordConfirm,
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
  }

  async connect(email: string | null | undefined, password: string | null | undefined){
    let registerData = {
      username : email,
      password : password,

    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));

  }
  async logout(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'Logout'));

  }
  isLoggedIn(){
    return this.cookieService.get(".AspNetCore.Identity.Application");
  }


  async test() {
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'PrivateData'));
    console.log(result)
  }

  //DECK
  async PostDeck(Name: string | null | undefined, ListCards: Card[] | null | undefined){

    let deck ={
      name: Name,

    }

    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'PostDeck'));

  }
}
