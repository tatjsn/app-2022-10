import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { messageId } = req.query;
  const fetchRes = await fetch(
    `https://api-data.line.me/v2/bot/message/${messageId}/content`,
    {
      headers: { Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}` },
    },
  );
  res.setHeader('Content-Type', fetchRes.headers.get('content-type'));
  res.setHeader('Content-Length', fetchRes.headers.get('content-length'));
  res.setHeader(
    'Cache-Control',
    'Cache-Control: public, max-age=31536000, immutable',
  );
  fetchRes.body.pipe(res);
}
