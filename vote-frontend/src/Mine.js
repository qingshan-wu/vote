
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useUserInfo } from './UserContext'
import { Link } from 'react-router-dom'
import {useHistory } from 'react-router'

import { List, Item } from 'antd-mobile';

function Mine() {

  let user = useUserInfo()
  let [votes, setVotes] = useState(null)
  let history = useHistory()

  useEffect(() => {
    axios.get('/vote/myvotes/').then(res => {
      setVotes(res.data)
    })
  }, [user])
  console.log(votes)
  if (!votes) {
    return <div>loading...</div>
  }
  return (

    <div>
      <List className="my-list" title>
        {votes.rows.map((vote, idx) => (
          <List.Item arrow="horizontal" multipleLine onClick={() => { history.push('/vote/' + vote.id)}}>
            <Link to={"/vote/" + vote.id}>
                {vote.title}
            </Link>
          </List.Item>
        ))}
      </List>
    </div>

  )
}


export default Mine