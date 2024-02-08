import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";

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

  userData:QuestionsData | null = null;
  constructor(private fb: FormBuilder, public appcompenemt: AppComponent) {

    this.loginForm = this.fb.group({
      usernameQuestion: ['', [Validators.required, Validators.email, this.gmailValidator]],
      passwordConfirmQuestion: ['', [Validators.required]],
      passwordQuestion: ['', [Validators.required]],
    }, {validators: this.ConformePassword});

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


  registering() {
    this.appcompenemt.register(this.userData?.usernameQuestion, this.userData?.passwordQuestion,this.userData?.passwordConfirmQuestion )
  }
}
