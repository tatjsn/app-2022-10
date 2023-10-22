import cookie from 'cookie';
import view from './clients/view.js';
import auth from './clients/auth.js';
import firestore from './clients/firestore.js';

async function getPosts(userId) {
  const query = await firestore()
    .collection('hooks')
    .where('source.userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();
  return query.docs.map((doc) => doc.data());
}

async function getReplies(userId) {
  const query = await firestore()
    .collection('replies')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();
  return query.docs.map((doc) => doc.data());
}


export default async function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie);

  const userinfo = await (await auth()).userinfo(token);

  if (userinfo.email !== process.env.APP_ADMIN) {
    throw new Exception('Unauthorised');
  }

  if (!req.query || !req.query.userId) {
    const query = await firestore()
      .collection('hooks')
      .where('type', '==', 'follow')
      .get();
    const items = query.docs.map((doc) => doc.data());

    res.setHeader('Content-Type', 'text/html');
    res.send(view().render('app.njk', { items }));
    return;
  }

  const [rawPosts, rawReplies] = await Promise.all([getPosts(req.query.userId), getReplies(req.query.userId)]);

  const posts = rawPosts.map(post => ({
    isReply: false,
    type: post.type,
    message: post.message,
    timestamp: post.timestamp,
  }));

  const replies = rawReplies.map(reply => ({
    isReply: true,
    type: 'message',
    message: {
      type: 'text',
      text: reply.message,
    },
    timestamp: reply.timestamp,
  }));

  const rawItems = [...posts, ...replies];
  rawItems.sort((a, b) => b.timestamp - a.timestamp);
  const items = rawItems.slice(0, 10).reverse();

  res.setHeader('Content-Type', 'text/html');
  res.send(view().render('appUserId.njk', { items, userId: req.query.userId }));
}
