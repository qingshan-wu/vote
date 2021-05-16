
// import {useContext } from 'react'
import { Link} from 'react-router-dom'

// import UserContext from './UserContext'


import { Component, useState } from 'react'

import  Mine  from './Mine'

import { TabBar, NavBar, WhiteSpace, Icon} from 'antd-mobile';
import {Button} from 'antd'





export default function Home() {

  let [selectedTab, setSelectedTab] = useState('myTab') //记录按钮点击状态


  return (




      <div style={{ position: 'fixed', width: '100%', top: 45 , bottom: 0}}>
        <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
          >

            <TabBar.Item
              title="新建"
              key="newVote"
              icon={<div style={{
                width: '22px',
                height: '22px',
                background: 'url(./icon/new1.svg) center center /  21px 21px no-repeat' }}
              />
              }
              selectedIcon={<div style={{
                width: '22px',
                height: '22px',
                background: 'url(./icon/new.svg) center center /  21px 21px no-repeat' }}
              />
              }
              selected={selectedTab === 'newTab'}
              // badge={1}
              onPress={() => {
                setSelectedTab('newTab');
              }}
              data-seed="logId"
            >
              <div >
                <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
                  <div style={{height: '200px',
                    width: '100%',
                    display: 'flex', flexFlow: 'column',
                    alignItems: 'center',
                    // justifyContent: 'space-around',
                    backgroundColor: '#fefefe'
                  }}
                  >
                    <img src='./icon/danxuan.png' height='100' style={{margin: '20px'}}/>
                    <Button type="primary" block style={{width: '80%'}}>
                      <Link to="/create">创建单选</Link>
                    </Button>
                  </div>
                  <WhiteSpace/>
                  <div style={{height: '200px',
                    width: '100%',display: 'flex', flexFlow: 'column',
                    alignItems: 'center',
                    // justifyContent: 'space-around',
                    backgroundColor: '#fefefe'
                  }}
                  >

                    <img src='./icon/duoxuan.png' height='100' style={{margin: '20px'}}/>
                    <Button type="primary" block style={{width: '80%'}}>
                      <Link to="/create?multiSelect">创建多选</Link>
                    </Button>
                  </div>

                </div>

              </div>
            </TabBar.Item>

            <TabBar.Item
              icon={{ uri: './icon/my.svg' }}
              selectedIcon={{ uri: './icon/my1.svg' }}
              title="我的"
              key="My"
              selected={selectedTab === 'myTab'}
              onPress={() => {
                setSelectedTab('myTab');
              }}
            >
              <Mine/>
            </TabBar.Item>
          </TabBar>
      </div>



  )
}
