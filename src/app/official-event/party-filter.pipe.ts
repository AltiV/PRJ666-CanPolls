import { PipeTransform,Pipe } from '@angular/core';
import { OfficialEvent } from 'src/data/Model/OfficialEvent';


@Pipe({
    name:'partyFilter'
})
export class PartyFilterPipe implements PipeTransform
{
    transform(ofEvent:OfficialEvent[],searchParty:string):OfficialEvent[]{
                if(!ofEvent||!searchParty)
                {
                    return ofEvent;
                }

                return ofEvent.filter(event => 
                    event.party.toLowerCase().indexOf(searchParty.toLowerCase())!==-1);
    }
}