import {AutomationActionType} from './constants';

export class ActionStep {
    public action: AutomationActionType;
    public params: any;

    public subSteps: Array<ActionStep>;
}
