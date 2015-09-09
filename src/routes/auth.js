import jwt from 'jsonwebtoken';
import request from 'request';

let auth = {
  tokensignin: (req, res) => {
    let accessToken = req.body.accessToken;

    let tokenVerifyURL = 'https://graph.facebook.com/app?access_token=' +
                            accessToken;

    request(tokenVerifyURL, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let token = jwt.sign({fbID: req.body.userID}, 'meowcat',
                             { expiresInMinutes: 60*5 });
        res.json({ token: token, success: true });
      } else {
        res.send(401, 'Invalid token');
      }
    });
  }
}

export { auth };
