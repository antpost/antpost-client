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
import {CommentUpComponent} from './containers/comment-up/comment-up.component';
import {SelectedGroupsComponent} from './components/group/selected-groups/selected-groups.component';
import {PostTypePipe} from './pipes/postType.pipe';
import {ScheduleStatusPipe} from './pipes/scheduleStatus.pipe';
import {GroupSelectionComponent} from './components/group/group-selection/group-selection.component';
import {ScheduleListComponent} from './components/schedule/schedule-list/schedule-list.component';
import {ScheduleFormComponent} from './components/schedule/schedule-form/schedule-form.component';
import {JobProgressComponent} from './components/job/job-progress/job-progress.component';
import {GroupPostingComponent} from './containers/group-posting/group-posting.component';
import {GroupJoiningComponent} from './containers/group-joining/group-joining.component';
import {GroupFilterComponent} from './components/group/group-filter/group-filter.component';
import {GroupPrivacyPipe} from './pipes/group-privacy.pipe';
import {StoreAccountsComponent} from './containers/store-accounts/store-accounts.component';
import {AccountSearchingMethodComponent} from './components/account/account-searching-method/account-searching-method.component';
import {AccountFriendsSearchingComponent} from './components/account/account-friends-searching/account-friends-searching.component';
import {StoreAccountsFormComponent} from './components/account/store-accounts-form/store-accounts-form.component';
import {AccountSearchComponent} from './components/account/account-search/account-search.component';
import {FriendSelectionComponent} from './components/account/friend-selection/friend-selection.component';
import { AccountSelectionComponent } from './components/account/account-selection/account-selection.component';
import { PostInteractionComponent } from './components/account/post-interaction/post-interaction.component';
import {PageInteractionComponent} from './components/account/page-interaction/page-interaction.component';
import { GroupInteractionComponent } from './components/account/group-interaction/group-interaction.component';
import {UnfriendComponent} from './containers/unfriend/unfriend.component';
import {MakeFriendComponent} from './containers/make-friend/make-friend.component';
import {TargetGroupSelectionComponent} from './components/account/target-group-selection/target-group-selection.component';

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
    StoreAccountsComponent,
    MakeFriendComponent,
    UnfriendComponent,

    // components
    PostFormComponent,
    PostPreviewComponent,
    PostSelectorComponent,
    GroupPostScheduleComponent,
    JoinedGroupComponent,
    GroupPostHistoryComponent,
    GroupPostDetailComponent,
    SelectedGroupsComponent,
    GroupSelectionComponent,
    ScheduleListComponent,
    ScheduleFormComponent,
    JobProgressComponent,
    GroupFilterComponent,
    AccountSearchingMethodComponent,
    AccountFriendsSearchingComponent,
    StoreAccountsFormComponent,
    AccountSearchComponent,
    FriendSelectionComponent,
    PostInteractionComponent,
    AccountSelectionComponent,
    PageInteractionComponent,
    GroupInteractionComponent,
    TargetGroupSelectionComponent
];

export const PIPES = [
    PostTypePipe,
    ScheduleStatusPipe,
    GroupPrivacyPipe
];
