/* eslint-disable no-undef */
const { generateHash, generateRange } = require("../src/flat");
const assert = require("assert");

describe("Generate a Range", function () {

    it("Should create a range Key", () => {
        assert.equal("test#{ketAttri}", generateRange(undefined, "test", "#", "{ketAttri}", true));
    });

    it("Should create a range Key without a definition", () => {
        assert.equal("{ketAttri}", generateRange("", "test", "#", "{ketAttri}", false));
    });

    it("Should create a range Key", () => {
        assert.equal("{ketAttri}", generateRange(undefined, "test", "#", "{ketAttri}", false));
    });

    it("Should create a range Key", () => {
        assert.equal("test#{ketAttri}#test#{ketAttri}", generateRange("test#{ketAttri}", "test", "#", "{ketAttri}", true));
    });

    it("Should create a range Key without a definition", () => {
        assert.equal("{ketAttri}#{ketAttri}", generateRange("{ketAttri}", "test", "#", "{ketAttri}", false));
    });
});

describe("Generate a Hash", function () {

    it("Should create a hash Key", () => {
        assert.equal("test#{ketAttri}", generateHash(undefined, "test", "#", "{ketAttri}", true));
    });

    it("Should not create a new hash key", () => {
        assert.equal("test2#{ketAttri2}", generateHash("test2#{ketAttri2}", "test", "#", "{ketAttri}", true));
    });

    it("Should create a hash Key without a definition", () => {
        assert.equal("test2#{ketAttri2}", generateHash("test2#{ketAttri2}", "test", "#", "{ketAttri}", false));
    });

    it("Should create a hash Key without a definition", () => {
        assert.equal("{ketAttri}", generateHash(undefined, "test", "#", "{ketAttri}", false));
    });
});