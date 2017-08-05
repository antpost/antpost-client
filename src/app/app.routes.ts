import {Routes} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./containers/login/login.component";
import {AntPostComponent} from './containers/antpost/antpost.component';
import {HomeComponent} from './containers/home/home.component';
import {PostComponent} from './containers/post/post.component';
import {PostFormComponent} from './components/post/post-form/post-form.component';
import {PostPreviewComponent} from './components/post/post-preview/post-preview.component';
import {PostSelectorComponent} from './components/post/post-selector/post-selector.component';
import {GroupPostScheduleComponent} from './components/group/schedule/groupPostSchedule.component';
import {JoinedGroupComponent} from './components/group/joinedGroup/joinedGroup.component';
import {GroupPostHistoryComponent} from './components/group/schedule/groupPostHistory.component';
import {GroupPostDetailComponent} from './components/group/schedule/groupPostDetail.component';
import {JoinGroupFormComponent} from './components/group/joinGroupForm/joinGroupForm.component';
import {GroupSearchComponent} from './components/group/groupSearch/groupSearch.component';
import {CommentUpComponent} from './containers/comment-up/comment-up.component';
import {SelectedGroupsComponent} from './components/group/selectedGroups/selectedGroups.component';
import {PostTypePipe} from './pipes/postType.pipe';
import {ScheduleStatusPipe} from './pipes/scheduleStatus.pipe';
import {GroupSelectionComponent} from './components/group/group-selection/group-selection.component';
import {ScheduleListComponent} from './components/common/schedule-list/schedule-list.component';
import {ScheduleFormComponent} from './components/common/schedule-form/schedule-form.component';
import {JobProgressComponent} from './components/common/job-progress/job-progress.component';
import {GroupPostingComponent} from './containers/group-posting/group-posting.component';
import {GroupJoiningComponent} from './containers/group-joining/group-joining.component';

export const ROUTES: Routes = [
     {path: 'login', component: LoginComponent},
     {path: '', component: AntPostComponent, canActivate: [AuthService]},
    // {path: '', component: HomeComponent},
    // {path: 'home', component: HomeComponent, canActivate: [AuthService]},
    // {path: '**', component: NoContentComponent},
];

export const MODULE_COMPONENTS = [
    // containers
    HomeComponent,
    LoginComponent,
    PostComponent,
    GroupPostingComponent,
    GroupJoiningComponent,
    CommentUpComponent,

    // components
    PostFormComponent,
    PostPreviewComponent,
    PostSelectorComponent,
    GroupPostScheduleComponent,
    JoinedGroupComponent,
    GroupPostHistoryComponent,
    GroupPostDetailComponent,
    JoinGroupFormComponent,
    GroupSearchComponent,
    SelectedGroupsComponent,
    GroupSelectionComponent,
    ScheduleListComponent,
    ScheduleFormComponent,
    JobProgressComponent
];

export const PIPES = [
    PostTypePipe,
    ScheduleStatusPipe
];
