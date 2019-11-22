import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  id: string;
  token: string;
  successMessage: boolean;
  errorMessage: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // Don't think I need to store subscription in class variable like in WEB422
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.token = params['token'];
      this.auth.verifyUser(this.id, this.token).subscribe(() => {
        this.successMessage = true;
        setTimeout(() => this.router.navigate(['/login']), 10000);
      }, (err) => {
        this.errorMessage = true;
      });
    }, (err) => {
      console.log('Unable to get route parameters', err);
    });
  }

}
