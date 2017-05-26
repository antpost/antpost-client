import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {
    public getLastSaved(key: string) {
        return localStorage.getItem(key);
    }

    public save(key: string, value?: any) {
        localStorage.setItem(key, new Date().getTime() + '');
    }
}
