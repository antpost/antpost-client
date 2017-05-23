import {Http, Response} from "@angular/http";
import {AppConfig} from "../app.config";
import {Observable} from "rxjs";
import {Dexie} from 'dexie';
import {DbService} from '../core/database';

export class BaseService<T> {
    protected apiPath: string = AppConfig.basePath + 'api/';
    protected table: Dexie.Table<T, number>;

    constructor(private db: DbService, tableName: string) {
        this.table = this.db.table(tableName);
    }

    public add(data) {
        return this.table.add(data);
    }
}
