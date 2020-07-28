const assert                = require("assert");
const flatten               = require("../src/flat");

const { Employee, employeeResult, Building, buildingResult } = require("./testData/transformMultiple");
const { Customer, result } = require("./testData/onlineBankingService");
const { metaSchema, orgResult } = require("./testData/organisation");


describe('Transform Multiple', function () {

    describe('Converts the given schema and data into Composite item collections', function () {

        it('Employee Dataset', () => {
            assert.deepEqual( flatten( {collection: Employee }), employeeResult );
        });

        it('Building Dataset', () => {
            assert.deepEqual( flatten({collection:Building }), buildingResult );
        });

        it('Banking Dataset', () => {
            assert.deepEqual( flatten({collection:Customer}), result );
        });

        it('Organisation Dataset', () => {
            assert.deepEqual( flatten({collection: metaSchema}), orgResult );
        });

    });

});