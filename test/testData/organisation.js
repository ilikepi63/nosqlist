// test data 
const metadata = {
    orgName: "Microsoft",
    planType: "Enterprise"
};

const userBillGates = {
    UserName: "Bill Gates",
    UserType: "Member"
};

const userSatyaNadella = {
    UserName: "Satya Nadella",
    UserType: "Admin"
};

const ticket1 = {
    number: 1,
    createdAt: 1595441895064
};

const ticket2 = {
    number: 2,
    createdAt: 1595441913723
};

const customer1 = {
    email: "bradley@jenkins.com",
    name: "Bradley",
    surname: "Jenkins"
};

// schemas 

const ticketSchema = {
    "$name": "TICKET",
    "$key": "{number}"
};

const customerSchema = {
    "$name": "CUSTOMER",
    "$key": "{email}",
};

const userSchema = {
    "$name": "USER",
    "$key": "{UserName}",
    "Tickets": {
        key: {
            hash: "PK",
            range: "SK"
        },
        schema: ticketSchema
    },
    "Customers": {
        schema: customerSchema,
        key: {
            hash: "GSI2PK",
            range: "GSI2SK"
        },
    }
};



const metaSchema = {
    "$name": "ORG",
    "$key": "{orgName}",
    "Users": //userSchema,
    {
        schema: userSchema,
        key: {
            hash: "PK",
            range: "SK"
        },
        $name: "USER",
    },
    "Customers": //customerSchema,
    {
        schema: customerSchema,
        key: {
            hash: "GSI1PK",
            range: "GSI1SK"
        },
    }
};

const orgResult = {
    TICKET: {
        PK: "ORG#{orgName}",
        SK: "USER#{UserName}#TICKET#{number}",
        "$name": "TICKET",
        "$key": "{number}"
    },
    CUSTOMER: {
        GSI2PK: "USER#{UserName}",
        GSI2SK: "CUSTOMER#{email}",
        "$name": "CUSTOMER",
        "$key": "{email}",
        GSI1PK: "ORG#{orgName}",
        GSI1SK: "CUSTOMER#{email}",
        PK: "CUSTOMER#{email}",
        SK: "CUSTOMER#{email}"
    },
    USER: {
        PK: "ORG#{orgName}",
        SK: "USER#{UserName}",
        "$name": "USER",
        "$key": "{UserName}"
    },
    ORG: {
        PK: "ORG#{orgName}",
        SK: "ORG#{orgName}",
        "$name": "ORG",
        "$key": "{orgName}"
    }
};
  

module.exports = {
    metaSchema,
    orgResult
};