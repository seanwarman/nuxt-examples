export default function(req, res, next) {
  res.setHeader('Cache-Control', 'max-age=3600')
  next()
}
