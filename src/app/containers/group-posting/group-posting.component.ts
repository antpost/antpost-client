import {Component, OnInit, ElementRef} from '@angular/core';
import {AbstractScheduleComponent} from '../base/abstractSchedule.component';
import {ScheduleType} from '../../models/enums';
import {GroupPostingMeta} from '../../core/engine/meta/group-posting.meta';
import {GroupSelectionComponent} from '../../components/group/group-selection/group-selection.component';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {Post} from '../../models/post.model';
import {PostSelectorComponent} from '../../components/post/post-selector/post-selector.component';

@Component({
    selector: 'app-group-posting',
    templateUrl: './group-posting.component.html',
    styleUrls: ['./group-posting.component.css']
})
export class GroupPostingComponent extends AbstractScheduleComponent{

    public post: Post = new Post();

    constructor(elementRef: ElementRef) {
        super(elementRef, GroupPostingMeta, ScheduleType.PostGroup);

        this.meta = Object.assign(GroupPostingMeta.prototype, {
            groups: []
        });
    }

    public selectGroups() {
        let dialog = this.modal.open({
            component: GroupSelectionComponent,
            inputs: {
                groups: this.meta.groups
            },
            title: 'Chọn nhóm'
        } as IModalOptions);

        dialog.then((result) => {
            this.meta.groups = result.map(g => {
                return {id: g.id, name: g.name};
            });
        });
    }

    public selectPost() {
        let dialog = this.modal.open({
            component: PostSelectorComponent,
            title: 'Chọn bài viết'
        });

        dialog.then((result: any) => {
            this.post = result;
        });
    }
}
