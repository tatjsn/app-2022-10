import view from './clients/view.js';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.send(view().render('landing.njk'));
}
