export enum PostType {
    Message = 1,
    Link = 2,
    Sale = 3,
    Image = 4,
    Video = 5
}

export enum JobStatus {
    Opened = 0,
    Running = 1,
    Paused = 2,
    Stopped = 3
}

export enum JobEmitType {
    OnUpdateStatus = 1,
    OnProcessData = 2,
    OnDone = 3,
    Finished = 4
}

export enum ScheduleAction {
    Start = 1,
    Pause = 2,
    Resume = 3,
    Stop = 4
}

export enum ScheduleType {
    PostGroup = 1,
    JoinGroup = 2,
    Comment = 3,
    MakeFriend = 4
}

export enum AccountSearchingMethod {
    FriendsOfFriends = 1,
    FriendsOfAccount = 2,
    PostInteraction = 3,
    PageInteraction = 4,
    GroupInteraction = 5
}

export enum InteractionType {
    Like = 0,
    Comment = 1,
    Share = 2
}

export enum LoadingState {
    None = 0,
    Loading = 1,
    Completed = 2,
    Cancelled = 3
}

export enum AgeRange {
    Under15 = 1,
    From15To24 = 2,
    From25To34 = 3,
    From35To44 = 4,
    Above45 = 5
}

export enum GenderType {
    Male = 1,
    Female = 2
}

export enum RelationshipStatus {
    Single = 1,
    InARelationship = 2,
    InAnOpenRelationship = 3,
    Married = 4,
    Engaged = 5,
    Complicated = 6,
    Widowed = 7,
    Separated = 8,
    Divorced = 9,
    InACivilUnion = 10,
    InADomesticPartnership = 11
}
