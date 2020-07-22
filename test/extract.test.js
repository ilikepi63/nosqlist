const extract = require("../src/extract");
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


// expected results
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
    "OrgName": "{orgName}",
    "PlantType": "{planType}",
};

const userSchema = {
    "PK": "ORG#{orgName}",
    "SK": "USER#{UserName}",
    "UserName": "{UserName}",
    "UserType": "{UserType}",
};

// test data

const convertedTestData = {
    pk: 'firstName',
    sk: '#FIRSTNAME#Cameron#LASTNAME#Harris',
    firstName: 'Cameron',
    lastName: 'Harris',
    age: '26.00'
}

const assertEqualObjects = ({ description, object1, object2  }) => {
    it(description, () => {
        assert.deepEqual( object2, object1);
    });
};

describe('Transform', function () {

    describe('Converts an Object of Data into a schema-designed object', function () {

        assertEqualObjects( "Primary Test Data", extract( convertedTestData ), testData );

    });

});




