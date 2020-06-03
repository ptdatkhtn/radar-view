import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {getRadars} from '@sangre-fp/connectors/search-api'


export const useTemplateSearch = (search) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetchRadars] = useDebouncedCallback(async (query) => {
    setLoading(true)
    try {
      setResults((await getRadars(query).then(({ result }) => result)))
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, 500)

    useEffect(() => {
    if (search) {
      fetchRadars(search)
    } else {
      setResults([])
    }
  }, [fetchRadars, search])

  return {
    results,
    loading,
    error
  }
}
