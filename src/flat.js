const { isObject, exists, ifExistsElse } = require("./utils");
const mapEntries = require("./mapEntries");

/** Concatenates a given name, delimiter and variable.
 * 
 * @param {String} name 
 * @param {String} delimiter 
 * @param {String} variable 
 * @return {String} - concatenated key. 
 */
const convertToKey = (name, delimiter, variable) => `${name}${delimiter}${variable}`;

/** If the passed in hash already exists, just returns that,
 *  otherwise returns a converted key of the name, delimiter and key.
 * 
 * @param {String} hash - the (possibly) already created hash key
 * @param {String} name - the name of the given entity ($name in schemas)
 * @param {String} delimiter - delimiter between the name and the key
 * @param {String} key - the key that identifies this entity
 * @return {String} - converted key. 
 */
const generateHash = (hash, name, delimiter, key, includeDef) => hash ? hash : !includeDef ? key : convertToKey(name, delimiter, key);

/** Generates a range key from the give variables, if the range is set, then will add the newly created key
 *  onto the already existing range and return that.
 * 
 * @param {String} range 
 * @param {String} name 
 * @param {String} delimiter 
 * @param {String} key 
 * @return {String} - newly formed range key. 
 */
const generateRange = (range, name, delimiter, keyAttr, includeDef) => {
    // create a notExists function that is the inverse of exists
    const notExists = val => !exists(val);

    const isEmptyString = val => val === "";

    return  ( notExists( range ) || isEmptyString(range) ) ?  (!includeDef ? keyAttr : convertToKey(name, delimiter, keyAttr) ) :
        range + delimiter + (!includeDef ? keyAttr : convertToKey(name, delimiter, keyAttr) ); 
};

/** Takes in a given reference to a schema set, the key 
 *  point to the given schema within the schema set and 
 *  the deltas that must be added, then adds them.
 * 
 * @param {Object} schemaSetReference 
 * @param {String} key - key of the schema in the schema set reference  
 * @param {Object} schemaDeltas - Changes to the referenced schema.
 * @return {Object} - transformed Schema set. 
 */
const updateSchemaSet = (schemaSetReference, key, schemaDeltas) => {

    const newSchemaSet = Object.assign({}, schemaSetReference);

    newSchemaSet[key] = Object.assign(newSchemaSet[key] ? newSchemaSet[key] : {}, schemaDeltas);

    return newSchemaSet;

};

/** Generates the default config parameters for the 
 *  flat function
 */
const defaultParameters = obj => {

    const exists = val => !(val === undefined || val === null);

    if(!obj) return { nameKey : "$name", delimiter : "#", schemaKeyAttr : "$key", includeDef : true, headerKey : "$header"};

    return {    nameKey         : exists(obj.nameKey) ? obj.nameKey : "$name", 
        delimiter       : exists(obj.delimiter) ? obj.delimiter : "#", 
        schemaKeyAttr   : exists(obj.schemaKeyAttr) ? obj.schemaKeyAttr : "$key", 
        includeDef      : exists(obj.includeDef) ? obj.includeDef : true, 
        headerKey       : exists(obj.headerKey) ? obj.headerKey : "$header"};
};

const generateKey = ( hash, range, name, keyAttr, { includeDef, delimiter } ) => {
    return [
        generateHash( hash, name, delimiter, keyAttr, includeDef ),
        generateRange( range, name, delimiter, keyAttr, includeDef )
    ];
};


const reduceSchemaEntries = fn => (acc, [key, value]) => {
    if (isObject(value)) {
        fn(value);
    } else {
        acc[key] = value;          
    }
    return acc;
};


/** Function that takes a nested Schema definition and creates a flattened
 *  map of the schema definitions and their names.
 * 
 * @param {Object} schemas - the mapping of schemas. 
 * @param {Object} currentSchema - the current schema the function is iterating over. 
 * @param {Object} key - the key that the current iteration is writing to.
 * @param {String} hash - the current constructed hash key.
 * @param {String} range - the current constructed range key.
 * @param {String} name - the given name of the head schema of the current schema if different.
 * @param {String} keyAttr - the given id of the head schema of the current schema if different.
 */
const flat = configObj => ( schemas, {   currentSchema, 
    requiredKey, 
    key, 
    hash, 
    range, 
    name, 
    keyAttr } ) => {
    
    // get the default parameters and initialize the deltas for the schema iteration.
    const   opts  = defaultParameters(configObj),
        { nameKey, delimiter, schemaKeyAttr, includeDef, headerKey } = opts,
        schemaDeltas = {};

    // if name and key attributes have been specified, use them, otherwise use the name and key of the schema.
    const schemaName        = ifExistsElse( name, currentSchema[nameKey] );
    const newKeyAttr        = ifExistsElse( keyAttr, currentSchema[schemaKeyAttr] );

    // generate the key for tge newly formed schema.
    const [generatedHash, generatedRange]           = generateKey( hash, range, schemaName, newKeyAttr, {includeDef,delimiter});

    const applyFlat = value => {

        let nextSchemaHash = generatedHash, usedRange = generatedRange;
        // if the key is not the same, then we use the new generated Hash
        const keyHasBeenChanged = (newKey, oldKey ) => ( newKey.hash !== oldKey.hash ||  newKey.range !== oldKey.range ); 
        if( value.key.hash !==  key.hash ){
            // this means that it is branching off.
            nextSchemaHash = generateHash( undefined, schemaName, delimiter, newKeyAttr, includeDef );
        }
        if( keyHasBeenChanged( value.key, key ) ){
            // would need to generate a new hash
            usedRange = null;
        }

        // get the $header if it exists and use that key.
        const headerCheckedHash = value[headerKey] ? convertToKey(schemaName, delimiter, value[headerKey], includeDef) : nextSchemaHash;

        // if the usedRange is equal to the hash, that means this is the beginning of a hierarchy
        // which means we want it to appear inside of the range of the top level item, but 
        // not in the range of any of the proceeding items in the hierarchy.
        if(exists(usedRange)) usedRange = generatedRange === generatedHash ? "" : generatedRange;
        flat(opts)(schemas, { currentSchema: value.schema, requiredKey: requiredKey, key: value.key, hash: headerCheckedHash, range: usedRange, name: value[nameKey], keyAttr: value[schemaKeyAttr] });
    };

    // set the keys for the delta object.
    schemaDeltas[key.hash]  = generatedHash;
    schemaDeltas[key.range] = generatedRange;

    // assign any other specific attributes (this is also where nested schemas are handled ) 
    Object.assign( schemaDeltas, Object.entries(currentSchema).reduce( reduceSchemaEntries( applyFlat ), {}) );

    // assign to the collection of schemas.
    Object.assign(schemas, updateSchemaSet(schemas, currentSchema[nameKey], schemaDeltas));
};

/** Ensures that the required keys on every schema are set. This would be needed to conform 
 *  to the table's defined schema.
 * 
 * @param {Object} schemas - reference to schemas
 * @param {Object} requiredKey - Object of hash and range keys that are required on every schema.
 * @return {Object} - converted schema.
 */
const ensureRequiredKeys = (schemas, requiredKey, nameKey = "$name", delimiter = "#", schemaKeyAttr = "$key", includeDef = true ) => {
    return mapEntries(schemas, schema => {
        if (!schema[requiredKey.hash]) {
            const hash = generateHash(null, schema[nameKey], delimiter, schema[schemaKeyAttr], includeDef);

            schema[requiredKey.hash]    = hash;
            schema[requiredKey.range]   = hash;
        }

        return schema;
    });
};

/** Primary function that wraps the flat function.
 * 
 * @param {Object} collection - The top level schema of the collection
 * @param {Object} requiredKey - Required Key for the collection 
 * @param {Object} config - config for the flatten structure. 
 */
const flatten = ({config, collection, requiredKey = { hash: "PK", range: "SK" } })=> {
    
    let schemas = {};

    flat( config )( schemas, { currentSchema: collection, key: requiredKey, requiredKey } );

    if(!config) config = {};

    schemas = ensureRequiredKeys( schemas, requiredKey, config["nameKey"], config["delimiter"], config["schemaKeyAttr"], config["includeDef"] );

    return schemas;
};


module.exports = {
    flatten,
    generateRange,
    generateHash
};