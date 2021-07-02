import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import EventItem from '@/components/Eventitem'
import { API_URL } from '@/config/index'
import qs from 'qs'
import { FaItalic } from 'react-icons/fa'
import Link from 'next/link'

export default function SearchPage({ events }) {
  const router = useRouter()
  return (
    <Layout title='Search Results'>
      <h1>
        Search Results for:{' '}
        <span style={{ fontStyle: 'italic' }}> {router.query.term}</span>{' '}
      </h1>
      <Link href='/'>Go Back</Link>
      {events.length === 0 && <h3>No events matched your search term</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}
    </Layout>
  )
}

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify({
    _where: {
      _or: [
        { name_contains: term },
        { venue_contains: term },
        { performers_contains: term },
        { description_contains: term },
      ],
    },
  })

  const res = await fetch(`${API_URL}/events?${query}`)
  const events = await res.json()

  return {
    props: { events },
    // revalidate: 1,    not needed with getServerSideProps because it always gets props on reload
  }
}
