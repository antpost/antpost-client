export interface IScheduleEngine {
    hasNext(): boolean;
    doSchedule(doneCallback: Function): void;
    stop(): Promise<any>;
    delay(callback: Function): void;
}

export class BaseScheduleEngine {

}
