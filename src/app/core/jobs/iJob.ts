import {Observable} from 'rxjs';

export interface IJob {
    start(onFinish: Function);
    pause();
    resume();
    stop();
    getId(): string;
    observe(): Observable<any>;
}
