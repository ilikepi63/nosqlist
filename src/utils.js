/** Checks if the given val parameter is of type 
 *  string.
 * 
 * @param {Any} val
 * @return {Boolean} Whether or not the given value is a string 
 */
const isString = val => typeof val === "string";

/** Checks if the given val parameter is a function type.
 * 
 *  Similar to Underscore's implementation "isFunction"
 * 
 * @param {Any} val
 * @return {Boolean} Whether or not the given value is a function
 */
const isFunction = val => val && Object.toString.call(val) === '[object Function]';

/** Checks if the given val parameter is an object type 
 * 
 * @param {Any} val
 * @return {Boolean} determining whether or not this is an object 
 */
const isObject = val => val && Object.prototype.toString.call(val) === '[object Object]';

/** Returns whether or not the given value is not undefined or null.
 * 
 * @param {Any} val
 * @return {Boolean} 
 */
const exists = val => val !== null && val !== undefined;

/** Returns if the given value is an empty string or not.
 * 
 * @param {Any} val 
 * @return {Boolean}
 */
const isEmptyString = val => val === '';

/** Returns one value if it exists, otherwise the other.
 * 
 * @param {Any} val - value to be used if exists. 
 * @param {Any} def - value to be used if the val does not exist. 
 * @return {Any}
 */
const ifExistsElse = ( val, def ) => exists(val) ? val : def;

module.exports = {
    isString,
    isFunction,
    isObject,
    exists,
    isEmptyString,
    ifExistsElse
};