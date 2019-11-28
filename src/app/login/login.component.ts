import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import {EventService} from 'src/data/services/event.service';
import { User } from 'src/data/Model/User';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { FeedbackComponent } from '../feedback/feedback.component';
import {Event} from 'src/data/Model/Event';
import { Feedback } from 'src/data/Model/Feedback';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public fd : Feedback;
  public user: User;
  public warning: string;
  public successMessage: boolean = false;
  public userNotVerified: boolean = false;
  public unverifiedUser: string;
  public rejectionCount: number = 0;
  public success: boolean = false;
  public feedback: Feedback[];
  attendedEvents: any[];
  public event: Event;
  description: string;
  rating:number;
  currentDate = new Date();
  token: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private eService: EventService
  ) { }

  ngOnInit() {
    this.user = new User;
  }

  onSubmit(f: NgForm): void {
    this.userNotVerified = false;
    this.auth.login(this.user).subscribe((success) => {
      localStorage.setItem('access_token', success.token);
      this.router.navigate(['/home']);
      this.token = this.auth.readToken();
      this.eService.getEventsAttendedByUser(this.token.userId).subscribe(data => {
        console.log(data);
        this.attendedEvents = data;
        if(this.attendedEvents.length > 0){
          for(var i = 0; i < this.attendedEvents.length; i++){
            console.log(this.attendedEvents[i].Event.event_id);
            this.event = this.attendedEvents[i].Event;
            this.eService.getFeedbackByEventId(this.event.event_id).subscribe((data1: any)=>{
              this.feedback = data1;
              if(this.feedback.length == 0){
                let endDate: Date = new Date(this.event.date_from + ' ' + this.event.time_to);
                  if(endDate < this.currentDate){
                      this.openDialog(this.event.event_id, this.user.userId);
                  }
              }
              else{
              for(let fd of this.feedback){
                if(fd.userUserId == this.token.userId){
                  console.log("Already give feedback!!");
                }
                else{
                  console.log("Not give feedback yet!");
                  let endDate: Date = new Date(this.event.date_from + ' ' + this.event.time_to);
                  if(endDate < this.currentDate){
                      this.openDialog(this.event.event_id, this.user.userId);
                  }
                }
              }
            }
              
            });
          };
        }
      });
      
    }, (err) => {
      this.rejectionCount++;
      if (this.rejectionCount >= 5) {
        this.router.navigate(['/forgotPassword']);
      }
      this.warning = err.error.message;
      if (this.warning == 'You need to verify your account before you can log in. Check your email for the link.') {
        this.userNotVerified = true;
        this.unverifiedUser = this.user.userName
      }
    });
  }

  resendVerificationEmail(p_user: User): void {
    this.userNotVerified = false
    p_user.userName = this.unverifiedUser;
    this.auth.resendVerificationEmail(p_user).subscribe((success) => {
      this.successMessage = true;
      setTimeout(() => this.successMessage = false, 4000);
    }, (err) => {
      console.log(err);
    });
  }

  openDialog(event_id: number, userId: string){
    let date = new Date();
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: {feedback_desc: this.description, feedback_rating: this.rating, eventEventId: event_id, userUserId: userId, feedback_date: date}
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.fd = result;
      console.log(this.fd);
      if(this.fd){
      this.auth.createFeedback(this.fd).subscribe(success=>{
          this.success = true;
          console.log("feedback is saved");
      });
      }
    })
  }

}
