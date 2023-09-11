const crypto = require("crypto");

const SESSION_LENGTH_HOURS = 3;

// we dont want to check db whenever we authorize a request, would be very slow. thats why we cache some data
// key - session key, UUIDv4
// data - rows from db
const activeSessions = new Map();

const newSession = (data) => {
  const sessionId = crypto.randomUUID();
  activeSessions.set(sessionId, data);
  setTimeout(() => {
    activeSessions.delete(sessionId);
  }, SESSION_LENGTH_HOURS * 60 * 60 * 1000);

  return sessionId;
};

module.exports = {
  activeSessions,
  newSession,
};
