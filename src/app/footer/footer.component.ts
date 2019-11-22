import { Component, OnInit } from '@angular/core';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faServer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faHome = faHome;
  faEnvelope = faEnvelope;
  faCode = faCode;
  faServer = faServer;

  quote = "";
  name  = "";

  constructor() { }

  ngOnInit() {
    var politicalQuotes = [
      { quote: "Love is better than anger. Hope is better than fear. Optimism is better than despair. So let us be loving, hopeful and optimistic. And we'll change the world.", name: "Jack Layton" },
      { quote: "Great obstacles make great leaders.", name: "Billy Diamond"}, 
      { quote: "We must open the doors and we must see to it they remain open, so that others can pass through.", name: "Rosemary Brown"}, 
      { quote: "I do not want to be the angel of any home; I want for myself what I want for other women, absolute equality. After that is secured, then men and women can take turns at being angels.", name: "Agnes Macphail"},
      { quote: "There is no such thing as a model or ideal Canadian... A society which emphasizes uniformity is one which creates intolerance and hate… What the world should be seeking, and what in Canada we must continue to cherish, are not concepts of uniformity but human values: compassion, love, and understanding.", name: "Pierre Trudeau"},
      { quote: "Those who take action have a disproportionate impact. The power of one is to move many.", name: "Elizabeth May"},
      { quote: "Every single day, we need to choose hope over fear, diversity over division.", name: "Justin Trudeau"},
      { quote: "I don't care for office for the sake of money, but for the sake of power, and for the sake of carrying out my own views of what is best for the country.", name: "Sir John A. Macdonald"},
      {}
    ];

    let num = Math.floor(Math.random() * politicalQuotes.length);

    this.quote = politicalQuotes[num].quote;
    this.name = politicalQuotes[num].name;
  }

}
