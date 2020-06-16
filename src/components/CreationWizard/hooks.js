import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {getRadars} from '@sangre-fp/connectors/search-api'


export const useTemplateSearch = (search, language, isEmpty = false) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [fetchRadars] = useDebouncedCallback(async (query, language) => {
    try {
      setResults((await getRadars(query, language, isEmpty)
        .then(({ result }) => {
          setLoading(false)
          return result
        })))
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }, 500)


    useEffect(() => {
    if (search || isEmpty) {

      setLoading(true)

      fetchRadars(search, language)


    } else {
      setResults([])
    }
  }, [fetchRadars, search, language, isEmpty])

  return {
    results,
    loading,
    error
  }
}
