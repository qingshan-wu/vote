import axios from 'axios'
import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'



export function useInput(init) {
  let [value, setValue] = useState(init)
  let [checked, setChecked] = useState(init)

  let onChange = useCallback(e => {
    setValue(e.target.value)
    setChecked(e.target.checked)
  }, [])
  return {value, checked, onChange}
}


export function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export function useRequest(url) {
  let [data, setData] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(url).then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [url])

  return [data, loading]
}
