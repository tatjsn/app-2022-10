import { Issuer } from 'openid-client';

let instance;

export default async function () {
  if (!instance) {
    const auth0Issuer = await Issuer.discover(process.env.AUTH0_ISSUER_URL);
    instance = new auth0Issuer.Client({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
    });
  }

  return instance;
}
