

import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { produce } from 'immer' //不可变数据结构
import { useInput , useQuery} from './hooks'
import axios from 'axios'



export default function CreateVote() {
  let title = useInput('')
  let desc = useInput('')
  let deadline = useInput(new Date(Date.now() + 86400000).toISOString().slice(0, 16))
  let anonymous = useInput(false)
  let restricted = useInput(false)
  let query = useQuery()
  let history = useHistory()


  var [optionStrs, setOptions] = useState([])

  function addOption() {
    setOptions([...optionStrs, ''])
  }

  function deleteOption(idx) {
    setOptions(optionStrs.filter((it, index) => index !== idx))
  }

  function setOptionStr(e, idx) { //结构共享
    setOptions(produce(draft => { // return function
      draft[idx] = e.target.value
    }))
  }

  async function createVote() {
    try {
      let vote = (await axios.post('/vote/create', {
        title: title.value,
        desc: desc.value,
        deadline: deadline.value,
        multiSelect: query.has('multiSelect'),
        anonymous:  anonymous.checked,
        restricted:  restricted.checked,
        options: optionStrs,
      })).data

      history.push('/vote/' + vote.id)
    } catch(e) {
      alert(e)
    }
  }

  return (
    <div>
      <div>Title: <input type="text" {...title}/></div>
      <div>Desc: <input type="text" {...desc}/></div>
      Options:
        {optionStrs.map((optionStr, idx) => {
          return (
            <div key={idx}>
              <button onClick={() => deleteOption(idx)}>-</button>
              <input type="text" value={optionStr} onChange={e => setOptionStr(e, idx)}/>
            </div>
          )
        })}
      <div><button onClick={addOption}>Add Option</button></div>
      <div>Deadline: <input type="datetime-local" {...deadline}/></div>
      <div>Anonymous: <input type="checkbox" {...anonymous}/></div>
      <div>Restricted: <input type="checkbox" {...restricted}/></div>
      <button onClick={createVote}>Create</button>
    </div>
  )
}