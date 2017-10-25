import * as util from '../lib/util.js'

export default (req, res, next) => { 
  if(req.header.debug){
    util.log('req.url', req.url)
    util.log('req.body', req.body)
    util.log('req.query', req.query)
    util.log('req.headers', req.headers)
  }
  next()
}
