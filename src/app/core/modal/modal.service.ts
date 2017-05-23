import {Injectable} from '@angular/core';
import {DialogRef, overlayConfigFactory} from 'angular2-modal';
import {BSModalContext, Modal} from 'angular2-modal/plugins/bootstrap';
import {default as ModalWrapperComponent, IModalOptions, CustomModalContext} from './modalWrapper.component';

@Injectable()
export class ModalService {
    constructor(private modal: Modal) {
    }

    public open(options: IModalOptions): Promise<DialogRef<any>> {
        options = Object.assign({
            showClose: true,
            size: 'lg'
        }, options);

        let context = new CustomModalContext(options);

        return this.modal
            .open(ModalWrapperComponent, overlayConfigFactory(context, BSModalContext));

    }
}
