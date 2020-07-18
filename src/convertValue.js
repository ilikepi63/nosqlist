const {isString, isFunction}              = require("./utils");
const supplant                            = require("./supplant");

/** Convert a primary type to a corresponding value
 * 
 * @param {String} key - key of the data object being inputted 
 * @param {Any} transformer - the transformation to be applied to the value 
 * @param {Object} data - Data containing transforming information
 * @return {Any} - Transformed Value 
 */
const convertValue = ( key, transformer, data ) => {
    if(isString( transformer ) ) return supplant(data, transformer);
    if(isFunction( transformer )) return transformer.call(null, data[key]);
    return data[key];
};

module.exports = convertValue;