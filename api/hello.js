import path from 'path';
import { Environment, FileSystemLoader} from 'nunjucks';

import firestore from './clients/firestore.js';

export default async function handler(req, res) {
  const query = await firestore()
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
