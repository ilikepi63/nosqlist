/* eslint-disable no-undef */
const { isFunction } = require("../src/utils");
const assert = require("assert");

/** Things to test: 
 *  1. Multiple string interpolation
 * 2. single string interpolation
 * 
 */

describe("Utility Functions", function () {
    describe("isFunction()", function () {

        it("Should return true. ", () => {
            assert(isFunction((() => "Hello")));
        });

    });
});