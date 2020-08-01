# nosqlist

NoSQL Data Library For NodeJS. Primarily developed for use with Single Table Design on NoSQL databases(mostly DynamoDB) spoken about in the talks presented by Rick Houlihan at AWS Re:Invent: https://www.youtube.com/watch?v=6yqfmXiZTlM&t=2137s. 

## Motivation

Current Single Table solutions either work similarly to ORM's or are too opinionated for defining schema. The idea was to rather create schema that are self-descriptive, could be used within a function and don't really require any state. So, a simple interpolater on a key/value pairing sufficed. 

## Installation

```
npm install nosqlist

const {transform, flatten} = require("nosqlist");
```

## Usage


### transform

The primary idea of this function is to be able to interpolate values into keys of a data object to satisfy specific access patterns on a data model. This way developers can also separate keys of an entity into those that are used for access and those that hold needed data: 

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

The flatten function takes a hierarchy of defined schemas and then generates an index of schemas that are the flattened
version of the hierarchy. For example:

Let's say the requirement is we have to model an organisation where we have the organisation, users and tickets. 

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
    // we then define a relationship for an access pattern: 
    getTicketsByUser: {
        // define which schema was referenced here:
        schema: Ticket,
        // define the key that is used within this hierarchy
        key: {
            hash: "PK",
            range: "SK"
        }
    }
};

const Org = {
    $name: "Org",
    $key: "{orgId}",
    // relationship between user and organisation
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

You can see here that when we invoke the transform function on the Ticket data, it will output data that makes it able to query the ticket via organisation and user. This would also make way for other access patterns such as getting a specific ticket. 

## Some Ending Comments

I've been building this library for fun and to learn more about the different use cases for single table designa and how people are using
it. If you have any use cases that the library doesn't cater/work for, then I am very open to criticism as long as it is constructive :)

Hope you enjoy it! 