import {Route} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {PostComponent} from "./post/post.component";
import {PostFormComponent} from './post/postForm.component';
import {PostPreviewComponent} from './post/postPreview.component';
import {PostSelectorComponent} from "./post/postSelector.component";

export const MODULE_ROUTES: Route[] = [
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent},
    {path: 'post', component: PostComponent},
    {path: 'post-group', component: PostComponent}
];

export const MODULE_COMPONENTS = [
    HomeComponent,
    LoginComponent,
    PostComponent,
    PostFormComponent,
    PostPreviewComponent,
    PostSelectorComponent
];
