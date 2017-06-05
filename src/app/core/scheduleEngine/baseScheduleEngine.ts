export interface IScheduleEngine {
    hasNext(): boolean;
    doNext(doneCallback: Function): void;
    stop(): Promise<any>;
    delay(callback: Function): void;
}

export class BaseScheduleEngine {

}
