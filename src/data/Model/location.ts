export class Location
{
	location_id: string;
	venue_name: string;
	street_name: string;
	city: string;
	province: string;
	postal_code: string;
	createdAt: string;
	updatedAt: string;
	EventEventId: string;
	constructor(obj: any = null){
        if(obj != null){
            Object.assign(this, obj);
        }
    }
}