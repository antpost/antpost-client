import {OnInit, Component, Input} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Group} from '../../../models/group.model';
import {Toastr} from '../../../core/helpers/toastr';
import {ScheduleType} from '../../../models/enums';
import {JobFactory} from '../../../core/jobs/jobFactory';
import {ScheduleJob} from '../../../core/jobs/scheduleJob';
import {Schedule} from '../../../models/schedule.model';
import {AppManager} from '../../../core/appManager';

@Component({
    selector: 'comment-up',
    templateUrl: 'commentUp.component.html'
})
export class CommentUpComponent implements OnInit {

    public commentForm: any;
    public postNumbers: Array<any>;
    public delayList: Array<any>;
    public repeatList: Array<any>;
    public job: ScheduleJob;

    constructor(private facebookService: FacebookService, private appManager: AppManager) {
        this.commentForm = {
            numberOfPosts: 1,
            like: true,
            commentOnTop: true,
            delay: 5,
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        };

        this.postNumbers = [];
        for(let i = 1; i <= 5; i ++) {
            this.postNumbers.push({text: i, value: i});
        }

        this.delayList = [
            {text: '5 giây', value: 5},
            {text: '10 giây', value: 10},
            {text: '30 giây', value: 30},
            {text: '1 phút', value: 60},
            {text: '10 phút', value: 600}
        ];

        this.repeatList = [];
        for(let i = 1; i <= 24; i ++) {
            this.repeatList.push({text: `${i} giờ`, value: i * 60 * 60});
        }
    }

    public ngOnInit() {

    }

    public start() {
        if(!this.commentForm.message || !this.commentForm.message.trim()) {
            Toastr.error("Vui lòng nhập nội dung bình luận!");
            return;
        }

        let schedule = {
            uid: this.appManager.currentUser.id,
            delay: this.commentForm.delay,
            scheduleType: ScheduleType.Comment,
            meta: {
                message: this.commentForm.message,
                numberOfPosts: this.commentForm.numberOfPosts,
                like: this.commentForm.like,
                commentOnTop: this.commentForm.commentOnTop
            }
        } as Schedule;

        this.job = <ScheduleJob>JobFactory.createScheduleJob(schedule, ScheduleType.Comment);
        this.job.observe().subscribe((result) => {
            console.log(result);

        });
        this.job.start(() => {
            // on finish
        });
    }
}
