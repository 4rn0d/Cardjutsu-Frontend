import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";
import {lastValueFrom} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

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
  problemeRegister = false; // pour le afterSubmit
  userData:QuestionsData | null = null;
  baseUrl = "https://localhost:7219/api/";
  accountBaseUrl = this.baseUrl + "Account/";
  constructor(private fb: FormBuilder, public appcompenemt: AppComponent,public http: HttpClient) {

    this.loginForm = this.fb.group({
      usernameQuestion: ['', [Validators.required, Validators.email, this.gmailValidator]],
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

  gmailValidator(control: AbstractControl): ValidationErrors | null {

    const email = control.value;
    if (!email) {
      return null;
    }
    let formValid = email.includes('@gmail.com');

    return !formValid?{gmailValidator:true}:null;
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


 // registering() {
   // this.appcompenemt.register(this.userData?.usernameQuestion, this.userData?.passwordQuestion,this.userData?.passwordConfirmQuestion )
  //}

  async registering() {
    try {
      let registerData = {
        email : this.userData?.usernameQuestion,
        password : this.userData?.passwordQuestion,
        passwordConfirm : this.userData?.passwordConfirmQuestion,
      }
      let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
      await this.appcompenemt.connect(registerData.email, registerData.password);

    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
        this.loginForm.reset("usernameQuestion");
        this.loginForm.reset("passwordQuestion");
        this.loginForm.reset("passwordConfirmQuestion");
        console.log(this.problemeRegister)
        return;

      }
    }
    return null;

  }
}
