import { Component, OnInit } from '@angular/core';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faHome = faHome;
  faEnvelope = faEnvelope;

  constructor() { }

  ngOnInit() {
  }

}
