import {Injectable} from '@angular/core';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class SharedService {
    public currentUser: FbAccount
}
