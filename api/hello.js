import path from 'path';
import { Firestore } from '@google-cloud/firestore';
import { Environment, FileSystemLoader} from 'nunjucks';

export default async function handler(req, res) {
  const keyPath = path.join(process.cwd(), 'secrets', 'firebase.json');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  const firestore = new Firestore();
  const docRefs = await firestore.collection('hooks').listDocuments();
  const docs = await firestore.getAll(...docRefs);
  const items = docs.map(doc => doc.data());

  const env = new Environment(new FileSystemLoader(
    path.join(process.cwd(), 'views'))
  );

  res.setHeader('Content-Type', 'text/html');
  return res.send(env.render('hello.njk', { items }));
}
