export class User
{
    userId: string;
    isAdmin: boolean;
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    verificationHash: string;
    partyAffiliation: string;
    affiliationApproved: boolean;
    rejectionCount: number;
    notificationsOn: boolean;
    createdAt: string;
    updatedAt: string;
}