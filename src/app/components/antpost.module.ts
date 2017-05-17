import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './antpost.routes';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [ MODULE_COMPONENTS ]
})

export class AntPostModule{}
