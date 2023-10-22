import fetch from 'node-fetch';
import cookie from 'cookie';
import auth from './clients/auth.js';
import firestore from './clients/firestore.js';

export default async function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie);

  const userinfo = await (await auth()).userinfo(token);

  if (userinfo.email !== process.env.APP_ADMIN) {
    throw new Exception('Unauthorised');
  }

  if (!req.body || !req.body.userId || !req.body.message) {
    throw new Exception('Bad request');
  }

  const fetchRes = await fetch('https://api.line.me/v2/bot/message/push',
    { method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: req.body.userId,
        messages: [{
          type: 'text',
          text: req.body.message,
        }],
      }),
    }
  );
  
  if (fetchRes.status !== 200) {
    console.log('Reply status:', fetchRes.status, await fetchRes.json());
    throw new Exception('Reply failed');
  }

  const replies = firestore().collection('replies');
  const result = await replies.add({
    userId: req.body.userId,
    message: req.body.message,
    timestamp: Date.now(),
  });

  console.log('Added replies' + result.id);

  res.redirect('/app');
}
