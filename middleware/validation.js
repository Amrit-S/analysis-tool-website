/**
 * This file is middleware for express-validator to throw errors, if a route is not giving its
 * expected request body keys.
 */

const { validationResult } = require("express-validator");

const isValidated = (req, res, next) => {
    const result = validationResult(req);
    // no syntax errors, continue
    if (result.isEmpty()) {
        return next();
    }
    // some syntax error in request occurred
    return res.status(400).json({ message: "User input is malformed" });
};

module.exports = {
    isValidated,
};
