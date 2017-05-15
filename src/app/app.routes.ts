import {Routes} from '@angular/router';
import {HomeComponent} from './home';
import {AboutComponent} from './about';
import {NoContentComponent} from './no-content';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./login/login.component";

export const ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: HomeComponent, canActivate: [AuthService]},
    {path: 'home', component: HomeComponent, canActivate: [AuthService]},
    {path: 'about', component: AboutComponent},
    {path: 'detail', loadChildren: './+detail#DetailModule'},
    {path: 'barrel', loadChildren: './+barrel#BarrelModule'},
    {path: '**', component: NoContentComponent},
];
