import { Application } from 'express';

export default (app: Application) => {
  const routes = () => {
    app.use('/', (req, res) => {
      res.json({ message: 'hello world' });
    });
  };

  routes();
};
