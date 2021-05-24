const jwt = require('jsonwebtoken');

exports.verifyUser = (req, res, next) => {
    const authHeader = req.headers['authentication'];
    if (!authHeader) return res.send(401, {error: 'unauthorised'});

    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.json({error: 'unauthorised'});
        }
        next();
    })
}