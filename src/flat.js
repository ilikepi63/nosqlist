const {isObject} = require("./utils");
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
const generateHash = (hash, name, delimiter = "#", key, includeDef = true) => hash ? hash : !includeDef ? key : convertToKey(name, delimiter, key);

/** Generates a range key from the give variables, if the range is set, then will add the newly created key
 *  onto the already existing range and return that.
 * 
 * @param {String} range 
 * @param {String} name 
 * @param {String} delimiter 
 * @param {String} key 
 * @return {String} - newly formed range key. 
 */
const generateRange = (range, name, delimiter = "#", key, includeDef = true) => (range || range === '' ? range + delimiter + (!includeDef ? key : convertToKey(name, delimiter, key) ) : "");

// const getName = (schema, key) => schema[nameKey];

// const delim = () => delimiter;

// const getKeyFromSchema = schema => schema[schemaId];

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

}

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
const flat = (obj = { nameKey : "$name", delimiter : "#", schemaKeyAttr : "$key", includeDef : true, headerKey : "$header"}) => ( schemas, {   currentSchema, 
                            requiredKey, 
                            key, 
                            hash, 
                            range, 
                            name, 
                            keyAttr } ) => {

    const { nameKey, delimiter, schemaKeyAttr, includeDef, headerKey} = obj;

    // initialize object that holds the deltas.
    const schemaDeltas = {};

    // if name and key attributes have been specified, use them, otherwise use the name and key of the schema.
    const schemaName        = name      ? name      : currentSchema[nameKey];
    const newKeyAttr        = keyAttr   ? keyAttr   : currentSchema[schemaKeyAttr];

    // generate the hash and range key for the current schema.
    const generatedHash     = generateHash( hash, schemaName, delimiter, newKeyAttr, includeDef );
    const generatedRange    = generateRange( range, schemaName, delimiter, newKeyAttr, includeDef );

    // set the key of the deltas for this current schema.
    schemaDeltas[key.hash]  = generatedHash;
    schemaDeltas[key.range] = generatedRange === "" ? generatedHash : generatedRange;

    // iterate over each key/value in the current schema 
    Object.entries(currentSchema)
        .forEach(([key, value]) => {

        // if it is an object then we assume it is a relationship
        if (isObject(value)) {
            const headerCheckedHash = value[headerKey] ? convertToKey(schemaName, delimiter, value[headerKey]) : generatedHash;

            // recursively call the function on the schema 
            flat(obj)(schemas, { currentSchema: value.schema, requiredKey: requiredKey, key: value.key, hash: headerCheckedHash, range: generatedRange, name: value[nameKey], keyAttr: value[schemaKeyAttr] });
        } else {
            // otherwise, if it is a standard type, then just add it to the deltas.
            schemaDeltas[key] = value;
        }

    });

    // assign to the schemas.
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
            const hash = includeDef ? generateHash(null, schema[nameKey], delimiter, schema[schemaKeyAttr]) :  schema[schemaKeyAttr];

            schema[requiredKey.hash]    = hash;
            schema[requiredKey.range]   = hash;
        }

        return schema;
    })
}

/** Primary function that wraps the flat function.
 * 
 * @param {Object} collection - The top level schema of the collection
 * @param {Object} requiredKey - Required Key for the collection 
 * @param {Object} config - config for the flatten structure. 
 */
const flatten = (collection, requiredKey = { hash: "PK", range: "SK" }, config)=> {

    let schemas = {};

    flat( config )( schemas, { currentSchema: collection, key: requiredKey, requiredKey } );

    if(!config) config = {};

    schemas = ensureRequiredKeys( schemas, requiredKey, config["nameKey"], config["delimiter"], config["schemaKeyAttr"], config["includeDef"] );

    return schemas;
};


module.exports = flatten;