
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useUserInfo } from './UserContext'
import { Link } from 'react-router-dom'
import { List, InfiniteLoader, AutoSizer} from 'react-virtualized';

function Mine() {

  let [voteData, setVoteData] = useState({row: [], count: 10})
  let [votes, setVotes] = useState([])


  // useEffect(() => {
  //   axios.get('/vote/myvotes/').then(res => {
  //     setVotes(res.data)
  //   })
  // }, [user])

  if (!votes) {
    return <div>loading...</div>
  }

  function loadMore({startIndex, stopIndex}) {
    return axios.get(`/vote/myvotes?startIdx=${startIndex}&stopIndex=${stopIndex}`).then(res => {
      setVoteData(res.data) //里面有总条目数
      votes.splice(startIndex, 0, ...res.data.rows) //插入元素
      setVotes([...votes])
    }).catch(e => {
      console.log(e)
    })
  }

  function rowRenderer({ key, index, style }) {
    if (index >= votes.length) {
      return <div style={style} key={key}>loading...</div>
    }
    return (
      <div style={style} key={key}>
        <Link to={"/vote/" + votes[index].id}>{votes[index].title}</Link>
      </div>
    )
  }

  function isRowLoaded( { index }) {
    return !!votes[index]
  }

  return (
    <div>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMore}
        rowCount={voteData.count}
      >
        {({onRowsRendered, registerChild}) => (
          <List
            onRowsRendered={onRowsRendered}
            ref={registerChild}
            width={300}
            height={300}
            rowCount={voteData.count}
            rowHeight={20}
            rowRenderer={rowRenderer}
          />
        )}

      </InfiniteLoader>
    </div>
  )
}


export default Mine