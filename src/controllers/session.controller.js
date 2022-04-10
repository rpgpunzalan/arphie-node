const {validatePassword} = require('../services/user.service');
const {signJwt} = require('../utils/jwt.utils');
const config = require('config');

module.exports = {

    createSessionHandler: async (req, res) => {
        // Validate the user's password
        const user = await validatePassword(req.body)

        if(!user) {
            return res.status(401).send("Invalid email or password.");
        }

        // Create an access token
        const accessToken = signJwt({
            ...user
        },{
            expiresIn: config.get('accessTokenTtl') //15m
        })

        // Create a refresh token
        const refreshToken = signJwt({
            ...user, 
        },{
            expiresIn: config.get('refreshTokenTtl') //1y
        })

        // Return access & refresh tokens
        res.send({accessToken, refreshToken, user})
    }

}