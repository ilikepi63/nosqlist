const { isString, isFunction } = require("./utils");
const supplant = require("./supplant");

/** Takes in a inputted data and a corresponding schema
 *  and outputs a converted string
 * 
 * @param {Object} data - data to be inputted 
 * @param {String} template - template to be interpolated into
 * @return {String} - Interpolated String
 */
const transformItem = (template, data) => {

    if (isString(template)) return supplant(data, template);
    if (isFunction(template)) return template(data);
    return null;

};

module.exports = transformItem;