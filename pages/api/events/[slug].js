// use the common require because this is only used on the backend
const { events } = require('./data.json')

export default (req, res) => {
  const evt = events.filter((ev) => ev.slug === req.query.slug)


  // respond to only GET requests
  
  if (req.method === 'GET') {
    res.status(200).json(evt)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}