import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/data/services/auth.service';
import { UserToRegister } from 'src/data/Model/UserToRegister';
import { ValidationError } from 'src/data/Model/ValidationError';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: UserToRegister;
  validationErrors: ValidationError[];
  warning: string;
  successMessage: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.user = new UserToRegister;
  }

  onSubmit(f: NgForm): void {
    this.auth.register(this.user).subscribe((success) => {
      this.warning = null;
      this.successMessage = true;
    }, (err) => {
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
    });
  }
}
