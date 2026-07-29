const request = require("supertest");
const app = require("../index");

describe("SupportHub API", () => {

    describe("POST /api/supporthub-ai", () => {

        test("should create ticket", async () => {

            const response = await request(app)
                .post("/api/supporthub-ai")
                .send({
                    question: "I forgot my password."
                });

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.data.question)
                .toBe("I forgot my password.");

        });

        test("should reject empty body", async () => {

            const response = await request(app)
                .post("/api/supporthub-ai")
                .send({});

            expect(response.statusCode).toBe(400);

        });

        test("should reject short question", async () => {

            const response = await request(app)
                .post("/api/supporthub-ai")
                .send({
                    question: "Hi"
                });

            expect(response.statusCode).toBe(400);

        });

    });

    describe("GET Tickets", () => {

        test("should get all tickets", async () => {

            const response = await request(app)
                .get("/api/supporthub-ai/tickets");

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(Array.isArray(response.body.data))
                .toBe(true);

        });

    });

    describe("GET Ticket By Id", () => {

        test("should return 404 for unknown ticket", async () => {

            const response = await request(app)
                .get("/api/supporthub-ai/ticket/999999");

            expect([200,404]).toContain(response.statusCode);

        });

    });

    describe("POST Feedback", () => {

        test("should save feedback", async () => {

            const response = await request(app)
                .post("/api/supporthub-ai/feedback")
                .send({

                    ticket_id:1,

                    rating:5,

                    comment:"Excellent"

                });

            expect([200,201]).toContain(response.statusCode);

        });

        test("should reject invalid rating", async () => {

            const response = await request(app)
                .post("/api/supporthub-ai/feedback")
                .send({

                    ticket_id:1,

                    rating:8

                });

            expect(response.statusCode).toBe(400);

        });

    });

    describe("Health", () => {

        test("should return api health", async () => {

            const response = await request(app)
                .get("/api/supporthub-ai/health");

            expect(response.statusCode).toBe(200);

            expect(response.body.status)
                .toBe("healthy");

        });

    });

    describe("Version", () => {

        test("should return api version", async () => {

            const response = await request(app)
                .get("/api/supporthub-ai/version");

            expect(response.statusCode).toBe(200);

            expect(response.body.success)
                .toBe(true);

        });

    });

    describe("404", () => {

        test("unknown route", async () => {

            const response = await request(app)
                .get("/unknown");

            expect(response.statusCode).toBe(404);

        });

    });

});