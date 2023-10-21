import path from 'path';
import cookie from 'cookie';
import { Environment, FileSystemLoader} from 'nunjucks';

export default function handler(req, res) {
  const { token } = cookie.parse(req.headers.cookie);
  const env = new Environment(new FileSystemLoader(
    path.join(process.cwd(), 'views'))
  );
  env.addFilter('date', num => new Date(num).toISOString());

  res.setHeader('Content-Type', 'text/html');
  res.send(env.render('app.njk', { token }));
}
