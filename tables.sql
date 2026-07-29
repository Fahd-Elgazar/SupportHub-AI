CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    source TEXT[],
    ticket_category VARCHAR(50) NOT NULL,
    impact VARCHAR(20) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    sla VARCHAR(50) NOT NULL,
    escalation_team VARCHAR(100),
    suggested_reply TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);