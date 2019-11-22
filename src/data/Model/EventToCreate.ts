export class EventToCreate
{
    event_id: number;
    event_title: String;
    event_description: String;
    photo: String;
    //partyAffiliation: String;
   // date_to: String;
    date_from: String;
    time_from: String;
    time_to: String;
    attendee_limit: number;
    venue_name: String;
	street_name: String;
	city:String;
	province:String;
    postal_code:String;
    isApproved: boolean;
    userId: String;
}