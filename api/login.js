import { Issuer } from 'openid-client';

export default async function handler(req, res) {
  const auth0Issuer = await Issuer.discover(process.env.AUTH0_ISSUER_URL);
  const client = new auth0Issuer.Client({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  });

  const state = 'your-random-state';
  const nonce = 'your-random-nonce';
  const callbackUrl = 'https://your-vercel-app-url/api/callback';

  const authorizationUrl = client.authorizationUrl({
    scope: 'openid profile email',
    state,
    nonce,
    redirect_uri: callbackUrl,
  });

  res.redirect(authorizationUrl);
}
