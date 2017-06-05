import {Schedule} from "./baseSchedule";
import {NodePost} from "./nodePost.model";
import {Group} from "./group.model";

export class SchedulePost extends Schedule {
    public id: number;
    public postId: number;
    public nodes: string;
    public status: number;

    public groups: Array<Group>;
    public nodePosts: Array<NodePost>;

    /**
     * Check if schedule has unposted groups
     */
    public hasUnposted(): boolean {
        return this.groups && this.getUnposted().length > 0;
    }

    /**
     * Get all unposted groups
     */
    public getUnposted(): Array<Group> {
        return this.groups.filter((group: Group) => {
            let post = this.nodePosts.find((p) => {
                return group.id == p.nodeId;
            });

            return !post;
        });
    }
}
