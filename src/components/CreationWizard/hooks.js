import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {getRadars} from '@sangre-fp/connectors/search-api'


export const useTemplateSearch = (search, language) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchRadars] = useDebouncedCallback(async (query, language) => {
    setLoading(true)
    try {
      setResults((await getRadars(query, language).then(({ result }) => result)))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, 500)

    useEffect(() => {
    if (search) {
      fetchRadars(search, language)
    } else {
      setResults([])
    }
  }, [fetchRadars, search, language])

  return {
    results,
    loading,
    error
  }
}
