import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatchComponent } from './match/match.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {apiGuard} from "./guards/api.guards";
import {ShopComponent} from "./home/shop/shop.component";
import {MyCardsComponent} from "./home/my-cards/my-cards.component";

const routes: Routes = [
  { path: 'match/:id', component: MatchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, children: [
      { path: '', component: MyCardsComponent, pathMatch: 'full' },
      { path: 'shop', component: ShopComponent },
      { path: 'myCards', component: MyCardsComponent }
    ]},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
