// results
const resultWithoutDefinition = {
    transaction: {
        PK: '{customerId}',
        SK: '{transactiondate}#{transactionId}',
        '$name': 'transaction',
        '$key': '{id}',
        GSIPK: '{accountId}'
    },
    purchase: {
        GSIPK: '{purchaseId}',
        GSISK: "{purchaseTimestamp}",
        SK: '{purchaseId}',
        '$name': 'purchase',
        '$key': '{purchaseId}',
        PK: '{customerId}'
    },
    account: {
        PK: '{customerId}',
        SK: '{accountId}',
        '$name': 'account',
        '$key': '{accountId}',
        GSIPK: '{accountId}'
    },
    Payment: {
        PK: '{customerId}',
        SK: '{paymentId}',
        '$name': 'Payment',
        '$key': '{paymentId}',
        GSIPK: '{accountId}',
        GSISK: "{paymentId}#{paymentTime}"
    },
    customer: {
        PK: '{customerId}',
        SK: '{customerId}',
        '$name': 'customer',
        '$key': '{customerId}'
    }
};

// schemas

const Product = {
    $name: "product",
    $key: "{id}"
};

const Payment = {
    $name: "Payment",
    $key: "{paymentId}"
}

const Transaction = {
    $name: "transaction",
    $key: "{id}"
};

const Purchase = {
    $name: "purchase",
    $key: "{purchaseId}",
    "GSIPK": "{purchaseId}",
    "GSISK": "{purchaseTimestamp}",
    productByPurchase : {
        schema: Product,
        key: {
            hash: "GSIPK2",
            range: "GSISK"
        }
    }
};

const Account = {
    $name: "account",
    $key: "{accountId}",
    "GSIPK": "{accountId}",
    transactionsByAccount: {
        schema: Transaction,
        key: {
            hash: "GSIPK",
            range: "SK"
        },
        $key: '{transactiondate}#{transactionId}',
    },

    paymentByAccount: {
        schema: Payment,
        key: {
            hash: "GSIPK",
            range: "GSISK"
        },
        $key: "{paymentId}#{paymentTime}"
    },
};

const Summary = {
    $name: "Summary",
    $key: "summary"
}

const Customer = {
    $name: "customer",
    $key: "{customerId}",
    transactionsByCustomer: {
        schema: Transaction,
        key: {
            hash: "PK",
            range: "SK"
        },
        $key: "{transactiondate}#{transactionId}"
    },
    accountsByCustomer: {
        schema: Account,
        key: {
            hash: "PK",
            range: "SK"
        },
    },
    paymentsByCustomer: {
        schema: Payment,
        key: {
            hash: "PK",
            range: "SK"
        },
    },
    purchasesByCustomer: {
        schema: Purchase,
        key: {
            hash: "PK",
            range: "SK"
        }
    }
};

module.exports = {
    Customer,
    Summary,
    Account,
    Purchase,
    Transaction,
    Payment,
    Product,
    resultWithoutDefinition
}