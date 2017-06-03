export interface IScheduleEngine {
    next(): Promise<any>;
    act(): Promise<any>;
    stop(): Promise<any>;
    delay(callback: Function): void;
}

export class BaseScheduleEngine {

}
