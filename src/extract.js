
const convertedTestData = {
    pk: 'firstName',
    sk: '#FIRSTNAME#Cameron#LASTNAME#Harris',
    firstName: 'Cameron',
    lastName: 'Harris',
    age: '26.00'
}

// converted to:

// { 
//     firstName: "Cameron",
//     lastName: "Harris",
//     age: 26
//  };

// using 

const schema = {
    "pk": "firstName",
    "sk": "#FIRSTNAME#{firstName}#LASTNAME#{lastName}",
    "firstName": "{firstName}",
    "lastName": "{lastName}",
    "age": (val) => String(val.toFixed(2))
};

const extract = schema => {

    const converters = {};

    Object.entries( schema ).forEach( ([ key, value ]) => {
        console.log( value );
    });

    return ( ) => {

    };

};

const object = {
    index: 0,
    nextCharacter: "#"
};

// extract(schema);

const regex1 = /{([^{}]*)}/g;
const str1 = '#FIRSTNAME#{firstName}#LASTNAME#{lastName}';
const convertedString = "#FIRSTNAME#Cameron#LASTNAME#Harris";
let array1;
let array2 = [];

/** we will need to be able to get a way of extracting via a pattern
 *  
 *   #FIRSTNAME#{firstName}#LASTNAME#{lastName} => {
 *          firstName: {
 *              begin: #FIRSTNAME#
 *              end: #LASTNAME#
 *          }
 *   }
 * 
 *  where begin and end is the characters that signify everything from the last search or beginning to the next search or end.
 * 
 *  we could say to search for the lastIndexOf using the index from the next match.
 *  
 *  let nextMatchIndex;
 * 
 *  str.lastIndexOf( "#LASTNAME#",  );
 *  
 * we could actually get indexes of each matching keyword ie
 * 
 *  inbetweens = [ "#FIRSTNAME#", "#LASTNAME#"  ];
 * 
 *  
 * 
 */

 const inbetweens = [ "#FIRSTNAME#", "#LASTNAME#",'' ];

 inbetweens
 // reverse because we want to work backwards
    .reverse()

    .forEach( inbetween => {

    });
// while ( (array1 = regex1.exec(str1) ) !== null) {
//     console.log(array1);
    
//     array2.push( array1 );
//     console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
//     // expected output: "Found foo. Next starts at 9."
//     // expected output: "Found foo. Next starts at 19."
//   }
  

// indexes = [  ]
const convertMatchToString =  ( indexes, string)  => {

    indexes.map( index => {  });

};

module.exports = extract;