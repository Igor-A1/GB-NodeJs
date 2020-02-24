const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')

function isAccessTokenValid(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    sendResponse(res, null, {
      error: 'You are not authorized.'
    })
    return
  }

  const [bearer, accessToken] = authHeader.split(' ')

  function denyAccess(res, accessToken) {
    res.status(401).json({
      accessToken,
      error: 'The access token is invalid or expired. Access denied.'
    })
  }

  if (bearer !== 'Bearer') {
    denyAccess(res, accessToken)
    return
  }

  try {
    if (jwt.verify(accessToken, 'tokenSign')) {
      req.user = jwt.decode(accessToken)
      next()
    } else {
      denyAccess(res, accessToken)
      return
    }
  }
  catch(e) {
    denyAccess(res, accessToken);
  }
}

function sendResponse(res, err, result) {
  if (err) {
    res.json(err)
  } else {
    res.json(result)
  }
}

function validationErrors(req, res) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    sendResponse(res, null, errors.array())
    return true
  }

  return false
}

module.exports = {
  isAccessTokenValid,
  sendResponse,
  validationErrors
}