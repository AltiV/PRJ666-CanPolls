import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string;
  successMessage: boolean;
  errorMessage: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  submitEmail(): void {
    this.successMessage = false;
    this.errorMessage = '';
    this.auth.sendPasswordResetEmail(this.email)
      .subscribe((success) => {
        this.successMessage = true;
      }, (err) => {
        this.errorMessage = err.error.message;
      });
  }

}
