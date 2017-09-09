import { BaseEngine, IScheduleEngine } from './baseEngine';
import { Schedule } from '../../models/schedule.model';
import { IResNextData } from '../jobs/iJob';
import { TargetAccountService } from '../../services/target-account.service';
import { ServiceLocator } from '../serviceLocator';
import { FacebookProfileService } from '../../services/facebook-profile.service';
import { AddedAccountService } from '../../services/added-account.service';
import { MakeFriendMeta } from './meta/make-friend.meta';
import { DateTimeHelper } from '../../helpers/dateTime.helper';
import { FacebookHelper } from '../../helpers/facebook.helper';

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

        if (addedAccounts) {
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
            id: item.accountId,
            name: item.accountName,
        } as IResNextData : null;
    }

    public doNext(): Promise<any> {
        return new Promise<IResNextData>((resolve) => {
            setTimeout(async () => {
                this.isFirst = false;
                let acc: any = await this.makeFriend();
                resolve({
                    id: acc.id,
                    name: acc.name,
                    done: true,
                    message: acc.errMsg ? acc.errMsg : 'Thành công'
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
        const isFriend = await this.facebookProfileService.checkIsFriend(this.account, accItem.accountId);
        accItem.status = true;
        if (!isFriend) {
            const message = await this.checkValidToAdd(accItem);

            if (!message) {
                const status = await this.facebookProfileService.addFriend(this.account, accItem.accountId);
            } else {
                return {
                    id: accItem.accountId,
                    name: accItem.accountName,
                    errMsg: message
                };
            }
        }

        return {
            id: accItem.accountId,
            name: accItem.accountName
        };
    }

    private async checkValidToAdd(accItem) {
        const options: MakeFriendMeta = this.schedule.meta;
        let message = null;

        // check valid gender
        const checkGender = (gender: string, info) => {
            if(!gender) {
                return true;
            }

            return info.gender == gender
        };

        // check age in range
        const checkAge = (ageRangeType: number, info) => {
            if(!ageRangeType) {
                return true;
            }

            if(info.birthday) {
                let accountAge = DateTimeHelper.getAge(new Date(info.birthday));
                return DateTimeHelper.inAgeRange(ageRangeType, accountAge);
            } else {
                return false;
            }
        };

        // check relationship in selected
        const checkRelationship = (relationships: number[], info) => {
            if(relationships && relationships.length) {
                return FacebookHelper.checkRelationship(relationships, info.relationship_status);
            }

            return true;
        };

        let valid = true;
        if (options.gender || options.age || (options.relationships && options.relationships.length > 0)) {
            // load basic information of account
            const info = await this.facebookProfileService
                .getUserInfoAsync(this.account, accItem.accountId, {fields: 'age_range,birthday,gender,relationship_status,location'});

            if(!info.gender) {
                valid = false;
                message = 'Không phải người dùng facebook'; // may be is fanpage
            } else {
                valid = checkGender(options.gender, info) && checkAge(options.age, info) && checkRelationship(options.relationships, info);
                if(!valid) {
                    message = 'Giới tính hoặc độ tuổi hoặc tình trạng mối quan hệ không thỏa mãn hoặc không được cung cấp';
                }
            }
        }

        // check friend count
        if (valid && options.friendCount) {
            const numberOfFriends = await this.facebookProfileService.countFriend(this.account, accItem.accountId);

            if(numberOfFriends < options.friendCount) {
                valid = false;
                message = 'Số bạn không thỏa mãn';
            }
        }

        // check last post time
        if (valid && options.lastPostTime) {
            const posts = await this.facebookProfileService.loadFeed(this.account, accItem.accountId, 1);
            if(!posts || posts.length == 0) {
                valid = false;
            } else {
                const postCreatedTime = new Date(posts[0].created_time);
                const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
                let fromTime = new Date(Date.now() - options.lastPostTime * ONE_DAY_TIME);

                valid = postCreatedTime.getTime() - fromTime.getTime() >= 0;
            }

            if(!valid) {
                message = 'Bài đăng không thỏa mãn';
            }
        }

        return message;
    }
}
