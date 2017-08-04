import {RouteInfo} from './sidebar.metadata';
import {HomeComponent} from "../../components/home/home.component";
import {GroupPostScheduleComponent} from "../../components/group/schedule/groupPostSchedule.component";
import {GroupPostHistoryComponent} from "../../components/group/schedule/groupPostHistory.component";
import {JoinGroupFormComponent} from "../../components/group/joinGroupForm/joinGroupForm.component";
import {PostComponent} from "../../components/post/post.component";
import {NewCommentComponent} from "../../components/comment/newcomment.component";
import {CommentUpComponent} from '../../components/group/commentUp/commentUp.component';


export const ROUTES: any[] = [
    {path: 'home', title: 'Tổng quan', icon: 'dashboard', class: '', component: HomeComponent},
    {
        path: 'group',
        title: 'Nhóm',
        icon: 'people',
        subroutes: [
            {path: 'post-group', title: 'Đăng nhóm', icon: 'send', class: '', component: GroupPostScheduleComponent},
            {path: 'post-group-history', title: 'Lịch sử đăng nhóm', icon: 'history', class: '', component: GroupPostHistoryComponent},
            {path: 'join-group', title: 'Gia nhập nhóm', icon: 'perm_contact_calendar', class: '', component: JoinGroupFormComponent},
            {path: 'invite-friend', title: 'Mời bạn vào nhóm', icon: 'contacts', class: '', component: JoinGroupFormComponent},
            {path: 'comment-up', title: 'Bình luận lên bài', icon: 'call_merge', class: '', component: CommentUpComponent},
        ]
    },
    {
        path: 'personal',
        title: 'Cá nhân',
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
    {path: 'post', title: 'Bài đăng', icon: 'content_paste', class: '', component: PostComponent},
    {path: 'comment', title: 'Bình luận', icon: 'bubble_chart', class: '', component: NewCommentComponent},
    {path: 'logout', title: 'Thoát', icon: 'logout', class: ''}
];
