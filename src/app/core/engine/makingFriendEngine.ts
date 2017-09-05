import {BaseEngine, IScheduleEngine} from './baseEngine';
import {Schedule} from '../../models/schedule.model';
import {IResNextData} from '../jobs/iJob';
import {TargetAccountService} from '../../services/target-account.service';
import {ServiceLocator} from '../serviceLocator';
import {FacebookProfileService} from '../../services/facebook-profile.service';
import {AddedAccountService} from '../../services/added-account.service';

export class MakingFriendEngine extends BaseEngine implements IScheduleEngine {
    public static ENGINE_KEY = 'MAKINGFRIEND_ENGINE';

    private isFirst: boolean = true;
    private targetAccounts: any[] = [];

    private targetAccountService: TargetAccountService;
    private addedAccountService: AddedAccountService;
    private facebookProfileService: FacebookProfileService;

    constructor(schedule: Schedule) {
        super(schedule);

        this.targetAccountService = ServiceLocator.injector.get(TargetAccountService);
        this.addedAccountService = ServiceLocator.injector.get(AddedAccountService);
        this.facebookProfileService = ServiceLocator.injector.get(FacebookProfileService);

    }

    public async init() {
        await this.loadAccount();

        // load target accounts
        this.targetAccounts = await this.targetAccountService.filter((item) => item.groupId == this.schedule.meta.targetGroupId).toArray();
        let addedAccounts = await this.addedAccountService.table.where('uid').equals(this.account.id).toArray();

        if(addedAccounts) {
            this.targetAccounts = this.targetAccounts.filter(acc => !addedAccounts.find(i => i.accountId == acc.id));
        }
    }

    public getId() {
        return MakingFriendEngine.ENGINE_KEY + this.schedule.id;
    }

    public getTotal(): number {
        return this.targetAccounts.length;
    }

    public getNext(): any {
        let item = this.getNextAccount();
        return item ? {
            id: item.id,
            name: item.name,
        } as IResNextData : null;
    }

    public doNext(): Promise<any> {
        return new Promise<IResNextData>((resolve) => {
            setTimeout(async () => {
                this.isFirst = false;
                let acc = await this.makeFriend();
                resolve({
                    id: acc.id,
                    name: acc.name,
                    done: true,
                    message: 'Thành công'
                } as IResNextData);

            }, this.isFirst ? 0 : this.schedule.delay * 1000);
        });
    }

    private getNextAccount() {
        return this.targetAccounts.find(item => !item.status);
    }

    private async makeFriend() {
        let accItem = this.getNextAccount();

        // check is friend
        const isFriend = await this.facebookProfileService.checkIsFriend(this.account, accItem.id);
        if(!isFriend) {
            const status = await this.facebookProfileService.addFriend(this.account, accItem.id);
            accItem.status = true;
            return accItem;
        }
    }
}
