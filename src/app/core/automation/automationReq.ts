import {CompleteRule} from './completeRule';
import {ActionStep} from './actionStep';
import {AutomationActionType} from './constants';

export class AutomationReq {
    //public actions: Array<ActionStep> = [];
    private requestAction: ActionStep;
    private formActions: Array<ActionStep> = [];
    private completeRule: CompleteRule;
    private responseElement: string;

    public constructor() {

    }

    /**
     * Set url to access at startup
     * @param url
     * @param cookies
     * @returns {AutomationReq}
     */
    public access(url: string, cookies?: any) {
        this.requestAction = <ActionStep> {
            action: AutomationActionType.accessUrl,
            params: {
                url,
                cookies
            }
        } as ActionStep;
        return this;
    }

    /**
     * Fill value to input
     * @param value
     * @param selector
     * @returns {AutomationReq}
     */
    public input(selector: string, value: string) {
        const step = <ActionStep> {
            action: AutomationActionType.input,
            params: {value, selector}
        };
        this.formActions.push(step);
        return this;
    }

    /**
     * Add click action
     * @param selector
     * @returns {AutomationReq}
     */
    public click(selector: string) {
        const step = <ActionStep> {
            action: AutomationActionType.click,
            params: {selector}
        };
        this.formActions.push(step);
        return this;
    }

    public upload(selector: string, value: string) {
        const step = <ActionStep> {
            action: AutomationActionType.upload,
            params: {value, selector}
        };
        this.formActions.push(step);
        return this;
    }

    public submit(form: string) {
        const step = <ActionStep> {
            action: AutomationActionType.submit,
            params: {selector: form}
        };
        this.formActions.push(step);
        return this;
    }

    public completeWhenUrlContains(url: string) {
        this.completeRule = <CompleteRule> {
            finalUrl: url
        };

        return this;
    }

    public responseContent(element: string) {
        this.responseElement = element;
        return this;
    }
}
