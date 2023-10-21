import { Issuer } from 'openid-client';
import path from 'path';
import cookie from 'cookie';
import { Environment, FileSystemLoader} from 'nunjucks';

export default async function handler(req, res) {
  const auth0Issuer = await Issuer.discover(process.env.AUTH0_ISSUER_URL);
  const client = new auth0Issuer.Client({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  });

  const { nonce } = cookie.parse(req.headers.cookie);

  const params = client.callbackParams(req.url);
  const tokenSet = await client.callback(
    process.env.AUTH0_REDIRECT_URI,
    params,
    { nonce }
  );

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', tokenSet.access_token, {
      httpOnly: true,
      maxAge: tokenSet.expires_in,
      path: '/',
      sameSite: 'strict',
      secure: true,
    })
  );
  const env = new Environment(new FileSystemLoader(
    path.join(process.cwd(), 'views'))
  );
  env.addFilter('date', num => new Date(num).toISOString());
  res.send(env.render('callback.njk'));
}
