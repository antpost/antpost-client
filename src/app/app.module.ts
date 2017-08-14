import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {
    NgModule,
    ApplicationRef, Injector, ElementRef
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
import {ROUTES, MODULE_COMPONENTS, PIPES} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {AppState, InternalStateType} from './app.service';

import {AuthService} from './services/auth.service';

import '../styles/styles.scss';
import '../styles/headings.css';
import {AntPostModule} from './components/antpost.module';
import {AntPostComponent} from './containers/antpost/antpost.component';
import {SidebarModule} from './shared/sidebar/sidebar.module';
import {HashLocationStrategy, LocationStrategy, CommonModule} from '@angular/common';
import {NavbarModule} from './shared/navbar/navbar.module';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {ModalModule} from 'angular2-modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JobQueue} from "./core/jobs/jobQueue";
import {ServiceLocator} from "./core/serviceLocator";
import {AppRunner} from './core/appRunner';
import {TabsModule} from "ngx-bootstrap";
import {CoreModule} from "./core/core.module";
import {POPUP_CONTAINER, PopupModule} from '@progress/kendo-angular-popup';
import {GridModule} from "@progress/kendo-angular-grid";
import {UploadModule} from "@progress/kendo-angular-upload";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {LocalStorageService} from "./services/localStorage.service";
import {AppManager} from "./core/appManager";
import {GroupService} from "./services/group.service";
import {AutomationService} from "./services/automation.service";
import {FacebookService} from "./services/facebook.service";
import {PostService} from "./services/post.service";
import {FbAccountService} from './services/fbaccount.service';
import {ScheduleService} from './services/schedule.service';
import {StoreModule} from '@ngrx/store';
import {reducer} from './reducers';
import {RouterStoreModule} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {JoinedGroupEffects} from './effects/joined-group';
import {AccountEffects} from './effects/account';
import {GroupSearchEffects} from './effects/group-search';
import {FacebookProfileService} from './services/facebook-profile.service';

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
        AntPostComponent,
        MODULE_COMPONENTS, PIPES
    ],
    imports: [ // import Angular's modules
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        CoreModule,
        GridModule,
        UploadModule,
        DropDownsModule,
        PopupModule,
        DateInputsModule,
        NgbModule.forRoot(),
        TabsModule.forRoot(),
        BrowserAnimationsModule,
        //AntPostModule,
        CoreModule,
        SidebarModule,
        NavbarModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        TabsModule.forRoot(),
        JsonpModule,
        RouterModule.forRoot(ROUTES),

        /**
         * StoreModule.provideStore is imported once in the root module, accepting a reducer
         * function or object map of reducer functions. If passed an object of
         * reducers, combineReducers will be run creating your application
         * meta-reducer. This returns all providers for an @ngrx/store
         * based application.
         */
        StoreModule.provideStore(reducer),

        /**
         * @ngrx/router-store keeps router state up-to-date in the store and uses
         * the store as the single source of truth for the router's state.
         */
        RouterStoreModule.connectRouter(),

        /**
         * Store devtools instrument the store retaining past versions of state
         * and recalculating new states. This enables powerful time-travel
         * debugging.
         *
         * To use the debugger, install the Redux Devtools extension for either
         * Chrome or Firefox
         *
         * See: https://github.com/zalmoxisus/redux-devtools-extension
         */
        StoreDevtoolsModule.instrumentOnlyWithExtension(),

        /**
         * EffectsModule.run() sets up the effects class to be initialized
         * immediately when the application starts.
         *
         * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
         */
        EffectsModule.run(JoinedGroupEffects),
        EffectsModule.run(AccountEffects),
        EffectsModule.run(GroupSearchEffects)

        /**
         * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
         * service available.
         */
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS,
        AuthService,
        FbAccountService,
        AppRunner,
        PostService,
        FacebookService,
        FacebookProfileService,
        AutomationService,
        GroupService,
        AppManager,
        LocalStorageService,
        ScheduleService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {
            provide: POPUP_CONTAINER,
            useFactory: () => {
                //return the container ElementRef, where the popup will be injected
                return ({nativeElement: document.body} as ElementRef);
            }
        }
    ],
    entryComponents: [MODULE_COMPONENTS]
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public appState: AppState,
                private injector: Injector) {
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
