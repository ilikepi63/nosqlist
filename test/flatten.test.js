const assert                = require("assert");
const {flatten}               = require("../src/flat");

const { Employee, employeeResult, Building, buildingResult } = require("./testData/transformMultiple");
const { Customer, resultWithoutDefinition } = require("./testData/onlineBankingService");
const { metaSchema, orgResult } = require("./testData/organisation");

console.log( flatten( { config: { includeDef: false },collection:Customer } ) );

describe("Transform Multiple", function () {

    describe("Banking Dataset", function () {

        const dataset = flatten( { config: { includeDef: false },collection:Customer } );

        it("Transaction", () => {
            assert.deepEqual( dataset.transaction, resultWithoutDefinition.transaction );
        });

        it("Customer", () => {
            assert.deepEqual( dataset.customer, resultWithoutDefinition.customer );
        });

        it("Account", () => {
            assert.deepEqual( dataset.account, resultWithoutDefinition.account );
        });

        it("Purchase", () => {
            assert.deepEqual( dataset.purchase, resultWithoutDefinition.purchase );
        });

        it("Payment", () => {
            assert.deepEqual( dataset.Payment, resultWithoutDefinition.Payment );
        });

    });

    describe("Employee Dataset", function () {

        const dataset = flatten( {collection: Employee });

        it("Ticket Schema", () => {
            assert.deepEqual( dataset.Ticket, employeeResult.Ticket );
        });

        it("Employee Schema", () => {
            assert.deepEqual( dataset.Employee, employeeResult.Employee );
        });

        it("Meeting Schema", () => {
            assert.deepEqual( dataset.Meeting, employeeResult.Meeting );
        });

    });

    describe("Building Dataset", function () {

        const dataset = flatten( {collection: Building });

        it("Building Schema", () => {
            assert.deepEqual( dataset.Building, buildingResult.Building );
        });

        it("Room Schema", () => {
            assert.deepEqual( dataset.Room, buildingResult.Room );
        });

        it("Meeting Schema", () => {
            assert.deepEqual( dataset.Meeting, buildingResult.Meeting );
        });

    });

    describe("Organisation Dataset", function () {

        const dataset = flatten( {collection: metaSchema });

        it("Organisation Dataset", () => {
            assert.deepEqual( flatten({collection: metaSchema}), orgResult );
        });

    });

});