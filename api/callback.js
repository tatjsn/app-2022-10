import { Issuer } from 'openid-client';
import cookie from 'cookie';

export default async function handler(req, res) {
  const auth0Issuer = await Issuer.discover(process.env.AUTH0_ISSUER_URL);
  const client = new auth0Issuer.Client({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  });

  const params = client.callbackParams(req.url);
  const tokenSet = await client.callback(
    process.env.AUTH0_REDIRECT_URI,
    params,
    { nonce: 'your-random-nonce', state: params.state }
  );

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('your-cookie-name', tokenSet.id_token, {
      httpOnly: true,
      maxAge: tokenSet.expires_in,
      path: '/',
      sameSite: 'strict',
      secure: true, // You should use HTTPS in production
    })
  );

  // Redirect to the app page
  res.redirect('/app');
}
