const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const { initConnection } = require('../middlewares/dbConnection');

class GoogleCloudController {
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.init();
  }

  async init() {
    this.connection = await initConnection();
  }

  // [POST] /googlecloud/signInWithGoogle
  GoogleLogin = async (req, res) => {
    const { tokenId } = req.body;

    if (!tokenId) {
        return res.status(400).json({ error: 'Token ID is required' });
    }

    try {
        const ticket = await this.client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload['email'];
        const name = payload['name'];

        const [rows] = await this.connection.query('CALL fn_get_user_by_email(?)', [email]);

        if (rows[0].length === 0) {
            console.log('User not found, creating new user...');
            const params = [
                name,
                name,
                "123",
                email
            ];
            await this.connection.query('CALL fn_create_user_for_google(?, ?, ?, ?)', params);
        }

        const [userRows] = await this.connection.query('CALL fn_get_user_by_email(?)', [email]);
        const user = userRows[0][0];
        req.session.user = {
            UserId: user.UserId,
            Email: user.Email,
            UserRoleId: user.UserRoleId
        };

        res.json({ state: 'success', message: 'Logged in with Google successfully' });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ error: 'Google login error', details: error.message });
    }
};
}

module.exports = new GoogleCloudController;