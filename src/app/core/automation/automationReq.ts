import {CompleteRule} from './completeRule';
import {ActionStep} from './actionStep';
import {AutomationActionType} from './constants';

export class AutomationReq {
    //public actions: Array<ActionStep> = [];
    private requestAction: ActionStep;
    private formActions: Array<ActionStep> = [];
    private completeRule: CompleteRule;

    public constructor() {

    }

    /**
     * Set url to access at startup
     * @param url
     * @param cookies
     * @returns {AutomationReq}
     */
    public access(url: string, cookies?: string) {
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
    public addInputAction(value: string, selector: string) {
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
    public addClickAction(selector: string) {
        const step = <ActionStep> {
            action: AutomationActionType.click,
            params: {selector}
        };
        this.formActions.push(step);
        return this;
    }

    public addSubmitAction(form: string) {
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
}
