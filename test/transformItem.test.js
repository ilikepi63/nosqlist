/* eslint-disable no-undef */
const transformItem = require("../src/transformItem");
const assert = require("assert");

/** Things to test: 
 *  1. Multiple string interpolation
 * 2. single string interpolation
 * 
 */

describe("Supplant", function () {
    describe("Supplant within a string", function () {

        const obj = { name: "John", surname: "Doe", age: 32 };

        it("Should return Interpolated String with Single Entry", () => {
            assert.equal("John is at the door.", transformItem("{name} is at the door.", obj));
        });

        it("Should return Interpolated String with Multiple Entry", () => {
            assert.equal("John Doe is at the door. He is 32 years old.", transformItem("{name} {surname} is at the door. He is {age} years old.", obj));
        });

        it("Should return Interpolated String with Multiple Entry", () => {
            assert.equal("John", transformItem(({ name }) => name, obj));
        });

    });
});