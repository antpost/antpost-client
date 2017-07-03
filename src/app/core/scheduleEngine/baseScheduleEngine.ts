export interface IScheduleEngine {
    getId(): string;
    hasNext(): boolean;
    doNext(doneCallback: Function): void;
    stop(): Promise<any>;
    pause(): Promise<any>;
    delay(callback: Function): void;
}

export class BaseScheduleEngine {

}
