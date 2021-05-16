const { sequelize, User, Vote, Option} = require('./db')
const express = require('express')
const { io } = require('./servers')//socket.io的server对象

const voteRouter = express.Router()
module.exports = voteRouter

io.on('connection', socket => {//socket.io连接对象
  console.log('some comes')
  socket.on('select root', id => {
    var room = 'vote ' + id
    socket.join(room)
    console.log('加入房间', room)
  })
})

// RESTful
// POST /vote
/**
 * {title,desc,deadline,multiSelect
      anonymous
      restricted,
    options: ['aofijew', 'wjiofwef', 'jfoweif'],
 * }
 */

// GET /vote/get/:id
voteRouter.get('/get/:id', async (req, res, next) => {
  console.log('------------------------')
  var vote = await Vote.findByPk(req.params.id)
  if (!vote) {
    res.status(404).json({ code: -1, msg: '不存在这个投票' })
  } else {
    res.json({
      vote: vote.toJSON(),
      options: await Option.findAll({
        where: { VoteId: req.params.id },
        include: [{
          model: User,
          attributes: ['name', 'gender', 'avatar', 'id'],
        }]
      })
    })
  }
  res.end()
})

// 判断登陆状态，未登陆不允许执行后续操作
voteRouter.use(async (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(401).json({
      code: -1,
      msg: '未登陆'
    })
  }
})

voteRouter.post('/create', async (req, res, next) => {
  var { options, ...body } = req.body

  try {
    var vote = await Vote.create(body)
    vote.setUser(req.user)//当前登陆用户

    var ary = await Promise.all(options.map(str => {
      return Option.create({
        content: str,
      })
    }))

    vote.addOptions(ary)
    res.json(vote.toJSON())
  } catch (e) {
    res.status(400).json(e.toString())
  }
})



// 向某个选项投票
// post /vote/voteup/5
voteRouter.post('/voteup/:optionId', async (req, res, next) => {

  var option = await Option.findByPk(req.params.optionId, { include: Vote })
  // console.log(option)
  if (!option || option.Vote.deadline.getTime() < Date.now()) {
    // console.log('lookkkkkk')
    res.status(404).json({
      code: -1,
      msg: '选项不存在或投票已过期'
    }).end()
  } else {
    if (!option.Vote.multiSelect) { //单选
      let thisVoteOptions = await Option.findAll({
        where: { VoteId: option.Vote.id }
      })
      await req.user.removeOptions(thisVoteOptions)
    }
    await req.user.addOption(option)
    //每个选项及为其投票的观众[]
    let info = await Option.findAll({
      where: { VoteId: option.VoteId },
      include: [{
        model: User,
        attributes: ['name', 'gender', 'avatar', 'id'],
      }]
    })
    // 还有给所有在这个房间的连接广播这个投票的最新状态
    io.to('vote ' + option.VoteId).emit('voting info', info)
    res.end()
  }

})

// post /vote/cancel/5
// 取消对某个选项的投票
voteRouter.post('/cancel/:optionId', async (req, res, next) => {
  var option = await Option.findByPk(req.params.optionId, {include: Vote})
  if (!option || option.Vote.deadline.getTime() < Date.now()) {
    res.status(404).end({
      code: -1,
      msg: '选项不存在或投票已过期'
    })
  } else {
    await option.removeUser(req.user) //取消该用户的投票
    //每个选项及为其投票的观众
    let info = await Option.findAll({
      where: { VoteId: option.VoteId },
      include: [{
        model: User,
        attributes: ['name', 'gender', 'avatar', 'id'],
      }]
    })
    // 还有给所有在这个房间的连接广播这个投票的最新状态
    io.to('vote ' + option.VoteId).emit('voting info', info)
    res.end()
  }
})

// PUT /vote/5
voteRouter.put('/create', async (req, res, next) => {

})

// DELETE /vote/5
voteRouter.delete('/create', async (req, res, next) => {

})

// GET /vote/myvotes?startIndex=5&stopIndex=20
voteRouter.get('/myvotes', async (req, res, next) => {
  var result = await Vote.findAndCountAll({
    // limit: req.query.stopIndex - req.query.startIndex || 1,//选出的数量
    offset: req.query.startIndex,//从第几个开始
    where: {
      UserId: req.user.id
    }
  })
  console.log(result)
  res.json(result)// count rows

})


// ======================================================================


voteRouter.get('/:id', async(req, res) => {
  let vote = await Vote.findByPk(req.params.id)
  res.json({
    vote: vote.toJSON(),
    options: await Option.findAll({
      where: { VoteId: option.VoteId},
      include: [User]
    })
  })
})
