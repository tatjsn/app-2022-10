import path from 'path';
import { Firestore } from '@google-cloud/firestore';

export default async function handler(req, res) {
  const keyPath = path.join(process.cwd(), 'secrets', 'firebase.json');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  const firestore = new Firestore();
  const hooks = firestore.collection('hooks');

  for (const event of req.body.events) {
    const result = await hooks.add(event);
    console.log('Added ' + result.id);
  }
  
  return res.send('OK');
}
