import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
interface QuestionsData {
  usernameQuestion?: string | null ;
  passwordQuestion?: string | null ;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  baseUrl = "https://localhost:7219/api/";
  accountBaseUrl = this.baseUrl + "Account/";
  loginForm:FormGroup<any>;
  problemeLogin:any; // pour le afterSubmit

  userData:QuestionsData | null = null;
  constructor(private fb: FormBuilder, public appcompenemt: AppComponent,public http: HttpClient,public router: Router,public apiService :ApiService) {

    this.loginForm = this.fb.group({
      usernameQuestion: ['', [Validators.required, Validators.email]],
      passwordQuestion: ['',[Validators.required]],
    });


    this.loginForm.valueChanges.subscribe(() => {
      this.userData = this.loginForm.value;
    });


  }
  gmailValidator(control: AbstractControl): ValidationErrors | null {
    // On récupère la valeur du champs texte
    const email = control.value;
    // On regarde si le champs est remplis avant de faire la validation
    if (!email) {
      return null;
    }
    let formValid = email.includes('@gmail.com');

    return !formValid?{gmailValidator:true}:null;
  }


    async login() {
      try {

        let registerData = {
          username: this.userData?.usernameQuestion,
          password: this.userData?.passwordQuestion,

        }
        await this.apiService.connect(registerData.username, registerData.password);
        await  this.router.navigate(['']);
        await this.appcompenemt.getUsername();
      } catch (err: any) {
        if (err instanceof HttpErrorResponse){
          this.problemeLogin = err.error;
          console.log(err.error)
          return;
        }



      }
      return null;

    }





}
