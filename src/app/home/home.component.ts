import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // console.log(this.responseXML.title);
      // console.log(this.responseXML.querySelector(".table.parbase.section").innerHTML);

      let electionCalendar = document.getElementById("electionCalendar");
      electionCalendar.innerHTML = this.responseXML.querySelector(".table.parbase.section").innerHTML;
      electionCalendar.innerHTML += "<p>Data retireved from the <a href='https://www.canada.ca/en/public-service-commission/services/political-activities/election-calendar.html'>Government of Canada</a>.</p>"
    }
    xhr.open("GET", 'https://www.canada.ca/en/public-service-commission/services/political-activities/election-calendar.html/');
    xhr.responseType = "document";
    xhr.send();
  }
}
