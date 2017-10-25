import createError from 'http-errors';

export default (req, res, next) => {
  next(createError(404, `USER ERROR: ${req.url.path} not a route`));
};
