import {Observable} from 'rxjs';

export interface IJob {
    start(onFinish: Function);
    getId(): string;
    observe(): Observable<any>;
}
