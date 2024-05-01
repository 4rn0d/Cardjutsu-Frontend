import {CanActivateFn, createUrlTreeFromSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {ApiService} from "../services/api.service";
import {AppComponent} from "../app.component";

export const apiGuard: CanActivateFn = (route, state) => {

        if(!inject(ApiService).isLoggedIn()){
            return createUrlTreeFromSnapshot(route, ['/login']);
        }else{
            return true;
        }
}
