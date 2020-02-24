function handleRoutes(app) {
  app.all('*', (req, res) => {
    res.status(404).json()
  })
}

module.exports = handleRoutes
