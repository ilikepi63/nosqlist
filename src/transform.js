const mapEntries                    = require("./mapEntries");
const convertValue                  = require("./convertValue");

/** Takes in a inputted data and a corresponding schema
 *  and outputs a converted object
 * 
 * @param {Object} data - data to be inputted 
 * @param {Object} schema - Schema used to convert values
 * @return {Object} - Converted Object
 */
const transform = (schema, data) => {
    
    const schemaValues = mapEntries( schema, (value, key) => convertValue( key, value, data ));

    return Object.assign( data, schemaValues );

};

module.exports = transform;