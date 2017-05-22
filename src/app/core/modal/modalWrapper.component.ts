import {Component, OnInit, ElementRef} from '@angular/core';
import {ModalComponent, CloseGuard, DialogRef} from 'angular2-modal';
import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export interface IComponentData {
    component: any,
    inputs?: any
}

export interface IModalAction {
    text: string,
    action: Function
}

export interface IModalOptions{
    component?: any,
    inputs?: any,
    title?: string,
    body?: string,
    showClose?: boolean,
    size?: string,
    actions?: Array<IModalAction>
}

export class CustomModalContext extends BSModalContext implements IModalOptions{
    constructor(public options: IModalOptions) {
        super();
    }
}

@Component({
    selector: 'modal-wrapper',
    template: `
    <div class="modal-header">
        <button aria-label="Close" class="close" type="button" *ngIf="context.options.showClose" (click)="cancel()">
          <span aria-hidden="true">×</span>
        </button>
        <h3 class="modal-title">
            {{context.options.title}}
        </h3>
    </div>
    
    <div class="modal-body">
        <dynamic-component [componentData]="componentData"></dynamic-component>
    </div>
    <div class="modal-footer">
        <button class="btn btn-primary">OK</button>
    </div>
        
      `,
})
export default class ModalWrapperComponent implements OnInit, CloseGuard, ModalComponent<CustomModalContext> {
    public componentData: IComponentData;
    public context: CustomModalContext;


    constructor(public dialog: DialogRef<CustomModalContext>) {
        this.componentData = {
            component: dialog.context.options.component,
            inputs: dialog.context.options.inputs
        } as IComponentData;

        this.context = dialog.context;

        dialog.setCloseGuard(this);
    }

    public ngOnInit() {

    }

    onKeyUp(value) {
        this.dialog.close();
    }

    cancel() {
        this.dialog.close();
    }

    beforeDismiss(): boolean {
        return false;
    }

    beforeClose(): boolean {
        return false;
    }
}
