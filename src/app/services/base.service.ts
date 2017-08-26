import {AppConfig} from "../app.config";
import {DbService} from '../core/database';
import Dexie from 'dexie';

export class BaseService<U, T> {
    protected apiPath: string = AppConfig.basePath + 'api/';
    public table: Dexie.Table<U, T>;

    constructor(public db: DbService, public tableName: string) {
        this.table = this.db.table<U, T>(tableName);
    }

    public async get(key: T) {
        return await this.db.table<U, T>(this.tableName).get(key);
    }

    public async add(data: U) {
        return await this.db.table<U, T>(this.tableName).add(data);
    }

    public async update(key: T, changes: any) {
        return await this.db.table<U, T>(this.tableName).update(key, changes);
    }

    public getAll(): Dexie.Collection<U, T> {
        return this.db.table<U, T>(this.tableName).toCollection();
    }

    public async list(options: any): Promise<Array<U>> {
        let query: any = this.table;

        if (!options) {
            options = {};
        }

        if (options.orderBy) {
            query = query.orderBy(options.orderBy);
        }
        if (options.orderDirection === 'desc') {
            query = query.reverse();
        }

        return await query.toArray();
    }

    public async delete(key: any) {
        return await this.db.table<U, T>(this.tableName).delete(key);
    }

    public async addAll(list: Array<U>): Promise<void> {
        this.db.transaction('rw', this.db.table<U, T>(this.tableName), async () => {
            await this.db.table<U, T>(this.tableName).clear();

            list.forEach((item: U) => {
                this.db.table<U, T>(this.tableName).add(item);
            });
        }).then((result) => {
            console.log("Transaction committed");
        }).catch((e) => {
            console.error(e.stack);
        });
    }

    public async getByIds(ids: Array<any>): Promise<Array<U>> {
        return await this.db.table<U, T>(this.tableName).where('id').anyOf(ids).toArray();
    }

    public filter(filter: (entity: U) => boolean): Dexie.Collection<U, T> {
        return this.db.table<U, T>(this.tableName).filter(filter);
    }

    /**
     * @desc: Add item of current model
     * @param: {entity<T>} entity need added
     * @returns: {Promise<T>} Promise with added entity
     */
    public async addAsync(entity: U): Promise<T> {
        return await this.db.table(this.tableName).add(entity);
    }

    /**
     * @desc: Update item of current model
     * @param: {entity<T>} entity need update
     * @returns: {Promise<T>} Promise with updated entity
     */
    public async updateAsync(entity: U): Dexie.Promise<T> {
        return await this.db.table(this.tableName).put(entity);
    }

    public async bulkAdd(entities: U[]) {
        return await this.db.table(this.tableName).bulkAdd(entities);
    }

    public async bulkPut(entities: U[]) {
        return await this.db.table(this.tableName).bulkPut(entities);
    }

    public async bulkDelete(keys: any[]) {
        return await this.db.table(this.tableName).bulkDelete(keys);
    }
}
