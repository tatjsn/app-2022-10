import path from 'path';
import { Firestore } from '@google-cloud/firestore';
import { Environment, FileSystemLoader} from 'nunjucks';

export default async function handler(req, res) {
  const keyPath = path.join(process.cwd(), 'secrets', 'firebase.json');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  const firestore = new Firestore();
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
