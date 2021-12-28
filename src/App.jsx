import React, { useState, useRef, useCallback } from "react";
import BookSearch from "./BookSearch";

function App() {
  const [query, setQuery] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  const { isLoading, error, books, hasMore } = BookSearch(query, pageNumber);  //  бу код тепарокда булиши керак

  const observer = useRef()

  const lastBookElementRef = useCallback(node => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore])

  
  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }


  return (
    <div className="App" style={{padding:'40px'}}>
      <br />
      <input type="text"  onChange={handleSearch} />
      <br /><br />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return  <div ref={lastBookElementRef} key={book} > {book} </div>
        }
        else {
          return <div key={book}> {book} </div>
        }
      })}
      <br /><br />
      <div>{isLoading && 'Loading ...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
