// results
const result = {
    transaction: {
        PK: 'customer#{customerId}',
        SK: '#account#accountId#transaction#{transactiondate}#{transactionId}',
        '$name': 'transaction',
        '$key': '{id}',
        GSIPK: 'customer#{customerId}'
    },
    purchase: {
        GSIPK: 'customer#{customerId}',
        SK: 'purchase#{purchaseId}',
        '$name': 'purchase',
        '$key': '{purchaseId}',
        PK: 'purchase#{purchaseId}'
    },
    account: {
        PK: 'customer#{customerId}',
        SK: '#account#accountId',
        '$name': 'account',
        '$key': 'accountId',
        GS1PK: '{accountId}'
    },
    Payment: {
        PK: 'customer#{customerId}',
        SK: '#Payment#{paymentId}',
        '$name': 'Payment',
        '$key': '{paymentId}'
    },
    customer: {
        PK: 'customer#{customerId}',
        SK: 'customer#{customerId}',
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
    $key: "{purchaseId}"
};

const Account = {
    $name: "account",
    $key: "accountId",
    "GS1PK": "{accountId}",
    transactionsByAccount: {
        schema: Transaction,
        key: {
            hash: "GSIPK",
            range: "SK"
        },
        $key: "{transactiondate}#{transactionId}"
    },
    purchaseByAccount: {
        schema: Purchase,
        key: {
            hash: "GSIPK",
            range: "SK"
        },
        $key: "{transactiondate}#{transactionId}"
    }
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
    result
}