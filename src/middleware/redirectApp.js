const redirectToApp = (req, res, next) => {

  console.log(req.url)

  if (req.url === '/') {
    res.redirect('/app')
    return
  }

  next()

}

module.exports = redirectToApp