import Concept, {ConceptAnswer} from "./Concept";
import Gender from "./Gender";
import AddressLevel from "./AddressLevel";
import Individual from "./Individual";
import AllSchema from "./Schema";
import _ from "lodash";
import LocaleMapping from "./LocaleMapping";
import Settings from "./Settings";
import Program from "./Program";
import ProgramEnrolment from "./ProgramEnrolment";
import ProgramEncounter from "./ProgramEncounter";
import EncounterType from "./EncounterType";
import Encounter from "./Encounter";
import ProgramOutcome from "./ProgramOutcome";
import Form from "./application/Form";
import FormElementGroup from "./application/FormElementGroup";
import FormElement from "./application/FormElement";
import FormMapping from "./application/FormMapping";
import Checklist from "./Checklist";
import ChecklistItem from "./ChecklistItem";
import UserInfo from "./UserInfo";
import ProgramConfig from "./ProgramConfig";
import IndividualRelation from "./relationship/IndividualRelation";
import IndividualRelationship from "./relationship/IndividualRelationship";
import IndividualRelationshipType from "./relationship/IndividualRelationshipType";
import IndividualRelationGenderMapping from "./relationship/IndividualRelationGenderMapping";
import Rule from "./Rule";
import RuleDependency from "./RuleDependency";
import ChecklistItemDetail from "./ChecklistItemDetail";
import ChecklistDetail from "./ChecklistDetail";

class EntityMetaData {
    static checklistDetail = {entityName: "ChecklistDetail", entityClass: ChecklistDetail, resourceName: "checklistDetail", type: "reference", nameTranslated: false};
    static rule = {entityName: "Rule", entityClass: Rule, resourceName: "rule", type: "reference", nameTranslated: false};
    static ruleDependency = {entityName: "RuleDependency", entityClass: RuleDependency, resourceName: "ruleDependency", type: "reference", nameTranslated: false};
    static form = {entityName: "Form", entityClass: Form, resourceName: "form", type: "reference", nameTranslated: false};
    static formMapping = {entityName: "FormMapping", entityClass: FormMapping, resourceName: "formMapping", type: "reference", nameTranslated: false};
    static addressLevel = {entityName: "AddressLevel", entityClass: AddressLevel, resourceName: "addressLevel", resourceSearchFilterURL: "byCatchmentAndLastModified", type: "reference", nameTranslated: true};
    static encounterType = {entityName: "EncounterType", entityClass: EncounterType, resourceName: "operationalEncounterType", type: "reference", nameTranslated: true};
    static program = {entityName: "Program", entityClass: Program, resourceName: "operationalProgram", type: "reference", nameTranslated: true};
    static programOutcome = {entityName: "ProgramOutcome", entityClass: ProgramOutcome, resourceName: "programOutcome", type: "reference", nameTranslated: true};
    static gender = {entityName: "Gender", entityClass: Gender, resourceName: "gender", type: "reference", nameTranslated: true};
    static individualRelation = {entityName: "IndividualRelation", entityClass: IndividualRelation, resourceName: "individualRelation", type: "reference", nameTranslated: true};
    static individualRelationGenderMapping = {entityName: "IndividualRelationGenderMapping", entityClass: IndividualRelationGenderMapping, resourceName: "individualRelationGenderMapping", type: "reference", nameTranslated: true};
    static individualRelationshipType = {entityName: "IndividualRelationshipType", entityClass: IndividualRelationshipType, resourceName: "individualRelationshipType", type: "reference", nameTranslated: true};
    static concept = {entityName: "Concept", entityClass: Concept, resourceName: "concept", type: "reference", nameTranslated: true};
    static programConfig = {entityName: "ProgramConfig", entityClass: ProgramConfig, resourceName: "programConfig", type: "reference", nameTranslated: true};
    static individual = {entityName: "Individual", entityClass: Individual, resourceName: "individual", resourceSearchFilterURL: "byCatchmentAndLastModified", type: "tx"};

    static checklistItemDetail() {
        return {
            entityName: "ChecklistItemDetail",
            entityClass: ChecklistItemDetail,
            resourceName: "checklistItemDetail",
            type: "reference",
            nameTranslated: false,
            parent: EntityMetaData.checklistDetail
        }
    };
    static encounter() {
        return {entityName: "Encounter", entityClass: Encounter, resourceName: "encounter", resourceSearchFilterURL: "byIndividualsOfCatchmentAndLastModified", type: "tx", parent: EntityMetaData.individual, nameTranslated: false}
    };

    static programEnrolment() {
        return {entityName: "ProgramEnrolment", entityClass: ProgramEnrolment, resourceName: "programEnrolment", resourceSearchFilterURL: "byIndividualsOfCatchmentAndLastModified", type: "tx", parent: EntityMetaData.individual, nameTranslated: false};
    }

    static formElement() {
        return {entityName: "FormElement", entityClass: FormElement, resourceName: "formElement", type: "reference", parent: EntityMetaData.formElementGroup(), nameTranslated: true};
    }

    static formElementGroup() {
        return {entityName: "FormElementGroup", entityClass: FormElementGroup, resourceName: "formElementGroup", type: "reference", parent: EntityMetaData.form, nameTranslated: true};
    };

    static programEncounter() {
        return {entityName: "ProgramEncounter", entityClass: ProgramEncounter, resourceName: "programEncounter", resourceSearchFilterURL: "byIndividualsOfCatchmentAndLastModified", type: "tx", parent: EntityMetaData.programEnrolment(), nameTranslated: false};
    };

    static conceptAnswer() {
        return {entityName: "ConceptAnswer", entityClass: ConceptAnswer, resourceName: "conceptAnswer", type: "reference", parent: EntityMetaData.concept, nameTranslated: false};
    };

    static checklist() {
        return {entityName: "Checklist", entityClass: Checklist, resourceName: "txNewChecklistEntity", resourceSearchFilterURL: "byIndividualsOfCatchmentAndLastModified", type: "tx", parent: EntityMetaData.programEnrolment(), nameTranslated: false};
    }

    static checklistItem() {
        return {entityName: "ChecklistItem", entityClass: ChecklistItem, resourceName: "txNewChecklistItemEntity", resourceSearchFilterURL: "byIndividualsOfCatchmentAndLastModified", type: "tx", parent: EntityMetaData.checklist(), nameTranslated: false};
    }

    static individualRelationship() {
        return {
            entityName: "IndividualRelationship",
            entityClass: IndividualRelationship,
            resourceName: "individualRelationship",
            resourceSearchFilterURL: "byIndividualsOfCatchmentAndLastModified",
            type: "tx",
            nameTranslated: false,
            parent: EntityMetaData.individual
        };
    }

    //order is important. last entity in each (tx and ref) with be executed first. parent should be synced before the child.
    static model() {
        return [
            EntityMetaData.checklistItemDetail(),
            EntityMetaData.checklistDetail,
            EntityMetaData.rule,
            EntityMetaData.ruleDependency,
            EntityMetaData.individualRelationshipType,
            EntityMetaData.individualRelationGenderMapping,
            EntityMetaData.individualRelation,
            EntityMetaData.programConfig,
            EntityMetaData.formMapping,
            EntityMetaData.formElement(),
            EntityMetaData.formElementGroup(),
            EntityMetaData.form,

            EntityMetaData.addressLevel,
            EntityMetaData.encounterType,
            EntityMetaData.program,
            EntityMetaData.programOutcome,
            EntityMetaData.gender,
            EntityMetaData.conceptAnswer(),
            EntityMetaData.concept,

            EntityMetaData.individualRelationship(),
            EntityMetaData.checklistItem(),
            EntityMetaData.checklist(),
            EntityMetaData.encounter(),
            EntityMetaData.programEncounter(),
            EntityMetaData.programEnrolment(),
            EntityMetaData.individual
        ];
    };

    static entitiesLoadedFromServer() {
        return _.differenceWith(AllSchema.schema, [Settings, LocaleMapping, UserInfo], (first, second) => {
            if (_.isNil(second)) return false;

            return first.schema.name === second.schema.name;
        });
    }
}

export default EntityMetaData;