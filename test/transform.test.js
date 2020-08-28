/* eslint-disable no-undef */
const transform = require("../src/transform");
const assert = require("assert");


const testData = {
    firstName: "Cameron",
    lastName: "Harris",
    age: 26
};

const schema = {
    "pk": "firstName",
    "sk": "#FIRSTNAME#{firstName}#LASTNAME#{lastName}",
    "firstName": "{firstName}",
    "lastName": "{lastName}",
    "age": (val) => String(val.toFixed(2))
};

describe("Transform", function () {

    // test data 
    const metadata = {
        orgName: "Microsoft",
        planType: "Enterprise"
    };

    const metadataAmazon = {
        orgName: "Amazon",
        planType: "Pro"
    };

    const userBillGates = {
        orgName: "Microsoft",
        UserName: "Bill Gates",
        UserType: "Member"
    };

    const userSatyaNadella = {
        orgName: "Microsoft",
        UserName: "Satya Nadella",
        UserType: "Admin"
    };

    const userJeffBezos = {
        orgName: "Amazon",
        UserName: "Jeff Bezos",
        UserType: "Admin"
    };


    // schemas 

    const metaSchema = {
        "PK": "ORG#{orgName}",
        "SK": "METADATA#{orgName}",
    };

    const userSchema = {
        "PK": "ORG#{orgName}",
        "SK": "USER#{UserName}",
        // "UserName": "{UserName}",
        // "UserType": "{UserType}",
    };


    describe("Converts an Object of Data into a schema-designed object", function () {

        it("Should return the converted Object", () => {
            assert.deepEqual({
                pk: "firstName",
                sk: "#FIRSTNAME#Cameron#LASTNAME#Harris",
                firstName: "Cameron",
                lastName: "Harris",
                age: "26.00"
            }, transform(schema, testData));
        });

        it("Should return the converted Microsoft Metadata", () => {
            assert.deepEqual({
                PK: "ORG#Microsoft",
                SK: "METADATA#Microsoft",
                orgName: "Microsoft",
                planType: "Enterprise",
            }, transform(metaSchema, metadata));
        });

        it("Should return the User Data", () => {
            assert.deepEqual(
                {
                    PK: "ORG#Microsoft",
                    SK: "USER#Bill Gates",
                    UserName: "Bill Gates",
                    UserType: "Member",
                    orgName: "Microsoft"
                }, transform(userSchema, userBillGates));
        });

        // done
        it("Should return the User Data", () => {
            assert.deepEqual({
                PK: "ORG#Microsoft",
                SK: "USER#Satya Nadella",
                UserName: "Satya Nadella",
                UserType: "Admin",
                orgName: "Microsoft"
            }, transform(userSchema, userSatyaNadella));
        });

        it("Should return the Amazon Metadata", () => {
            assert.deepEqual({
                PK: "ORG#Amazon",
                SK: "METADATA#Amazon",
                orgName: "Amazon",
                planType: "Pro",

            }, transform(metaSchema, metadataAmazon));
        });

        it("Should return the User Data", () => {
            assert.deepEqual({
                PK: "ORG#Amazon",
                SK: "USER#Jeff Bezos",
                UserName: "Jeff Bezos",
                UserType: "Admin",
                orgName: "Amazon"
            }, transform(userSchema, userJeffBezos));
        });

    });

});




