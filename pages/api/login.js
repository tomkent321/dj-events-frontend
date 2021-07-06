import cookie from 'cookie'
import { API_URL } from '@/config/index'

// This function is a go-between api with Strapi It will set an http cookie

export default async (req, res) => {
  if (req.method === 'POST') {
    const { identifier, password } = req.body

    const strapiRes = await fetch(`${API_URL}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    const data = await strapiRes.json()

    if (strapiRes.ok) {
        
      //set http cookie

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/',
        })
      )

      res.status(200).json({ user: data.user })
    } else {
      res
        .status(data.statusCode)
        .json({ message: data.message[0].messages[0].message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}
