import { Issuer } from 'openid-client';
import path from 'path';
import cookie from 'cookie';
import { Environment, FileSystemLoader} from 'nunjucks';

export default async function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie);
  const env = new Environment(new FileSystemLoader(
    path.join(process.cwd(), 'views'))
  );
  env.addFilter('date', num => new Date(num).toISOString());

  const auth0Issuer = await Issuer.discover(process.env.AUTH0_ISSUER_URL);
  const client = new auth0Issuer.Client({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  });

  const userinfo = await client.userinfo(token);

  console.log(userinfo);

  res.setHeader('Content-Type', 'text/html');
  res.send(env.render('app.njk', { userinfo }));
}
