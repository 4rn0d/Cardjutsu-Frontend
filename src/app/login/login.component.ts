import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";
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


  loginForm:FormGroup<any>;

  userData:QuestionsData | null = null;
  constructor(private fb: FormBuilder, public appcompenemt: AppComponent) {

    this.loginForm = this.fb.group({
      usernameQuestion: ['', [Validators.required, Validators.email, this.gmailValidator]],
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


    login() {
        this.appcompenemt.connect(this.userData?.usernameQuestion, this.userData?.passwordQuestion)
    }

}
