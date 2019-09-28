// files that hold constants
// and variables that must be centralized
//

const secret = 'mysecret'; // used to create tokens
const salt = 12 ; // given to bcrypt i use number it may be string.
const tokenExpiresAfter = '1h';

module.exports = {
    secret: secret,
    salt:salt,
    tokenExpiresAfter: tokenExpiresAfter
}