const request = require("supertest");
const app = require("../index");

describe("SupportHub AI API", () => {
  describe("POST /api/supporthub-ai", () => {
    it("should return 200 for a valid request", async () => {
      const response = await request(app)
        .post("/api/supporthub-ai")
        .send({
          question: "I can't login to my account."
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("question");
      expect(response.body.data).toHaveProperty("answer");
      expect(response.body.data).toHaveProperty("source");
      expect(response.body.data).toHaveProperty("ticket_category");
      expect(response.body.data).toHaveProperty("impact");
      expect(response.body.data).toHaveProperty("urgency");
      expect(response.body.data).toHaveProperty("priority");
      expect(response.body.data).toHaveProperty("sla");
      expect(response.body.data).toHaveProperty("escalation_team");
      expect(response.body.data).toHaveProperty("suggested_reply");
      expect(response.body.data).toHaveProperty("status");
    });

    it("should return 400 when question is missing", async () => {
      const response = await request(app)
        .post("/api/supporthub-ai")
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 400 for empty question", async () => {
      const response = await request(app)
        .post("/api/supporthub-ai")
        .send({
          question: ""
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 400 for short question", async () => {
      const response = await request(app)
        .post("/api/supporthub-ai")
        .send({
          question: "abc"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/supporthub-ai/feedback", () => {
    it("should accept valid feedback", async () => {
      const response = await request(app)
        .post("/api/supporthub-ai/feedback")
        .send({
          question: "Login issue",
          answer: "Reset your password.",
          rating: 5,
          comment: "Helpful response"
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("should reject invalid rating", async () => {
      const response = await request(app)
        .post("/api/supporthub-ai/feedback")
        .send({
          question: "Login issue",
          answer: "Reset password",
          rating: 10
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/supporthub-ai/health", () => {
    it("should return health status", async () => {
      const response = await request(app)
        .get("/api/supporthub-ai/health");

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("healthy");
    });
  });

  describe("GET /api/supporthub-ai/version", () => {
    it("should return version information", async () => {
      const response = await request(app)
        .get("/api/supporthub-ai/version");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("api_version");
      expect(response.body).toHaveProperty("prompt_version");
    });
  });
});