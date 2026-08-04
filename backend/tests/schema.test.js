const schema = require("../schemas/supportResponse.schema");

describe("Schema Validation",()=>{

    test("valid response",()=>{

        const {error}=schema.validate({

            question:"Test",

            answer:"Answer",

            source:["KB"],

            ticket_category:"account_access",

            impact:"medium",

            urgency:"high",

            priority:"P2",

            sla:"8 Hours",

            escalation_team:"Identity",

            suggested_reply:"Reset password",

            status:"Open"

        });

        expect(error).toBeUndefined();

    });

});