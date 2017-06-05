import {Pipe, PipeTransform} from '@angular/core';
import {PostType} from '../models/enums';

@Pipe({name: 'postType'})
export class PostTypePipe implements PipeTransform {
    public transform(value: string, args: string[]): any {
        let postType = parseInt(value);
        switch (postType) {
            case PostType.Message:
                return 'Bài viết';
            case PostType.Link:
                return 'Liên kết';
            case PostType.Sale:
                return 'Bán hàng';
            case PostType.Image:
                return 'Hình ảnh';
            case PostType.Video:
                return 'Video';
        }
    }
}
