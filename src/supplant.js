/** Modification of Douglas Crockford's supplant() function 
 * 
 * gist: https://gist.github.com/pbroschwitz/3891293
 * 
 * expressions enclosed in { } braces. If an expression is found, use it as a key on the object, 
 * and if the key has a string value or number value, it is substituted for the bracket expression 
 * and it repeats.
 * Written by Douglas Crockford: http://www.crockford.com/
 * 
 * 
 * @param {Object} o - Object that holds the values to be interpolated into the string
 * @param {String} string - String to be interpolated into 
 * @return {String} - Interpolated String
 */
const supplant = (o, string) => string.replace(/{([^{}]*)}/g,
    (a, b) => {
        const r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
);

module.exports = supplant;