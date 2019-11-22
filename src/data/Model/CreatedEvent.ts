import { Event } from './Event';
import { User } from './User';
import { Feedback } from './Feedback';
import { Admin } from './Admin';

export class CreatedEvent
{
    event: Event;
    creator: User;
    registeredUsers: User[];
    feedbackId: Feedback;
    status: String;
    approvedByAdmin: Admin;
}