const employeeResult = {
    Meeting: {
        PK: "Employee#{employeeId}",
        SK: "Meeting#{time}|{floor}.{room}",
        "$name": "Meeting",
        "$key": "{time}|{floor}.{room}",
        GS1PK: "Employee#{email}",
        GS1SK: "Meeting#{time}|{floor}.{room}"
    },
    Ticket: {
        GS1PK: "Employee#{employeeId}",
        GS1SK: "Meeting#{ticketId}",
        "$name": "Ticket",
        "$key": "{ticketId}",
        PK: "Ticket#{ticketId}",
        SK: "Ticket#{ticketId}"
    },
    Employee: {
        PK: "Employee#{employeeId}",
        SK: "Employee#{employeeId}",
        "$name": "Employee",
        "$key": "{employeeId}",
        GS1PK: "{email}",
        GS1SK: "{employeeId}"
    }
};

const buildingResult = {
    Meeting: {
        PK: "Building#buildingId",
        SK: "Meeting#{time}",
        "$name": "Meeting",
        "$key": "{time}|{floor}.{room}"
    },
    Room: {
        PK: "Building#buildingId",
        SK: "Room#RoomId",
        "$name": "Room",
        "$key": "RoomId"
    },
    Building: {
        PK: "Building#buildingId",
        SK: "Building#buildingId",
        "$name": "Building",
        "$key": "buildingId"
    }
};

// const project = {
//     "$name": "Project",
//     "$key": "projectId"
// };

// const TimeCard = {

// };

const Room = {
    "$name": "Room",
    "$key": "RoomId"
};

const Ticket = {
    "$name": "Ticket",
    "$key": "{ticketId}",

};

const Meeting = {
    "$name": "Meeting",
    "$key": "{time}|{floor}.{room}",
};

const Employee = {
    "$name": "Employee",
    "$key": "{employeeId}",
    "GS1PK": "{email}",
    "GS1SK": "{employeeId}",
    "MeetingsById": {
        schema: Meeting,
        key: {
            hash: "PK",
            range: "SK"
        },
    },
    "MeetingsByEmail": {
        schema: Meeting,
        key: {
            hash: "GS1PK",
            range: "GS1SK"
        },
        $header: "{email}"
    },
    "Tickets": {
        schema: Ticket,
        key: {
            hash: "GS1PK",
            range: "GS1SK"
        },
        $key: "{ticketId}",
        $name: "Meeting"
    },
};


const Building = {
    "$name": "Building",
    "$key": "buildingId",
    "Meetings": {
        schema: Meeting,
        key: {
            hash: "PK",
            range: "SK"
        },
        $key: "{time}",
        $name: "Meeting"
    },
    "Rooms": {
        schema: Room,
        key: {
            hash: "PK",
            range: "SK"
        },
    },
};



// const Message = {
//     "$name": "Message",
//     "$key": "messageId"
// };

module.exports = {
    Employee,
    Building,
    employeeResult,
    buildingResult
};