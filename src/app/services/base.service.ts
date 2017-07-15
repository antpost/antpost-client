import {AppConfig} from "../app.config";
import {Dexie} from 'dexie';
import {DbService} from '../core/database';

export class BaseService<U, T> {
    protected apiPath: string = AppConfig.basePath + 'api/';
    protected table: Dexie.Table<U, T>;

    constructor(private db: DbService, tableName: string) {
        this.table = this.db.table(tableName);
    }

    public async get(key: T) {
        return await this.table.get(key);
    }

    public async add(data: U) {
        return await this.table.add(data);
    }

    public async update(key: T, changes: any) {
        return await this.table.update(key, changes);
    }

    public async all(): Promise<Array<U>> {
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

    public async getByIds(ids: Array<any>): Promise<Array<U>> {
        return await this.table.where('id').anyOf(ids).toArray();
    }
}
