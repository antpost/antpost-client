import { RelationshipStatus } from '../models/enums';

export class FacebookHelper {
    public static checkRelationship(relationships: number[], status: string) {
        const relationshipMap = [
            {key: RelationshipStatus.Single, value: 'Single'},
            {key: RelationshipStatus.InARelationship, value: 'In a relationship'},
            {key: RelationshipStatus.Engaged, value: 'Engaged'},
            {key: RelationshipStatus.Married, value: 'Married'},
            {key: RelationshipStatus.InACivilUnion, value: 'In a civil union'},
            {key: RelationshipStatus.InADomesticPartnership, value: 'In a domestic partnership'},
            {key: RelationshipStatus.Complicated, value: `It's complicated`},
            {key: RelationshipStatus.Separated, value: 'Separated'},
            {key: RelationshipStatus.Divorced, value: 'Divorced'},
            {key: RelationshipStatus.Widowed, value: 'Widowed'}
        ];

        const item = relationshipMap.find(item => item.value === status);
        if(item) {
            return relationships.indexOf(item.key) >= 0;
        } else {
            return false;
        }
    }
}
