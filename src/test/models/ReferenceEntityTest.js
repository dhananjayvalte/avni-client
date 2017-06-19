import {expect} from 'chai';
import Program from "../../js/models/Program";

describe('ReferenceEntityTest', () => {
    it('clone', () => {
        const program = new Program();
        program.uuid = 'cd3d221d-bd7e-4837-8208-bd84691b929a';
        expect(program.clone().uuid).is.equal(program.uuid);
    });
});