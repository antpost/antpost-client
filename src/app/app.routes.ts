import {Routes} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {LoginComponent} from "./components/login/login.component";
import {AntPostComponent} from './components/antpost.component';

export const ROUTES: Routes = [
     {path: 'login', component: LoginComponent},
     {path: '', component: AntPostComponent, canActivate: [AuthService]},
    // {path: '', component: HomeComponent},
    // {path: 'home', component: HomeComponent, canActivate: [AuthService]},
    // {path: '**', component: NoContentComponent},
];
