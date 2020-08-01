# nosqlist

NoSQL Data Library For NodeJS. Primarily developed for use with Single Table Design on NoSQL databases(primarily DynamoDB) spoken about in the talk given by Rick Houlihan: https://www.youtube.com/watch?v=6yqfmXiZTlM&t=2137s. 

## Motivation

Current solutions either work similarly to ORM's or are too opinionated for defining schema's within a Single Table Design context. The idea was to rather create schema that are self-descriptive, could be used within a function and don't really require any state. So, a simple interpolater on an key/value pairing sufficed. 

## Installation

`npm install nosqlist`

`const {transform} = require("nosqlist");`

## Usage

The primary idea of this library is to be able to interpolate values into keys so as to satisfy specific access patterns on a data model. This way developers can also divide the data that is being saved between access pattern logic and actual data that is to be saved: 

```
const {transform}              = require("nosqlist");


// test data 
const metadata  = {
    orgName: "Microsoft",
    planType: "Enterprise"
};

const userBillGates = {
    orgName: "Microsoft",
    UserName: "Bill Gates",
    UserType: "Member"
};

const userSatyaNadella = {
    orgName: "Microsoft",
    UserName: "Satya Nadella",
    UserType: "Admin"
};


// schemas 

const metaSchema = {
    "PK": "ORG#{orgName}",
    "SK": "METADATA#{orgName}",
    "OrgName": "{orgName}",
    "PlantType": "{planType}",
    "createdAt": () => Date.now()
};

const userSchema = {
    "PK": "ORG#{orgName}",
    "SK": "USER#{UserName}",
    "UserName": "{UserName}",
    "UserType": "{UserType}",
    "createdAt": () => Date.now()
};


// transform organisation
transform(metaSchema, metadata);
// {
//     PK: 'ORG#Microsoft',
//     SK: 'METADATA#Microsoft',
//     OrgName: 'Microsoft',
//     PlantType: 'Enterprise',
//     createdAt: 1595094213336
// }

// tranform user
transform(userSchema, userBillGates);
// {
//     PK: 'ORG#Microsoft',
//     SK: 'USER#Bill Gates',
//     UserName: 'Bill Gates',
//     UserType: 'Member',
//     createdAt: 1595094213343
// }
```