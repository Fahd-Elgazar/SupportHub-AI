jest.mock("../services/providers", () => ({
    generate: jest.fn().mockResolvedValue({
        answer: "Mock Answer",
        source: ["Knowledge Base"],
        ticket_category: "account_access",
        impact: "medium",
        urgency: "high",
        suggested_reply: "Reset your password.",
        status: "Open"
    })
}));

const provider = require("../services/providers");

describe("Provider", () => {

    test("should return mocked provider", async () => {

        const result = await provider.generate("Hello");

        expect(result.answer).toBe("Mock Answer");

    });

});