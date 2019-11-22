import { User } from 'src/data/Model/User';
export class EventWithUserObj
{
    event_id: number;
    event_title: string;
    event_description: string;
   // date_to: string;
    date_from: string;
    time_from: string;
    time_to: string;
    attendee_limit: number;
    isApproved: boolean;
    UserUserId: string;
    createdAt: string;
    updatedAt: string;
    User: User;
}