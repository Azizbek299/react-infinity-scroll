import { useEffect, useState } from "react";
import axios from "axios";

export default function BookSearch(query, pageNumber) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]); // Бу булмаса Search полясига янгитдан суз езса query лар обновить булмайди эскилари тураверади
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    let cancel;

    async function getData() {
      await axios({
        method: "get",
        url: "http://openlibrary.org/search.json",
        params: {
          q: query,
          page: pageNumber, // Server да урнатилга булади настройкаси
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          setBooks((prevBooks) => {
            return [
              ...new Set([
                ...prevBooks,
                ...res.data.docs.map((book) => book.title),
              ]),
            ]; // value лар уникальный булиши учун Set дан фойдаланяпмиз
          });
          setHasMore(res.data.docs.length > 0);
          setIsLoading(false);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          setError(true);
        });

      return () => cancel();
    }
    getData()
  }, [query, pageNumber]);

  return { isLoading, error, books, hasMore };
}
