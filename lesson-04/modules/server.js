const url         = 'http://localhost',
  port            = 3033,
  cookiePassword  = 'my secret password',
  cookieDir       = 'user'


if(typeof window === 'undefined' && module.exports)
  module.exports = {url, port, cookiePassword, cookieDir}
