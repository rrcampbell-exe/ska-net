const router = require('express').Router()

const apiRoutes = require('./api')

router.use('/api/v1/chat', apiRoutes)

router.use((req, res) => {
  res.status(404).end()
})

module.exports = router
