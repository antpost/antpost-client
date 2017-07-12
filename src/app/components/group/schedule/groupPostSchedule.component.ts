import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';
import {PostSelectorComponent} from '../../post/postSelector.component';
import {Post} from '../../../models/post.model';
import {Toastr} from '../../../core/helpers/toastr';
import {Group} from '../../../models/group.model';
import {JoinedGroupComponent} from '../joinedGroup/joinedGroup.component';
import {SchedulePost} from '../../../models/schedulePost.model';
import {JobStatus, ScheduleType} from "../../../models/enums";
import {SchedulePostService} from "../../../services/schedulePost.service";
import {JobQueue} from "../../../core/jobs/jobQueue";
import {JobFactory} from "../../../core/jobs/jobFactory";
import {ScheduleJob} from "../../../core/jobs/scheduleJob";
import {GroupPostDetailComponent} from './groupPostDetail.component';

@Component({
    selector: 'group-post-schedule',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPostSchedule.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostScheduleComponent implements OnInit {

    @ViewChild(JoinedGroupComponent)
    public joinedGroupComponent: JoinedGroupComponent;

    @ViewChild(GroupPostDetailComponent)
    public groupPostDetailComponent: GroupPostDetailComponent;

    public post: Post = new Post();
    public schedule: SchedulePost = new SchedulePost();
    public scheduleStatus = JobStatus;
    public job: ScheduleJob;
    public started: boolean = false;
    public percent: number = 0;

    constructor(private postService: PostService,
                private schedulePostService: SchedulePostService,
                private modal: ModalService,
                private jobQueue: JobQueue) {
        this.schedule.status = JobStatus.Opened;
    }

    public ngOnInit() {

    }

    public selectPost() {
        let dialog = this.modal.open({
            component: PostSelectorComponent,
            title: 'Chọn bài viết'
        });

        dialog.then((result: any) => {
            this.post = result;
        });
    }

    public async start() {
        if (!this.post.id) {
            Toastr.error('Bạn hãy chọn 1 bài viết đã lưu trước.');
            return;
        }

        // check no groups selected
        let groups = this.joinedGroupComponent.getSelectedGroups();
        if(groups.length == 0) {
            Toastr.error('Bạn phải chọn ít nhất 1 nhóm để đăng.');
            return;
        }

        this.started = true;

        // save schedule
        this.schedule = new SchedulePost();
        this.schedule.postId = this.post.id;
        this.schedule.status = JobStatus.Running;
        this.schedule.nodes = groups.map(group => group.id).join(',');
        this.schedule.createdAt = new Date();

        let id = await this.schedulePostService.add(this.schedule);

        this.schedule.post = this.post;
        this.schedule.groups = groups;
        this.groupPostDetailComponent.refresh();

        this.job = <ScheduleJob>JobFactory.createScheduleJob(this.schedule, ScheduleType.Post);

        this.jobQueue.push(this.job);

        this.job.observe().subscribe((result) => {
            console.log(result);
            if(result.status !== undefined) {
                this.schedule.status = result.status;
            } else {
                this.percent = this.schedule.nodePosts.length / this.schedule.groups.length * 100;
            }
            this.groupPostDetailComponent.refresh();
        });
    }

    public pause() {
        this.jobQueue.remove(this.job.getId());
        this.job.pause();
    }

    public stop() {
        this.jobQueue.remove(this.job.getId());
        this.job.stop();
    }

    public resume() {
        this.schedule.status = JobStatus.Running;
        this.jobQueue.push(this.job);
    }

    public progressMessage() {
        let message = '';

        message = `${this.schedule.nodePosts ? this.schedule.nodePosts.length : 0}/${this.schedule.groups ? this.schedule.groups.length : 0}`;

        return message;
    }
}
