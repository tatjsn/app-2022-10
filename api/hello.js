import path from 'path';
import { readFileSync } from 'fs';
import { Firestore } from '@google-cloud/firestore';

export default async function handler(req, res) {
  const keyPath = path.join(process.cwd(), 'secrets', 'firebase.json');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  const firestore = new Firestore();
  const docRefs = await firestore.collection('posts').listDocuments();
  const docs = await firestore.getAll(...docRefs);
  const raw = readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
  const pkg = JSON.parse(raw);

  res.setHeader('Content-Type', 'text/html');
  return res.send(`
<body>
<h1>Hello from server</h1>
<p>cwd: ${process.cwd()}</p>
<p>LAMBDA_TASK_ROOT: ${process.env.LAMBDA_TASK_ROOT}</p>
<p>name: ${pkg.name}</p>
${ docs.map(doc => doc.data().title).map(str => '<li>' + str).join('') }
</body>
  `);
}
