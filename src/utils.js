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

module.exports = {
    isString,
    isFunction,
    isObject
};