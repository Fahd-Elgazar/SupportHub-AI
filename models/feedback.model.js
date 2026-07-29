const db = require("../config/database");

const createFeedback = async (feedback) => {
  const query = `
    INSERT INTO feedback (
      ticket_id,
      rating,
      comment
    )
    VALUES ($1,$2,$3)
    RETURNING *;
  `;

  const values = [
    feedback.ticket_id,
    feedback.rating,
    feedback.comment,
  ];

  const result = await db.query(query, values);

  return result.rows[0];
};

const getAllFeedback = async () => {
  const result = await db.query(
    `
    SELECT
      f.*,
      t.question,
      t.ticket_category
    FROM feedback f
    LEFT JOIN tickets t
      ON f.ticket_id = t.id
    ORDER BY f.created_at DESC
    `
  );

  return result.rows;
};

const getFeedbackByTicket = async (ticketId) => {
  const result = await db.query(
    `
    SELECT *
    FROM feedback
    WHERE ticket_id = $1
    ORDER BY created_at DESC
    `,
    [ticketId]
  );

  return result.rows;
};

const deleteFeedback = async (id) => {
  await db.query(
    `
    DELETE FROM feedback
    WHERE id = $1
    `,
    [id]
  );
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackByTicket,
  deleteFeedback,
};