import Layout from '@/components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import Image from 'next/image'
import {FaImage} from 'react-icons/fa'

export default function EditEventPage({ evt }) {
  const formattedDate = evt.date.slice(0, 10)

  const [values, setValues] = useState({
    name: evt.name,
    venue: evt.venue,
    address: evt.address,
    date: formattedDate,
    time: evt.time,
    performers: evt.performers,
    description: evt.description,
  })

  const [imagePreview, setImagePreview] = useState(
    evt.image.length > 0
      ? evt.image[0].formats.thumbnail.url
      : '/images/event-default.png'
  )

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )

    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
    }

    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: `PUT`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    console.log(values)
    if (!res.ok) {
      toast.error('Something went wrong')
    } else {
      const evt = await res.json()
      router.push(`/events/${evt.slug}`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  return (
    <Layout title='Add New Event'>
      <ToastContainer />
      <Link href='/events'>Go Back</Link>
      <h1>Edit Event</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Event Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Performers</label>
            <input
              type='text'
              id='performers'
              name='performers'
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              id='venue'
              name='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Address</label>
            <input
              type='text'
              id='address'
              name='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Date</label>
            <input
              type='date'
              id='date'
              name='date'
              //   value={dayjs(values.date).format('YYYY-MM-DD')}
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Time</label>
            <input
              type='text'
              id='time'
              name='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            id='description'
            name='description'
            value={values.description}
            onChange={handleInputChange}
          />
        </div>
        <input type='submit' value='Update Event' className='btn' />
      </form>
      <h2>Event Image</h2>
      <Image src={imagePreview} height={100} width={170}></Image>
<div>
    <button className='btn-secondary'>
        <FaImage /> Update Image
    </button>
</div>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/events/${id}`)
  const evt = await res.json()

  return {
    props: { evt },
  }
}
