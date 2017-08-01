import {Injectable} from '@angular/core';
import {DialogRef, overlayConfigFactory} from 'angular2-modal';
import {BSModalContext, Modal} from 'angular2-modal/plugins/bootstrap';
import {default as ModalWrapperComponent, IModalOptions, CustomModalContext} from './modalWrapper.component';
declare var swal: any;

@Injectable()
export class ModalService {
    constructor(private modal: Modal) {
    }

    public open(options: IModalOptions): Promise<any> {
        options = Object.assign({
            showClose: true,
            size: 'lg',
            inputs: {}
        }, options);

        let context = new CustomModalContext(options);
        context.inElement = true;

        return new Promise((resolve, reject) => {
            this.modal
                .open(ModalWrapperComponent, overlayConfigFactory(context, BSModalContext, {
                    viewContainer: 'demo-head'
                }))
                .then((resultPromise) => {
                    return resultPromise.result
                        .then(
                            (result) => resolve(result),
                            () => {}
                        );
                });
        });

    }

    public confirm(options): Promise<any> {
        options = Object.assign({}, {
            title: 'Are you sure?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            confirmButtonClass: 'btn btn-success btn-sm',
            cancelButtonClass: 'btn btn-danger btn-sm',
            width: '400px'
        }, options);

        return swal(options);
    }

    public alert(options) {
        options = Object.assign({}, {
            title: 'Finished!',
            text: '',
            type: 'success',
            confirmButtonText: 'Đóng lại',
            confirmButtonClass: 'btn btn-success btn-sm',
            width: '400px'
        }, options);

        return swal(options);
    }
}
