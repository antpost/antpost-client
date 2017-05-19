import {Routes} from '@angular/router';
import {HomeComponent} from './components/home';
import {NoContentComponent} from './components/no-content';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./components/login/login.component";

export const ROUTES: Routes = [
    // {path: 'login', component: LoginComponent},
    // {path: '', component: HomeComponent, canActivate: [AuthService]},
    // {path: '', component: HomeComponent},
    // {path: 'home', component: HomeComponent, canActivate: [AuthService]},
    // {path: '**', component: NoContentComponent},
];
