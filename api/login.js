import { Issuer } from 'openid-client';
import crypto from 'crypto';
import cookie from 'cookie';

export default async function handler(req, res) {
  const auth0Issuer = await Issuer.discover(process.env.AUTH0_ISSUER_URL);
  const client = new auth0Issuer.Client({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  });

  const nonce = crypto.randomBytes(16).toString('hex');

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('nonce', nonce, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })
  );


  const authorizationUrl = client.authorizationUrl({
    scope: 'openid profile email',
    nonce,
    redirect_uri: process.env.AUTH0_REDIRECT_URI,
  });

  res.redirect(authorizationUrl);
}
