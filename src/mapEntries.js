/** Transforms an object by applying a function to each key/value
 *  pairing within the object
 * 
 * @param {Object} o - Object to be mapped 
 * @param {Function} fn - function used to do the mapping
 * @return {Object} - Object after the key/values have been mapped 
 */
const mapEntries = (o, fn) => Object.fromEntries(

    Object.entries(o).map(([key, value]) => {

        const result = fn(value, key);

        return Array.isArray(result) ? result : [key, result]

    })

);

module.exports = mapEntries;