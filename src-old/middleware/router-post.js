import {Router} from 'express';
import {bearerAuth} from './parser-auth.js';
import parserBody from './parser-body.js';
import Post from '../model/post.js';

export default new Router()
  .post('/post', bearerAuth, parserBody, (req, res, next) => {
    console.log(req, '(((((((((((((((backend post REEQ')
    Post.create(req)
      .then(res.json)
      .catch(next);
  })
  .get('/post', (req, res, next) => {
    Post.fetch(req)
      .then(res.page)
      .catch(next);
  })
  .get('/post/me', bearerAuth, (req, res, next) => {
    Post.fetch(req, {owner: req.user._id})
      .then(res.page)
      .catch(next);
  })
  .get('/post/:id', (req, res, next) => {
    Post.fetchOne(req)
      .then(res.json)
      .catch(next);
  })
  .put('/post/:id', bearerAuth, parserBody, (req, res, next) => {
    Post.update(req)
      .then(res.json)
      .catch(next);
  })
  .delete('/post/:id', bearerAuth, (req, res, next) => {
    Post.delete(req)
      .then(() => res.sendStatus(204))
      .catch(next);
  });
