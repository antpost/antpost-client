import {ActionStep} from './actionStep';
import {AutomationActionType} from './constants';
import {Post} from "../../models/post.model";
import {AutomationReq} from "./automationReq";
import {PostType} from "../../models/enums";

export class AutomationUtils {

    /**
     * create action accessing URL
     * @returns {ActionStep}
     */
    static createUrlAccessAction(url: string, cookies?: string): ActionStep {

        return <ActionStep> {
            action: AutomationActionType.accessUrl,
            params: {
                url,
                cookies
            }
        };
    }

    /**
     * Create input action
     * @param value
     * @param selector
     * @returns {ActionStep}
     */
    static createInputAction(value: string, selector: string): ActionStep {
        return <ActionStep> {
            action: AutomationActionType.input,
            params: {value, selector}
        };
    }

    /**
     * Create click action
     * @param selector
     * @returns {ActionStep}
     */
    static createClickAction(selector: string): ActionStep {
        return <ActionStep> {
            action: AutomationActionType.click,
            params: {selector}
        };
    }

    /**
     * Create procedure for publish post automation
     * @param post
     * @returns {AutomationReq}
     */
    static createPostProcedure(post: Post, nodeId: string, cookies: any) {
        let procedure = new AutomationReq();

        if(post.type == PostType.Sale) {//257702558042509
            procedure.access(`https://mbasic.facebook.com/groups/sell/_edit/?group_id=${nodeId}`, cookies)
                .input("input[name='composer_attachment_sell_title']", post.productName)
                .input("input[name='composer_attachment_sell_price']", post.price + '')
                .input("input[name='composer_attachment_sell_pickup_note']", post.location)
                .input("input[name='xc_message']", post.message)
                .upload("input[name='file1']", post.images && post.images.length > 0 ? post.images[0] : null)
                .submit('form')
                .completeWhenUrlContains(`mbasic.facebook.com/groups/${nodeId}`)
                .responseContent('#m_group_stories_container');

        } else if (post.type == PostType.Image){
            procedure.access(`https://mbasic.facebook.com/groups/sell/_edit/?group_id=${nodeId}`, cookies)
                .input("input[name='composer_attachment_sell_title']", post.productName)
                .input("input[name='composer_attachment_sell_price']", post.price + '')
                .input("input[name='composer_attachment_sell_pickup_note']", post.location)
                .input("input[name='xc_message']", post.message)
                .upload("input[name='file1']", post.images && post.images.length > 0 ? post.images[0] : null)
                .submit('form')
                .completeWhenUrlContains(`mbasic.facebook.com/groups/${nodeId}`)
                .responseContent('#m_group_stories_container');
        }


        return procedure;
    }
}
