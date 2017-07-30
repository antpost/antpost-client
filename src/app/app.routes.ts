import {Routes} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./components/login/login.component";
import {AntPostComponent} from './components/antpost.component';
import {HomeComponent} from './components/home/home.component';
import {PostComponent} from './components/post/post.component';
import {PostFormComponent} from './components/post/postForm.component';
import {PostPreviewComponent} from './components/post/postPreview.component';
import {PostSelectorComponent} from './components/post/postSelector.component';
import {GroupPostScheduleComponent} from './components/group/schedule/groupPostSchedule.component';
import {JoinedGroupComponent} from './components/group/joinedGroup/joinedGroup.component';
import {GroupPostHistoryComponent} from './components/group/schedule/groupPostHistory.component';
import {GroupPostDetailComponent} from './components/group/schedule/groupPostDetail.component';
import {JoinGroupFormComponent} from './components/group/joinGroupForm/joinGroupForm.component';
import {GroupSearchComponent} from './components/group/groupSearch/groupSearch.component';
import {NewCommentComponent} from './components/comment/newcomment.component';
import {CommentUpComponent} from './components/group/commentUp/commentUp.component';
import {SelectedGroupsComponent} from './components/group/selectedGroups/selectedGroups.component';
import {PostTypePipe} from './pipes/postType.pipe';
import {ScheduleStatusPipe} from './pipes/scheduleStatus.pipe';
import {GroupSelectionComponent} from './components/group/group-selection/group-selection.component';
import {ScheduleActionsComponent} from './components/common/schedule-actions/schedule-actions.component';
import {ScheduleProgressComponent} from './components/common/schedule-progress/schedule-progress.component';
import {ScheduleListComponent} from './components/common/schedule-list/schedule-list.component';

export const ROUTES: Routes = [
     {path: 'login', component: LoginComponent},
     {path: '', component: AntPostComponent, canActivate: [AuthService]},
    // {path: '', component: HomeComponent},
    // {path: 'home', component: HomeComponent, canActivate: [AuthService]},
    // {path: '**', component: NoContentComponent},
];

export const MODULE_COMPONENTS = [
    HomeComponent,
    LoginComponent,
    PostComponent,
    PostFormComponent,
    PostPreviewComponent,
    PostSelectorComponent,
    GroupPostScheduleComponent,
    JoinedGroupComponent,
    GroupPostHistoryComponent,
    GroupPostDetailComponent,
    JoinGroupFormComponent,
    GroupSearchComponent,
    NewCommentComponent,
    CommentUpComponent,
    SelectedGroupsComponent,
    GroupSelectionComponent,
    ScheduleActionsComponent,
    ScheduleProgressComponent,
    ScheduleListComponent
];

export const PIPES = [
    PostTypePipe,
    ScheduleStatusPipe
];
