# nosqlist

NoSQL Data Library For NodeJS. Primarily developed for use with Single Table Design on NoSQL databases(primarily DynamoDB) spoken about in the talk given by Rick Houlihan: https://www.youtube.com/watch?v=6yqfmXiZTlM&t=2137s. 

## Motivation

Current solutions either work similarly to ORM's or are too opinionated for defining schema's within a Single Table Design context. The idea was to rather create schema that are self-descriptive, could be used within a function and don't really require any state. So, a simple interpolater on an key/value pairing sufficed. 

## Installation

```
npm install nosqlist

const {transform} = require("nosqlist");
```

## Usage

### transform

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

### flatten 

The flatten function would take a hierarchy of defined schemas and then generate a index of schemas that are the flatten 
version of those. An example: 

Let's say the requirement is we have to model an organisation(as above) where we have the organisation, users and tickets. 

Our access patterns would be: 

- Get All Users for an organisation. 
- Get All Tickets for a user and organisation. 

```
const {flatten}             = require("nosqlist");

const Ticket = {
    // name parameter decides what our entity is called within a hierarchy
    $name: "Ticket",
    // key parameter decides which key will be used to primarily identify this schema
    $key: "{ticketId}"
};

const User = {
    $name: "User",
    $key: "{emailAddress}",
    // another relationship here
    getTicketsByUser: {
        schema: Ticket,
        key: {
            hash: "PK",
            range: "SK"
        }
    }
};

const Org = {
    $name: "Org",
    $key: "{orgId}",
    // we then define a relationship for an access pattern: 
    getUsersByOrg: {
        // define which schema was referenced here:
        schema: User,
        // define the key that is used within this hierarchy
        key: {
            hash: "PK",
            range: "SK"
        }
    }
};

// flatten the Org Schema(always the top-level schema.)
flatten({collection: Org});

//result:
{
  Ticket: {
    PK: 'Org#{orgId}',
    SK: 'User#{emailAddress}#Ticket#{ticketId}',
    '$name': 'Ticket',
    '$key': '{ticketId}'
  },
  User: {
    PK: 'Org#{orgId}',
    SK: 'User#{emailAddress}',
    '$name': 'User',
    '$key': '{emailAddress}'
  },
  Org: {
    PK: 'Org#{orgId}',
    SK: 'Org#{orgId}',
    '$name': 'Org',
    '$key': '{orgId}'
  }
} 
```

You can see here that when we pass Ticket data with the "transform" function, it will output the data in a way that we can 
query it to get all of the tickets via Org and User, as well as getting a specific ticket. 

## Some Ending Comments

Primarily building this for fun and to learn more about the different use cases for single table designa and how people are using
it. If you have any use cases that the library doesn't cater/work for, then I am very open to criticism as long as it is constructive :)

Hope you enjoy it! 