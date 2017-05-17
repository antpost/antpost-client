import {Route} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';

export const MODULE_ROUTES: Route[] = [
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent}
]

export const MODULE_COMPONENTS = [
    HomeComponent,
    LoginComponent
]
