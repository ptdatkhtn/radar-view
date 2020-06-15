import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {getRadars} from '@sangre-fp/connectors/search-api'


export const useTemplateSearch = (search, language, isEmpty = false) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchRadars] = useDebouncedCallback(async (query, language) => {
    setLoading(true)
    try {
      setResults((await getRadars(query, language, isEmpty).then(({ result }) => result)))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, 500)

    useEffect(() => {
    if (search || isEmpty) {
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
