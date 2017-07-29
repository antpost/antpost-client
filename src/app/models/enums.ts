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

export enum ScheduleAction {
    Start = 1,
    Pause = 2,
    Resume = 3,
    Stop = 4
}

export enum ScheduleType {
    Post = 1,
    Join = 2,
    Comment = 3
}
