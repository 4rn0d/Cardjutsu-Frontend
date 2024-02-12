import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { HomeComponent  } from './home/home.component';
import { MatchComponent } from './match/match.component';
import { BattlefieldComponent } from './match/battlefield/battlefield.component';
import { PlayerhandComponent } from './match/playerhand/playerhand.component';
import { EnemyhandComponent } from './match/enemyhand/enemyhand.component';
import { HealthComponent } from './match/health/health.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ShopComponent } from './home/shop/shop.component';
import { MyCardsComponent } from './home/my-cards/my-cards.component';
import { DialogWaitingComponent } from './components/dialogWaiting/dialogWaiting.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    HomeComponent,
    MatchComponent,
    BattlefieldComponent,
    PlayerhandComponent,
    EnemyhandComponent,
    HealthComponent,
    ShopComponent,
    MyCardsComponent,
    DialogWaitingComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    CanvasJSAngularChartsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
