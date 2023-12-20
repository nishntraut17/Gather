const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        console.log("yaha tak working");
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) return res.send(error);

        const token = authHeader.split(" ")[1];
        console.log(token);

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.send(err);
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

module.exports = auth;
