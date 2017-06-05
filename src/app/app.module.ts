import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {
    NgModule,
    ApplicationRef, Injector
} from '@angular/core';
import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer
} from '@angularclass/hmr';
import {
    RouterModule
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {ROUTES} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {AppState, InternalStateType} from './app.service';

import {AuthService} from './services/auth.service';

import '../styles/styles.scss';
import '../styles/headings.css';
import {AntPostModule} from './components/antpost.module';
import {AntPostComponent} from './components/antpost.component';
import {SidebarModule} from './shared/sidebar/sidebar.module';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NavbarModule} from './shared/navbar/navbar.module';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {ModalModule} from 'angular2-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JobQueue} from "./core/jobs/jobQueue";
import {ServiceLocator} from "./core/serviceLocator";

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState,
    JobQueue
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        AntPostComponent
    ],
    imports: [ // import Angular's modules
        BrowserModule,
        BrowserAnimationsModule,
        AntPostModule,
        SidebarModule,
        NavbarModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        RouterModule.forRoot([])
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS,
        AuthService,
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public appState: AppState,
                injector: Injector) {
        ServiceLocator.injector = injector;
    }

    public hmrOnInit(store: StoreType) {
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
