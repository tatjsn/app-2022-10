import cookie from 'cookie';
import view from './clients/view.js';
import auth from './clients/auth.js';

export default async function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie);

  const userinfo = await (await auth()).userinfo(token);

  res.setHeader('Content-Type', 'text/html');
  res.send(view().render('app.njk', { userinfo }));
}
