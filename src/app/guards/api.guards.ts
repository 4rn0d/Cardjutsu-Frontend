import {CanActivateFn, createUrlTreeFromSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {ApiService} from "../services/api.service";
import {AppComponent} from "../app.component";

export const apiGuard: CanActivateFn = (route, state) => {

        if(!inject(ApiService).isLoggedIn()){
          console.log("no")
            return createUrlTreeFromSnapshot(route, ['/login']);
        }else{
          console.log("yes")
            return true;
        }
}
