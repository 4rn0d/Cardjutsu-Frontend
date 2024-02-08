import {CanActivateFn, createUrlTreeFromSnapshot} from "@angular/router";

export const apiGuard: CanActivateFn = (route, state) => {

        let cookie = localStorage.getItem(".AspNetCore.Identity.Application");

        if(!cookie){
            return createUrlTreeFromSnapshot(route, ['/login']);
        }else{
            return true;
        }
}
