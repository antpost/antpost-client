import {Http, Response} from "@angular/http";
import {AppConfig} from "../app.config";
import {Observable} from "rxjs";

export class BaseService {
    protected apiPath: string = AppConfig.basePath + 'api/';

    constructor() {

    }
}
