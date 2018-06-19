import _ from 'lodash';
import {getNextScheduledVisits as nextScheduledVisits} from './motherVisitSchedule';
import * as programDecision from './motherProgramDecision';
import c from '../common';
import EnrolmentFormHandler from "./formFilters/EnrolmentFormHandler";
import {FormElementsStatusHelper} from "rules-config/rules";
import {generateRecommendations, generateReasonsForRecommendations} from './recommendations';
import {immediateReferralAdvice} from './referral';
import {getHighRiskConditionsInEnrolment} from "./highRisk";


export function getNextScheduledVisits(enrolment, config, today) {
    return nextScheduledVisits(enrolment, today);
}

export function getDecisions(enrolment, context, today) {
    if (context.usage === 'Exit')
        return {enrolmentDecisions: [], encounterDecisions: []};

    let decisions = [];

    _addItems(decisions, programDecision.getDecisions(enrolment, today))
    _addItem(decisions, getHighRiskConditionsInEnrolment(enrolment));
    _addItem(decisions, generateRecommendations(enrolment));
    _addItems(decisions, generateReasonsForRecommendations(enrolment));
    _addItem(decisions, immediateReferralAdvice(enrolment, null, today));

    return {enrolmentDecisions: decisions, encounterDecisions: []};
}

export function getFormElementsStatuses(programEnrolment, formElementGroup) {
    let handler = new EnrolmentFormHandler();
    return FormElementsStatusHelper.getFormElementsStatuses(handler, programEnrolment, formElementGroup);
}


export function getEnrolmentSummary(enrolment, context, today) {
    return programDecision.getEnrolmentSummary(enrolment, context, today);
}

export function validate(programEnrolment) {
    const validationResults = [];

    if (programEnrolment.individual.gender === 'Male') {
        validationResults.push(c.createValidationError('maleCannotBeEnrolledInMotherProgram'));
    }

    if (programEnrolment.individual.getAgeInYears() < 11) {
        validationResults.push(c.createValidationError('lowerThanAgeOfBeingAMother'));
    }

    const gravida = programEnrolment.getObservationValue('Gravida');
    const parity = programEnrolment.getObservationValue('Parity');
    const number_of_abortion = programEnrolment.getObservationValue('Number of abortions');

    if (gravida !== undefined && parity !== undefined && parity > gravida) {
        validationResults.push(c.createValidationError('parityCannotBeGreaterThanGravida'));
    }
    if (gravida !== undefined && number_of_abortion !== undefined && number_of_abortion > gravida) {
        validationResults.push(c.createValidationError('abortionsCannotBeGreaterThanGravida'));
    }
    if (gravida !== undefined && parity !== undefined && number_of_abortion !== undefined && (parity + number_of_abortion) > gravida) {
        validationResults.push(c.createValidationError('parityPlusAbortionCannotBeGreaterThanGravida'));
    }

    return validationResults;
}

export function getChecklists(programEnrolment, today) {
    return [/*motherVaccinationSchedule.getVaccSchedule(programEnrolment)*/];
}

function _addItem(decisions, item) {
    const originalItem = _.find(decisions, {name: item.name});
    if (originalItem) {
        originalItem.value = _.union(originalItem.value, item.value);
    } else {
        decisions.push(item);
    }
}

function _addItems(decisions, items) {
    _.forEach(items, (item) => _addItem(decisions, item));
}