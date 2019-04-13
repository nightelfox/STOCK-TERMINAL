import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  submitted = false;
  registrationForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(5)]],
    passwordRe: ['', [Validators.required, Validators.minLength(5)]],
  });
  constructor(public auth: AuthService, private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // console.log(this.auth.credential);
    // if(this.auth.credential) {
    //   console.log(this.auth.credential);
    //   this.router.navigate(['/app'])
    // }
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  registration() {
    this.submitted = true;
    this.auth.register(
      this.registrationForm.controls.email.value,
      this.registrationForm.controls.password.value,
      this.registrationForm.controls.name.value
    );
    this.router.navigate(['/app']);
  }
}
