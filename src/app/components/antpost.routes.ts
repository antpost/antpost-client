import {Route} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {PostComponent} from "./post/post.component";
import {PostFormComponent} from './post/postForm.component';
import {PostPreviewComponent} from './post/postPreview.component';
import {PostSelectorComponent} from "./post/postSelector.component";
import {GroupPostComponent} from './group/joinedGroup/groupPost.component';
import {GroupPostScheduleComponent} from './group/schedule/groupPostSchedule.component';
import {JoinedGroupComponent} from './group/joinedGroup/joinedGroup.component';
import {AuthService} from '../services/auth.service';
import {PostTypePipe} from '../pipes/postType.pipe';

export const MODULE_ROUTES: Route[] = [
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent, canActivate: [AuthService]},
    {path: 'post', component: PostComponent, canActivate: [AuthService]},
    {path: 'post-group', component: GroupPostScheduleComponent, canActivate: [AuthService]}
];

export const MODULE_COMPONENTS = [
    HomeComponent,
    LoginComponent,
    PostComponent,
    PostFormComponent,
    PostPreviewComponent,
    PostSelectorComponent,
    GroupPostScheduleComponent,
    JoinedGroupComponent
];

export const PIPES = [
    PostTypePipe
];
