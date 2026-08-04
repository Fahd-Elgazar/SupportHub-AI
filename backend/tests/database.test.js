const ticketModel = require("../models/ticket.model");

describe("Database",()=>{

    test("get tickets",async()=>{

        const rows = await ticketModel.getAllTickets();

        expect(Array.isArray(rows)).toBe(true);

    });

});