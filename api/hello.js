import cookie from 'cookie';
import auth from './clients/auth.js';
import view from './clients/view.js';
import firestore from './clients/firestore.js';

export default async function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie);

  const userinfo = await (await auth()).userinfo(token);

  if (userinfo.email !== process.env.APP_ADMIN) {
    throw new Exception('Unauthorised');
  }

  const query = await firestore()
    .collection('hooks')
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();
  const items = query.docs.map(doc => doc.data());

  res.setHeader('Content-Type', 'text/html');
  res.send(view().render('hello.njk', { items }));
}
