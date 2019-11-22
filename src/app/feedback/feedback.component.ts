import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Feedback} from 'src/data/Model/Feedback';
import {Event} from 'src/data/Model/Event';
import {EventService} from 'src/data/services/event.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  event: Event;
  constructor(
    private eService: EventService,
    private dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Feedback) { }

  ngOnInit() {
    this.eService.getEventById(this.data.eventEventId).subscribe(data=>{
      this.event = data;
    });
  }
  save(){
    this.dialogRef.close(this.data);
    console.log(this.data);
  }
}
