import axios from 'axios'
import { applyMiddleware, createStore } from 'redux'
import  createSagaMiddleWare  from 'redux-saga'
import { put,  takeEvery, takeLatest } from 'redux-saga/effects'

const saga = createSagaMiddleWare()

const initialState = {
  user: null,
  votes: {}
}



const store = createStore((state = initialState, action) => {
  switch(action.type) {
    case 'user-info':
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }


}, applyMiddleware(saga))

function * getUserInfo(action) {
  try {
    var res = yield axios.get('/account/userinfo')
    yield put({type: 'user-info',user: res.data})
  } catch(e) {
    console.log(e)
  }
}

function * login(action) {
  var res = yield axios.get('/account/login', {
    name: action.name,
    password: action.password,
  })
}

function * rootSaga() {
  yield takeEvery('get-user-info', getUserInfo)
  yield takeEvery('login', login)
}

export default store
saga.run(rootSaga)