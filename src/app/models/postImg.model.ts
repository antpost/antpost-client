export class Post {
    public id?: number;
    public title?: string;
    public message?: string;
    public type?: number;
    public createdAt?: Date;
    public updatedAt?: Date;

    // image
    public linkUrl?: string;
    public linkTitle?: string;
    public linkDescription?: string;
    public linkCaption?: string;
    public imageUrl?: string;

    // sale
    public productName?: string;
    public price?: number;
    public location?: string;

    public images?: Array<string>;
    public image: string;

    public status?: number;
}
