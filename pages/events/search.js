import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import { API_URL } from '@/config/index'
import qs from 'qs'

export default function SearchPage({ events }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

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
        { description_contains: term }
      ]
    }
  })

//   {query.length > 0 ? console.log('inside Search Page query: ', query) : console.log('no query generated')}
  const res = await fetch(`${API_URL}/events?${query}`)
  const events = await res.json()

  return {
    props: { events },
    // revalidate: 1,    not needed with getServerSideProps because it always gets props on reload
  }
}
