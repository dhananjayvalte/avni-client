import General from "../utility/General";
import EncounterType from "./EncounterType";
import Individual from "./Individual";
import ResourceUtil from "../utility/ResourceUtil";
import _ from "lodash";
import Observation from './Observation'
import Concept from './Concept'
import SingleCodedValue from './observation/SingleCodedValue';
import MultipleCodedValue from './observation/MultipleCodedValues';
import PrimitiveValue from "./observation/PrimitiveValue";
import moment from "moment";
import ObservationsHolder from "./ObservationsHolder";

class Encounter extends ObservationsHolder {
    static schema = {
        name: 'Encounter',
        primaryKey: 'uuid',
        properties: {
            uuid: 'string',
            encounterType: 'EncounterType',
            encounterDateTime: 'date',
            individual: 'Individual',
            observations: {type: 'list', objectType: 'Observation'}
        }
    };

    static create() {
        let encounter = new Encounter();
        encounter.observations = [];
        return encounter;
    }

    static fromResource(resource, entityService) {
        const encounterType = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(resource, "encounterTypeUUID"), EncounterType.schema.name);
        const individual = entityService.findByKey("uuid", ResourceUtil.getUUIDFor(resource, "individualUUID"), Individual.schema.name);

        const encounter = General.assignFields(resource, new Encounter(), ["uuid"], ["encounterDateTime"], ["observations"], entityService);
        encounter.encounterType = encounterType;
        encounter.individual = individual;
        return encounter;
    }

    get toResource() {
        const resource = _.pick(this, ["uuid"]);
        resource["encounterTypeUUID"] = this.encounterType.uuid;
        resource["individualUUID"] = this.individual.uuid;
        resource.encounterDateTime = moment(this.encounterDateTime).format();
        resource["observations"] = [];
        this.observations.forEach((obs) => {
            var obsResource = {conceptUUID: obs.concept.uuid};
                if(obs.concept.datatype === Concept.dataType.Coded){
                    if(obs.valueJSON.constructor === SingleCodedValue){
                        obsResource.valueCoded = [obs.getValue().conceptUUID]
                    }else {
                        obsResource.valueCoded = obs.getValue().map((answer) => {return answer.conceptUUID});
                    }
                } else {
                    obsResource.valuePrimitive = obs.getValue();
                }
            resource["observations"].push(obsResource);
        });
        return resource;
    }

    cloneForNewEncounter() {
        const encounter = new Encounter();
        encounter.uuid = this.uuid;
        encounter.encounterType = _.isNil(this.encounterType) ? null : this.encounterType.clone();
        encounter.encounterDateTime = this.encounterDateTime;
        encounter.individual = _.isNil(this.individual) ? null : this.individual.cloneWithoutEncounters();
        encounter.observations = [];
        this.observations.forEach((observation) => {
            encounter.observations.push(observation.cloneForNewEncounter());
        });
        return encounter;
    }
}

export default Encounter;