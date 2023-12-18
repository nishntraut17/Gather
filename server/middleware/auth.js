const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    console.log("yaha tak working");
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401).send(error);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded.userId;
        next();
    });
};

module.exports = auth;
