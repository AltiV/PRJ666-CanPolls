import { PipeTransform,Pipe } from '@angular/core';
import { OfficialEvent } from '../../data/Model/OfficialEvent';


@Pipe({
    name:'provinceFilter'
})
export class ProvinceFilterPipe implements PipeTransform
{
    transform(ofEvent:OfficialEvent[],searchProv:string):OfficialEvent[]{
                if(!ofEvent||!searchProv)
                {
                    return ofEvent;
                }

                return ofEvent.filter(event => 
                    event.province.toLowerCase().indexOf(searchProv.toLowerCase())!==-1);
    }
}