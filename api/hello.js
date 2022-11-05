import path from 'path';
import { Firestore } from '@google-cloud/firestore';
import { Environment, FileSystemLoader} from 'nunjucks';

export default async function handler(req, res) {
  const firestore = new Firestore({
    projectId: process.env.G_PROJECT_ID,
    credentials:{
      'client_email': process.env.G_CLIENT_EMAIL,
      'private_key': process.env.G_PRIVATE_KEY,
    },
  });
  const query = await firestore
    .collection('hooks')
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get();
  const items = query.docs.map(doc => doc.data());

  const env = new Environment(new FileSystemLoader(
    path.join(process.cwd(), 'views'))
  );
  env.addFilter('date', num => new Date(num).toISOString());

  res.setHeader('Content-Type', 'text/html');
  return res.send(env.render('hello.njk', { items }));
}
