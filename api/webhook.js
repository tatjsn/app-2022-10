import path from 'path';
import { Firestore } from '@google-cloud/firestore';

export default async function handler(req, res) {
  const firestore = new Firestore({
    projectId: process.env.G_PROJECT_ID,
    credentials:{
      'client_email': process.env.G_CLIENT_EMAIL,
      'private_key': process.env.G_PRIVATE_KEY,
    },
  });
  const hooks = firestore.collection('hooks');

  for (const event of req.body.events) {
    const result = await hooks.add(event);
    console.log('Added ' + result.id);
  }
  
  return res.send('OK');
}
