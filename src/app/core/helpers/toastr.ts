export class Toastr {
    public static success(message: string) {
        (<any>window).$.notify({
            icon: "notifications",
            message
        }, {
            type: 'success',
            timer: 500,
            delay: 2000,
            placement: {
                from: 'bottom',
                align: 'right'
            }
        });
    }

    public static error(message: string) {
        (<any>window).$.notify({
            icon: "notifications",
            message
        }, {
            type: 'danger',
            timer: 500,
            delay: 2000,
            placement: {
                from: 'bottom',
                align: 'right'
            }
        });
    }

    public static info(message: string) {
        (<any>window).$.notify({
            icon: "notifications",
            message
        }, {
            type: 'info',
            timer: 1000,
            placement: {
                from: 'bottom',
                align: 'right'
            }
        });
    }
}
