import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {FileSelectDirective, FileUploader} from 'ng2-file-upload';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import {AuthService} from 'src/data/services/auth.service';
import {ValidationError} from 'src/data/Model/ValidationError';
import { User } from 'src/data/Model/User';
import {UserService} from 'src/data/services/user.service';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { EventService } from 'src/data/services/event.service';

class ImageSnippet{
  constructor(public src: String, public file: File){}
}
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  selectedFile: ImageSnippet;
  sfile : File = null;
  event: EventToCreate;
  validationErrors: ValidationError[];
  warning: string;
  successMessage: boolean;
  private userSubscription: any;
  currentUser: User;
  private token:any;
  unaffiliated: boolean;
  attachmentList: any;
 
  imageToShow:any;

  selectedF: File =null;
  fd =new FormData();

  fullImageName :string="";

  constructor(private auth: AuthService, private uService: UserService, private http: HttpClient, private eService: EventService) { }
  
  ngOnInit() {
    this.event = new EventToCreate;
    this.token = this.auth.readToken();
    this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((us) =>{
      this.currentUser = us;
      this.event.userId = this.currentUser.userId;
      this.event.isApproved = false;
    });
  }
  onFileChanged(imageInput: any){
    debugger;
    const file: File = imageInput.files[0];
    this.sfile = file;
    const reader = new FileReader();
   
    reader.addEventListener('load', (event:any) =>{
      debugger;
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }


 //SENDING THE IMAGE TO THE API
  onImageAdd(event)
  {

    const file: File = <File>event.target.files[0];
    this.sfile = file;
    const reader = new FileReader();
   
    reader.addEventListener('load', (event:any) =>{
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
    
    this.selectedF = <File>event.target.files[0];
    var fileName = this.selectedF.name;
    fileName = fileName.substring(fileName.lastIndexOf('.'));
    this.fullImageName = "Event"+this.currentUser.userId+fileName;
    //console.log("fileExt: "+fileName);
    //console.log("FinalName: "+"Event"+this.currentUser.userId+fileName);
    this.fd.append('file', this.selectedF, this.fullImageName);

  }

  onSubmit(f: NgForm): void{
    if(this.currentUser.partyAffiliation=="Unaffiliated"){
      this.unaffiliated = true;
      console.log("unaffiliated");
    } else{
        console.log("fd: "+JSON.stringify(this.fd));
        this.http.post(environment.apiUrl + "/api/upload", this.fd)
        .subscribe( result => {
        console.log(result)
        });

    this.event.photo = this.fullImageName;
    this.auth.createEvent(this.event).subscribe((success)=>{
      console.log(this.event.photo);
      this.warning = null;
      this.successMessage = true;
      console.log("pass!!");
    }, (err) =>{
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
      
    });
  }
  }
 
  ngOnDestroy(){ 
    if(this.userSubscription){this.userSubscription.unsubscribe();}
   }
}
