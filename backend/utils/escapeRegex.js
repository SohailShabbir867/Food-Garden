// backend/utils/escapeRegex.js
//
// Escapes special regex characters in user-supplied search text before it's
// used inside a MongoDB $regex query. Without this, a search term containing
// characters like "(", ".", "*", "+" etc. would either throw an invalid-regex
// error or behave as an unintended pattern (e.g. searching "." would match
// every document). Every controller that builds a case-insensitive search
// filter from req.query.search should run the value through this first.

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
