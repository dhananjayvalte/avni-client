import IndividualService from "../../service/IndividualService";
import _ from "lodash";

export class IndividualProfileActions {

    static getInitialState() {
        return {
            eligiblePrograms: [],
            displayActionSelector: false
        };
    }

    static clone(state) {
        return {
            eligiblePrograms: state.eligiblePrograms.slice(),
            displayActionSelector: state.displayActionSelector
        }
    }

    static launchActionSelector(state) {
        const newState = IndividualProfileActions.clone(state);
        newState.displayActionSelector = true;
        return newState;
    }

    static hideActionSelector(state) {
        const newState = IndividualProfileActions.clone(state);
        newState.displayActionSelector = false;
        return newState;
    }

    static individualSelected(state, action, context) {
        const individualService = context.get(IndividualService);
        if (_.isNil(individualService.findByUUID(action.individual.uuid))) return state;

        const newState = IndividualProfileActions.clone(state);
        newState.eligiblePrograms = individualService.eligiblePrograms(action.individual.uuid);
        return newState;
    }
}

const actions = {
    INDIVIDUAL_SELECTED: "IPA.INDIVIDUAL_SELECTED",
    LAUNCH_ACTION_SELECTOR: "IPA.LAUNCH_ACTION_SELECTOR",
    HIDE_ACTION_SELECTOR: "IPA.HIDE_ACTION_SELECTOR",
};

export default new Map([
    [actions.INDIVIDUAL_SELECTED, IndividualProfileActions.individualSelected],
    [actions.LAUNCH_ACTION_SELECTOR, IndividualProfileActions.launchActionSelector],
    [actions.HIDE_ACTION_SELECTOR, IndividualProfileActions.hideActionSelector],
]);

export {actions as Actions};
