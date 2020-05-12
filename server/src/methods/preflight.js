function setHeaders(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    
    if (!['PUT', 'POST', 'PATH', 'DELETE', 'GET'].indexOf(req.method)) {
      res.header('Access-Control-Allow-Methods', 'OPTIONS, PUT, POST, PATH, DELETE, GET')
    }
  
    next()
}

module.exports = { setHeaders }
  