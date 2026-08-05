const db = require("../config/database");

const createTicket = async (ticket) => {
  const query = `
    INSERT INTO tickets (
      question,
      answer,
      source,
      ticket_category,
      impact,
      urgency,
      priority,
      sla,
      escalation_team,
      suggested_reply,
      status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
    )
    RETURNING *;
  `;

  const values = [
    ticket.question,
    ticket.answer,
    ticket.source,
    ticket.ticket_category,
    ticket.impact,
    ticket.urgency,
    ticket.priority,
    ticket.sla,
    ticket.escalation_team,
    ticket.suggested_reply,
    ticket.status,
  ];

  const result = await db.query(query, values);

  return result.rows[0];
};

const getAllTickets = async () => {
  const result = await db.query(
    `
    SELECT *
    FROM tickets
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const getTicketById = async (id) => {
  const result = await db.query(
    `
    SELECT *
    FROM tickets
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

/**
 * `reply` is optional — set alongside status when an agent sends their
 * edited reply (the reply itself is stored in the existing suggested_reply
 * column; there's no separate "sent reply" field, so this overwrites it
 * with whatever was actually sent).
 */
const updateTicketStatus = async (id, status, reply) => {
  if (reply !== undefined) {
    const result = await db.query(
      `
      UPDATE tickets
      SET status = $1, suggested_reply = $2
      WHERE id = $3
      RETURNING *
      `,
      [status, reply, id]
    );

    return result.rows[0];
  }

  const result = await db.query(
    `
    UPDATE tickets
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
};

const deleteTicket = async (id) => {
  await db.query(
    `
    DELETE FROM tickets
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
};