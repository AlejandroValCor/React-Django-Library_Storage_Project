import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState(0)

  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    fetchBooks();
  }, []) // With empty array will make sure to execute only once, when the page renders.

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/books/")
      const data = await response.json() // This will help us structure the JSON data into actual objects we can access.

      setBooks(data)
    }
    catch (error) {
      console.log(error)
    }
  };

  const addBook = async () => {
    const bookData = {
      'title': title,
      'release_year': releaseYear
    }

    try {
      const response = await fetch("http://localhost:8000/api/books/create/", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(bookData)
      })

      const data = await response.json()
      
      setBooks((prev) => [...prev, data]) 
    } catch (err) {
      console.log(err)
    }
  };

  const updateTitle = async (pk, releaseYear) => {
    const bookData = {
      'title': newTitle,
      'release_year': releaseYear
    }

    try {
      const response = await fetch(`http://localhost:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(bookData)
      });

      const data = await response.json()

      setBooks((prev) => prev.map((book) => {
        if (book.id === pk) {
          return data;
        } else {
          return book
        }
      }))
    } catch (err) {
      console.log(err)
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://localhost:8000/api/books/${pk}`, {
        method: "DELETE"
      });

      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h1> Book Website </h1>
      
      <div>
        <input type="text" placeholder='Book Title...' onChange={(e) => setTitle(e.target.value)}/>
        <input type="number" placeholder='Release Year...' onChange={(e) => setReleaseYear(e.target.value)}/>
        <button onClick={addBook}> Add Book </button>
      </div>
      {books.map((book) => (
        <div>
          <p>Title: {book.title}</p>
          <p>Release Year: {book.release_year}</p>
          <input type="text" placeholder='New Title...' onChange={(e) => setNewTitle(e.target.value)}/>
          <button onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </>
  )
}

export default App