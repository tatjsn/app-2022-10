import firestore from './clients/firestore.js';

export default async function handler(req, res) {
  const hooks = firestore().collection('hooks');

  for (const event of req.body.events) {
    const result = await hooks.add(event);
    console.log('Added ' + result.id);
  }
  
  return res.send('OK');
}
