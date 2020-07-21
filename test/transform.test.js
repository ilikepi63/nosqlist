const transform                 = require("../src/transform");
const assert                    = require("assert");


const testData  = {
    firstName: "Cameron",
    lastName: "Harris",
    age: 26
};

const schema = {
    "pk":"firstName",
    "sk":"#FIRSTNAME#{firstName}#LASTNAME#{lastName}",
    "firstName": "{firstName}",
    "lastName": "{lastName}",
    "age": (val) => String(val.toFixed(2)) 
};

describe('Transform', function () {
    describe('Converts an Object of Data into a schema-designed object', function () {

        it('Should return the converted Object', () => {
            assert.deepEqual({
                pk: 'firstName',
                sk: '#FIRSTNAME#Cameron#LASTNAME#Harris',
                firstName: 'Cameron',
                lastName: 'Harris',
                age: '26.00'
              }, transform( schema, testData ) );
        });

    });
});

