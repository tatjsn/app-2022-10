import { Firestore } from '@google-cloud/firestore';

let instance;

export default function () {
  if (!instance) {
    instance = new Firestore({
      projectId: process.env.G_PROJECT_ID,
      credentials:{
        'client_email': process.env.G_CLIENT_EMAIL,
        'private_key': process.env.G_PRIVATE_KEY,
      },
    });
  }

  return instance;
}
