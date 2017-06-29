import {ActionStep} from './actionStep';
import {AutomationActionType} from './constants';

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
}
