


import { useHistory } from 'react-router-dom'

import {  useQuery} from './hooks'
import axios from 'axios'

import { Form, Input, Button,  DatePicker, Switch, Divider , Row, Col} from 'antd'
import { PlusOutlined, MinusCircleOutlined,PlusCircleOutlined  } from '@ant-design/icons'
import moment from 'moment'




export default function CreateVote() {

  let query = useQuery()
  let history = useHistory()

  async function createVote(voteInfo) {
    try {
      console.log(voteInfo)
      let vote = (await axios.post('/vote/create', {
        ...voteInfo,
        multiSelect: query.has('multiSelect'),
      })).data
      console.log(vote)

      history.push('/vote/' + vote.id)
    } catch(e) {
      alert(e)
    }
  }


  return (
    <Form name="basic" initialValues={{ remember: true }} onFinish={createVote}
      labelCol={{ span: 4,}}
      wrapperCol={{ span: 14,}}>
      <Form.Item name="title" rules={[{ required: true, message: '标题' }]}
        style={{margin: 0}} >
        <Input placeholder="投票标题" style={{ fontSize: '22px' }} bordered={false}/>
      </Form.Item>
      <Divider style={{margin: '2px 0 18px 0'}}/>
      <Form.Item name="desc" rules={[{ required: false, message: '描述' }]}
        style={{ margin: 0 }}>
        <Input placeholder="补充描述(选填)" style={{ fontSize: '16px' }} bordered={false}/>
      </Form.Item>
      <Divider style={{margin: '2px 0 18px 0'}}/>

      <Form.List
        name="options"
        initialValue={['', '']}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
          {fields.map((field, index) => (
              <Row justify="space-around">
                <Col span={1}></Col>
                <Col span={1}>
                  <Form.Item key={field.key}
                    style={{marginBottom: '0'}}>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                    {' '}
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={21}>
                  <Form.Item {...field} style={{marginBottom: 0}} >
                    <Input
                      placeholder="选项"
                      style={{ width: '90%', padding: 0, }}
                      bordered={false}
                      />
                  </Form.Item>
                </Col>
                <Divider style={{margin: '3px'}}/>
              </Row>
            ))}
            <Row justify="space-around">
              <Col span={1}></Col>
              <Col span={1}>
                <Form.Item>
                  <PlusCircleOutlined style={{ color:'red' }}/>
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={21}>
                <Form.Item>
                  <Button type="link" onClick={() => add()} style={{ padding: 0, width: '90%', textAlign: 'left',color:'#1890ff'}} >
                    增加选项
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form.List>

      <Divider style={{margin: '6px'}}/>
      <Row justify="space-around" align="middle">
        <Col span="4">截至时间</Col>
        <Col span="1"></Col>
        <Col span="1"></Col>
        <Col span="10">
          <Form.Item name="deadline" initialValue={moment().add(1, 'days')} style={{margin: 0}}>
            <DatePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm'}} />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{margin: '3px'}}/>
      <Row  justify="space-around" align="middle">
        <Col span="4">匿名投票</Col>
        <Col span="4"></Col>
        <Col span="4"></Col>
        <Col span="4" >
          <Form.Item name="anonymous" style={{margin: 0}}>
            <Switch  />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{margin: '6px'}}/>
      <Row  justify="space-around" align="middle">
        <Col span="4">限制传播</Col>
        <Col span="4"></Col>
        <Col span="4"></Col>
        <Col span="4" lg={{ span: 6, offset: 2 }}>
          <Form.Item name="restricted" style={{margin: 0}}>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{margin: '6px'}}/>
      <Form.Item >
        <Button type="primary" htmlType="submit" block>
          完成
        </Button>
      </Form.Item>

    </Form>
  )
}
