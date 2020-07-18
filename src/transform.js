const mapEntries                    = require("./mapEntries");
const convertValue                  = require("./convertValue");

/** Takes in a inputted data and a corresponding schema
 *  and outputs a converted object
 * 
 * @param {Object} data - data to be inputted 
 * @param {Object} schema - Schema used to convert values
 * @return {Object} - Converted Object
 */
const transform = (data, schema) => mapEntries( schema, (value, key) => convertValue( key, value, data ));

module.exports = transform;