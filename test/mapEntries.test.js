const mapEntries            = require("../src/mapEntries");
const assert                = require('assert');

describe('Map Entries', function () {
    describe('Apply a function as a map to an entry.', function () {

        const obj = { name: 'John', surname: 'Doe', age: 32 };

        it('Should return a copy of the object, testing a return of an array of [key, value]', () => {

            assert.deepEqual(obj, mapEntries(obj, (value, key) => [key, value]));
        });

        it('Should return a copy of the object, testing a return of an array of [key, value, ...]', () => {
            assert.deepEqual(obj, mapEntries(obj, (value, key) => [key, value, "Hello", "Your Beautiful"]));
        });

        it('Should return a copy of the object, returning the value and consuming the key and value.', () => {
            assert.deepEqual(obj, mapEntries(obj, (value, key) => value));
        });

        it('Should return a copy of the object, returning the value and consuming only value.', () => {
            assert.deepEqual(obj, mapEntries(obj, value => value));
        });

        it('Should return an inversion of the object where the object\'s properties are returned as {value: key}', () => {
            assert.deepEqual({ John: "name", Doe: "surname", 32: "age" }, mapEntries(obj, (value, key) => [value, key]));
        });

    });
});