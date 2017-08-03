import {FacebookService} from '../../services/facebook.service';
import {FbAccountService} from '../../services/fbaccount.service';
import {ServiceLocator} from '../serviceLocator';
import {Schedule} from '../../models/schedule.model';
import {FbAccount} from '../../models/fbaccount.model';
import {__await} from 'tslib';
import {createNgZone} from '@angular/platform-browser/testing/src/browser_util';
import {NgZone} from '@angular/core';
import {IResNextData} from '../jobs/iJob';

export interface IScheduleEngine {
    schedule: Schedule;
    getId(): string;
    getNext(): IResNextData;
    doNext(): Promise<IResNextData>;
    delay(callback: Function): void;
    init(): void;
    getTotal(): number;
}

export class BaseScheduleEngine {
    public schedule: Schedule;
    protected facebookService: FacebookService;
    protected fbAccountService: FbAccountService;

    protected account: FbAccount;

    constructor(schedule: Schedule) {
        this.getInjections();

        this.schedule = schedule;
    }

    public async init() {
        await this.loadAccount();
    }

    protected async loadAccount() {
        this.account = await this.fbAccountService.get(this.schedule.uid);
    }

    private getInjections() {
        this.facebookService = ServiceLocator.injector.get(FacebookService);
        this.fbAccountService = ServiceLocator.injector.get(FbAccountService);
    }
}
