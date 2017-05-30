import {Http, Response} from "@angular/http";
import {AppConfig} from "../app.config";
import {Observable} from "rxjs";
import {Dexie} from 'dexie';
import {DbService} from '../core/database';
import {__await} from 'tslib';

export class BaseService<U, T> {
    protected apiPath: string = AppConfig.basePath + 'api/';
    protected table: Dexie.Table<U, T>;

    constructor(private db: DbService, tableName: string) {
        this.table = this.db.table(tableName);
    }

    public async add(data) {
        return await this.table.add(data);
    }

    public async all() {
        return await this.table.toArray();
    }

    public async delete(key: any) {
        return await this.table.delete(key);
    }

    public async addAll(list: Array<U>): Promise<void> {
        this.db.transaction('rw', this.table, async () => {
            await this.table.clear();

            list.forEach((item: U) => {
                this.table.add(item);
            });
        }).then((result) => {
            console.log("Transaction committed");
        }).catch((e) => {
            console.error(e.stack);
        });
    }
}
