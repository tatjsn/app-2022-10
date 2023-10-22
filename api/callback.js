import cookie from 'cookie';
import view from './clients/view.js';
import auth from './clients/auth.js';

export default async function handler(req, res) {
  const { nonce } = cookie.parse(req.headers.cookie);

  const authClient = await auth();
  const params = authClient.callbackParams(req.url);
  const tokenSet = await authClient.callback(
    process.env.AUTH0_REDIRECT_URI,
    params,
    { nonce },
  );

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', tokenSet.access_token, {
      httpOnly: true,
      maxAge: tokenSet.expires_in,
      path: '/',
      sameSite: 'strict',
      secure: true,
    }),
  );
  res.send(view().render('callback.njk'));
}
