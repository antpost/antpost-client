import {RouteInfo} from './sidebar.metadata';
import {HomeComponent} from "../../components/home/home.component";
import {GroupPostScheduleComponent} from "../../components/group/schedule/groupPostSchedule.component";
import {GroupPostHistoryComponent} from "../../components/group/schedule/groupPostHistory.component";
import {JoinGroupFormComponent} from "../../components/group/joinGroupForm/joinGroupForm.component";
import {PostComponent} from "../../components/post/post.component";

export const ROUTES: any[] = [
    {path: 'home', title: 'Home', icon: 'dashboard', class: '', component: HomeComponent},
    {path: 'post-group', title: 'Đăng nhóm', icon: 'person', class: '', component: GroupPostScheduleComponent},
    {path: 'post-group-history', title: 'Lịch sử đăng nhóm', icon: 'person', class: '', component: GroupPostHistoryComponent},
    {path: 'join-group', title: 'Gia nhập nhóm', icon: 'library_books', class: '', component: JoinGroupFormComponent},
    {path: 'post', title: 'Bài viết', icon: 'content_paste', class: '', component: PostComponent},
    {path: 'comment', title: 'Bình luận', icon: 'bubble_chart', class: '', component: HomeComponent},
    {path: 'report', title: 'Báo cáo', icon: 'location_on', class: '', component: HomeComponent},
    {path: 'notifications', title: 'Notifications', icon: 'notifications', class: '', component: HomeComponent}
];
