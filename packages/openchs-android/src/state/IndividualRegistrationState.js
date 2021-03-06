import AbstractDataEntryState from "./AbstractDataEntryState";
import Wizard from "./Wizard";
import _ from "lodash";
import ConceptService from "../service/ConceptService";
import {StaticFormElementGroup, Individual, ObservationsHolder, WorkLists, WorkList, WorkItem} from "avni-models";
import General from "../utility/General";

class IndividualRegistrationState extends AbstractDataEntryState {
    constructor(validationResults, formElementGroup, wizard, genders, age, ageProvidedInYears, individual, isNewEntity, filteredFormElements, individualSubjectType, workLists) {
        super(validationResults, formElementGroup, wizard, isNewEntity, filteredFormElements, workLists);
        this.genders = genders;
        this.age = age;
        this.ageProvidedInYears = ageProvidedInYears;
        this.individual = individual;
        this.individualSubjectType = individualSubjectType;
    }

    getEntity() {
        return this.individual;
    }

    getEntityType() {
        return Individual.schema.name;
    }

    static createLoadState(form, genders, individual, workLists) {
        const wizard = new Wizard(_.isNil(form) ? 1 : form.numberOfPages + 1, 2);
        const individualRegistrationState = new IndividualRegistrationState([], new StaticFormElementGroup(form), wizard, genders, "", true, individual, true, [], individual.subjectType, workLists || new WorkLists(new WorkList(new WorkItem(General.randomUUID(), WorkItem.type.REGISTRATION))));
        individualRegistrationState.form = form;
        return individualRegistrationState;
    }

    clone() {
        const newState = new IndividualRegistrationState();
        newState.individual = this.individual.cloneForEdit();
        newState.genders = this.genders;
        newState.age = this.age;
        newState.ageProvidedInYears = this.ageProvidedInYears;
        newState.form = this.form;
        newState.filteredFormElements = this.filteredFormElements;
        newState.individualSubjectType = this.individualSubjectType.clone();
        super.clone(newState);
        return newState;
    }

    getWorkContext() {
        return {
            subjectTypeName: "Individual",
            subjectUUID: this.individual.uuid,
        };
    }

    get observationsHolder() {
        return new ObservationsHolder(this.individual.observations);
    }

    movePrevious() {
        this.wizard.movePrevious();
        this.formElementGroup = this.wizard.isNonFormPage() ?
            new StaticFormElementGroup(this.formElementGroup.form) :
            this.formElementGroup.previous();
    }

    get staticFormElementIds() {
        return this.wizard.isFirstPage() ? _.keys(Individual.validationKeys) : [];
    }

    validateEntity(context) {
        const validationResults = this.individual.validate();
        const locationValidation = this.validateLocation(
            this.individual.registrationLocation,
            Individual.validationKeys.REGISTRATION_LOCATION,
            context
        );
        validationResults.push(locationValidation);
        return validationResults;
    }

    validateEntityAgainstRule(ruleService) {
        return ruleService.validateAgainstRule(this.individual, this.formElementGroup.form, 'Individual');
    }

    executeRule(ruleService, context) {
        let decisions = ruleService.getDecisions(this.individual, 'Individual');
        context.get(ConceptService).addDecisions(this.individual.observations, decisions.registrationDecisions);

        return decisions;
    }

    getEffectiveDataEntryDate() {
        return this.individual.registrationDate;
    }

    getNextScheduledVisits(ruleService, context) {
        return ruleService.getNextScheduledVisits(this.individual, Individual.schema.name, []);
    }
}

export default IndividualRegistrationState;