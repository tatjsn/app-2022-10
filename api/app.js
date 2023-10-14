import path from 'path';
import { Environment, FileSystemLoader} from 'nunjucks';

export default function handler(req, res) {
  const env = new Environment(new FileSystemLoader(
    path.join(process.cwd(), 'views'))
  );
  env.addFilter('date', num => new Date(num).toISOString());

  res.setHeader('Content-Type', 'text/html');
  return res.send(env.render('app.njk'));
}
