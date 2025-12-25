import { useEffect, useState } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, options);
        const resData = await res.json();

        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}, ${res.status}`);
        }

        setData(resData);
        setError();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); // Make sure dependencies is a valid array

  return { data, loading, error };
};