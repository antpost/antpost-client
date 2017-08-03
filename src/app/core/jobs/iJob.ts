import {Observable} from 'rxjs';
import {JobStatus} from '../../models/enums';

export interface IResNextData {
    id: any;
    name: string;
    message: string;
    done: boolean;
    type: number;
}

export interface IJob {
    status: JobStatus;
    total: number;
    doneCount: number;
    logs: Array<IResNextData>;

    start(onFinish?: Function);
    pause();
    resume();
    stop();
    getId(): string;
    observe(): Observable<any>;
}


