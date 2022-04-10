const jwt = require('jsonwebtoken');
const config = require('config');

const privateKey = config.get('privateKey');
const publicKey = config.get('publicKey');

module.exports = {
    signJwt: (object, options) => {
        return jwt.sign(object, privateKey, { ...(options && options), algorithm: 'RS256'})
    },

    verifyJwt: (token) => {
        try {
            const decoded = jwt.verify(token, publicKey);
            return {
                valid: true,
                expired: false,
                decoded
            }
        } catch (error) {
            return {
                valid: false,
                expired: error.message === 'jwt expired',
                decoded: null
            }
        }
    }
}