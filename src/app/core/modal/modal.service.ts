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
            size: 'lg',
            inputs: {}
        }, options);

        let context = new CustomModalContext(options);

        return new Promise((resolve, reject) => {
            this.modal
                .open(ModalWrapperComponent, overlayConfigFactory(context, BSModalContext))
                .then((resultPromise) => {
                    return resultPromise.result
                        .then(
                            (result) => resolve(result),
                            () => {}
                        );
                });
        });

    }
}
