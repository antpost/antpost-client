export class Toastr {
    public static success(message: string) {
        (<any>window).$.notify({
            icon: "notifications",
            message: message

        },{
            type: 'success',
            timer: 1000,
            placement: {
                from: 'bottom',
                align: 'right'
            }
        });
    }
}
