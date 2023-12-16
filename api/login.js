import cookie from 'cookie';
import auth from './clients/auth.js';

export default async function handler(req, res) {
  const nonce = crypto.randomBytes(16).toString('hex');

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('nonce', nonce, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    }),
  );

  const authorizationUrl = (await auth()).authorizationUrl({
    scope: 'openid profile email',
    nonce,
    redirect_uri: process.env.AUTH0_REDIRECT_URI,
  });

  res.redirect(303, authorizationUrl);
}
