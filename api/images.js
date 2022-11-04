import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messageId } = req.query;
  const fetchRes = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`,
    { headers: { 'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}` } }
  );
  res.setHeader('Cache-Control', 'Cache-Control: public, max-age=31536000, immutable');
  res.setHeader('Content-Type', fetchRes.headers.get('content-type'));
  fetchRes.body.pipe(res);
}
