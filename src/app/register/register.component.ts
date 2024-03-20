import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";
import {lastValueFrom} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ApiService} from "../services/api.service";
import {Router} from "@angular/router";

interface QuestionsData {
  usernameQuestion?: string | null ;
  passwordQuestion?: string | null ;
  passwordConfirmQuestion?: string | null ;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  loginForm:FormGroup<any>;
  problemeRegister:any; // pour le afterSubmit
  userData:QuestionsData | null = null;
  baseUrl = "https://localhost:7219/api/";
  accountBaseUrl = this.baseUrl + "Account/";
  constructor(private fb: FormBuilder,public router: Router, public appcompenemt: AppComponent,public http: HttpClient, public apiService:ApiService) {

    this.loginForm = this.fb.group({
      usernameQuestion: ['', [Validators.required, Validators.email]],
      passwordConfirmQuestion: ['', [Validators.required]],
      passwordQuestion: ['', [Validators.required], this.passwordLength],
    }, {validators: this.ConformePassword});

    this.loginForm.valueChanges.subscribe(() => {
      this.userData = this.loginForm.value;
    });


  }
  passwordLength(control: AbstractControl): Promise<ValidationErrors | null> | null {
    return new Promise((resolve) => {
      const password: string = control.value;

      if (!password) {
        resolve(null);
      }

      if (password.length < 6) {
        resolve({ passwordLength: true });
      } else {
        resolve(null);
      }
    });
  }

  ConformePassword(control: AbstractControl): ValidationErrors | null{
    const questionA = control.get('passwordConfirmQuestion')?.value;
    const questionB = control.get('passwordQuestion')?.value;

    if (questionA != ""){
      if (questionB !=""){
        if (questionA !== questionB) {
          control.get('passwordConfirmQuestion')?.setErrors({passwrdnoconform:true});
        }
      }
    }
    return null;
  }




  async registering() {
    try {
      let registerData = {
        email : this.userData?.usernameQuestion,
        password : this.userData?.passwordQuestion,
        passwordConfirm : this.userData?.passwordConfirmQuestion,
      }
      await this.apiService.register(registerData.email,registerData.password,registerData.passwordConfirm);
      await this.apiService.connect(registerData.email, registerData.password);
      await this.router.navigate(['']);
      await this.appcompenemt.getUsername();

    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
       this.problemeRegister = err;
        console.log(err.error.message)
        return;

      }
    }
    return null;

  }
}
