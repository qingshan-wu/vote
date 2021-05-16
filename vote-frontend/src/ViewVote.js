
import axios from 'axios'
import { useEffect, useState, useMemo } from 'react'
import { useRouteMatch, useHistory } from 'react-router'
import { useUserInfo } from './UserContext'
import { voteFetcher } from './data-fetcher'
import io from 'socket.io-client'
import uniqBy from 'lodash/uniqBy'

export default function ViewVote() {

  let match = useRouteMatch()
  let { vote, options } = voteFetcher.read(match.params.id)
  let [ optionsInfo, setOptionsInfo ] = useState(options)
  let userInfo = useUserInfo() //当前登陆用户

  let history = useHistory()

  useEffect(() => {
    setOptionsInfo(options)
  }, [options])

  // id option.id
  // selected 当前用户是否选中该选项
  async function voteOption(id, selected) {
    if (!userInfo) {
      history.push('/login')
      return
    }
    if (!selected) {
      await axios.post('/vote/voteup/' + id)
      console.log('vote ok')
    } else {
      await axios.post('/vote/cancel/' + id)
      console.log('cancel ok')
    }
  }

  useEffect(() => {
    if (vote.deadline > new Date().toISOString()) {
      var socket = io({
        // transports: ['websocket', 'polling']
      })

      socket.emit('select root', vote.id)
      socket.on('voting info', info => {
        setOptionsInfo(info)
      })
      return () => socket.disconnect
    }
  }, [vote.id])

  var allUsers = useMemo(() => {
    let users =  optionsInfo.reduce((ary, option) => {
      ary.push(...option.Users)
      return ary
    }, [])
    let uniqUsers = uniqBy(users, 'id')
    return uniqUsers
  }, [optionsInfo])



  // if (loading) {
  //   return <div>loading</div>
  // }
  return (
    <div>
      <h1>{vote.title}</h1>
      <h2>{vote.desc}</h2>
      {optionsInfo.map((option, idx) => {
        var selected = option.Users.some(user => {
          return userInfo && user.id === userInfo.id
        })
        return (
          <div key={idx}>
            <div onClick={() => voteOption(option.id, selected)}>
              {option.content}
              ----
              {selected ? '✔️' : ''}
              ----
              ({option.Users.length}票)
              ----
              ({(option.Users.length/allUsers.length * 100).toFixed(2)}%)
            </div>
            {!vote.anonymous &&
              <div>
                {option.Users.map((user, idx) => (
                  <span style={{
                      display: 'inline-block',
                      width: 20,
                      height: 20,
                      borderRadius: '9999px',
                      border: '1px solid',
                      textAlign: 'center',
                      lineHeight: "20px"
                  }} key={idx}>{user.name.slice(0, 1).toUpperCase()}</span>
                ))}
              </div>
            }
          </div>
        )
      })}
    </div>
  )

}