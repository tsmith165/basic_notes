import { GetServerSideProps, NextPage } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'
import { useRouter } from 'next/router'

const URL = "https://basic-notes.vercel.app/"

interface Notes {
  notes: {
    title: string
    content: string
    id: string
  }[]
}

interface FormData {
  title: string
  content: string
  id: string
}

const Home = ({notes}: Notes) => {
  const [form, setForm] = useState<FormData>({title: '', content: '', id: ''})

  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function create(data: FormData) {
    try {
      fetch(`${URL}/api/create`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then((res) => {
        res.json().then( json => {
          console.log(json);
          setForm({title: '', content: '', id: ''})
          refreshData()
        })
      })
    } catch (error) {
      console.error("Note creation api call failure.  (Traceback next line)")
      console.log(error)
    }
  }

  async function deleteNote(id: string) {
    try {
      fetch(`${URL}/api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      }).then((res) => {
        res.json().then( json => {
          console.log(json);
          refreshData()
        })
      })
    } catch (error) {
      console.error("Note deletion api call failure.  (Traceback next line)")
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
      <form onSubmit={e => {
        e.preventDefault()
        create(form)
      }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
        
        <input type="text"
          placeholder='Title'
          value={form.title}
          onChange={e=> setForm({...form, title: e.target.value})}
          className="border-2 rounded border-gray-600 p-1"
        />
        <textarea
          placeholder='Content'
          value={form.content}
          onChange={e=> setForm({...form, content: e.target.value})}
          className="border-2 rounded border-gray-600 p-1"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-1">Add +</button>
      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {notes.map(note => (
            <li key={note.id} className="border-b border-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm">{note.content}</p>
                </div>
                <button onClick={() => deleteNote(note.id)} className="bg-red-500 px-3 text-white rounded">X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      content: true
    }
  })

  return {
    props: {
      notes
    }
  }
}