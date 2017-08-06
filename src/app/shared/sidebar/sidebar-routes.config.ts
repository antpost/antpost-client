import {RouteInfo} from './sidebar.metadata';
import {HomeComponent} from "../../containers/home/home.component";
import {GroupPostScheduleComponent} from "../../components/group/schedule/groupPostSchedule.component";
import {GroupPostHistoryComponent} from "../../components/group/schedule/groupPostHistory.component";
import {JoinGroupFormComponent} from "../../components/group/joinGroupForm/joinGroupForm.component";
import {PostComponent} from "../../containers/post/post.component";
import {CommentUpComponent} from '../../containers/comment-up/comment-up.component';
import {GroupPostingComponent} from '../../containers/group-posting/group-posting.component';
import {GroupJoiningComponent} from '../../containers/group-joining/group-joining.component';


export const ROUTES: any[] = [
    {path: 'home', title: 'Tổng quan', icon: 'dashboard', class: '', component: HomeComponent},
    {
        path: 'group',
        title: 'Nhóm',
        icon: 'people',
        subroutes: [
            {path: 'post-group', title: 'Đăng nhóm', icon: 'send', class: '', component: GroupPostingComponent},
            //{path: 'post-group-history', title: 'Lịch sử đăng nhóm', icon: 'history', class: '', component: GroupPostHistoryComponent},
            {path: 'join-group', title: 'Gia nhập nhóm', icon: 'perm_contact_calendar', class: '', component: GroupJoiningComponent},
            //{path: 'invite-friend', title: 'Mời bạn vào nhóm', icon: 'contacts', class: '', component: JoinGroupFormComponent},
            {path: 'comment-up', title: 'Bình luận lên bài', icon: 'call_merge', class: '', component: CommentUpComponent},
        ]
    },
    {
        path: 'personal',
        title: 'Nuôi Nick',
        icon: 'person_pin',
        subroutes: [
            {path: 'post-feed', title: 'Đăng bài', icon: 'send', class: '', component: GroupPostScheduleComponent}
        ]
    },
    {
        path: 'fanpage',
        title: 'Fanpage',
        icon: 'web',
        subroutes: [
            {path: 'post-page', title: 'Đăng bài', icon: 'send', class: '', component: GroupPostScheduleComponent}
        ]
    },
    {
        path: 'account',
        title: 'Tài khoản',
        icon: 'recent_actors'
    },
    {path: 'post', title: 'Bài đăng mẫu', icon: 'content_paste', class: '', component: PostComponent},
    {path: 'logout', title: 'Thoát', icon: 'logout', class: ''}
];
