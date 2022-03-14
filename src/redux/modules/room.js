import { createAction, handleActions } from 'redux-actions';
import { immerable, produce } from 'immer';

import axios from 'axios';
import { apis } from '../../shared/apis';

// post
const SET_ROOM = 'SET_ROOM';

const PRIVATE_ROOM = 'PRIVATE_ROOM';
const PRIVATE_STATE = 'PRIVATE_STATE';
//병우추가
const ADD_ROOM = 'ADD_ROOM';

// const ADD_POST = 'ADD_POST';
// const EDIT_POST = 'EDIT_POST';
const ENTER_USER = 'ENTER_USER';
const LEAVE_USER = 'LEAVE_USER';

//병우추가
const addRoom = createAction(ADD_ROOM, (room) => ({ room }));
const setRoom = createAction(SET_ROOM, (room_list) => ({ room_list }));
const enterUser = createAction(ENTER_USER, (enter_room) => ({ enter_room }));
const leaveUser = createAction(LEAVE_USER, (leave_room) => ({ leave_room }));
// const addPost = createAction(ADD_POST, (post) => ({ post }));
// const editPost = createAction(EDIT_POST, (post_id, post) => ({
//   post_id,
//   post,
// }));
const privateRoom = createAction(PRIVATE_ROOM, (roomId, privateState) => ({
  roomId,
  privateState,
}));
const privateState = createAction(PRIVATE_STATE, (privateState) => ({
  privateState,
}));

const initialState = {
  list: [],
  post: [],
  comments: [],
  room: [], // 병우추가
  roomState: {
    roomId: null,
    privateState: false,
  },
};

const initialPost = {
  postId: 'aalasdf',
  title: '아이폰 10',
  content: '아이폰 팔아요',
  price: 1000,
  imgurl: 'http://gi.esmplus.com/dodomae/NAR/Monami/pluspen3000.jpg',
  createdAt: '2022-02-22',
  updatedAt: '2022-02-25',
  nickname: 'fasdfasdf',
  userId: 'id',
  isSold: false,
};

//middleware

//전체 방 조회
const getRoomAPI = () => {
  return async function (dispatch, useState, { history }) {
    await apis.lobby().then(function (res) {
      console.log(res);
      dispatch(setRoom(res.data.rooms));
    });
  };
};
//방들어가기
const enterRoomDB = (userId, roomId, roomPwd) => {
  console.log(roomId);
  return async function (dispatch, getState, { history }) {
    await axios
      .put(`http://mafia.milagros.shop/api/enter/${roomId}/user/${userId}`, {
        roomPwd: null,
      })
      .then((res) => {
        console.log(res);
        history.replace(`/room/${roomId}`);
      })
      .catch((error) => {
        window.alert(error.response.data.msg);
        console.log(error.response.data.msg);
        window.location.reload();
      });
  };
};
//방 나가기
const leaveRoomDB = (nickname, roomId) => {
  return function (dispatch, getState, { history }) {
    axios
      .patch(`http://mafia.milagros.shop/api/out/${roomId}/user/${nickname}`, {
        nickname: nickname,
        roomId: roomId,
      })
      .then((response) => {
        dispatch(leaveUser(response.data.user));
        // dispatch(liveUser(response.data.user));
        console.log(response);
        window.location.replace('/');
      })
      .catch((error) => {
        window.alert(error);
        console.log(error.response.data.msg);
      });
  };
};
//병우 추가
const createRoomDB = (roomName, maxPlayer, roomPwd = null, userId) => {
  return function (dispatch, getState, { history }) {
    axios
      .post(`http://mafia.milagros.shop/api/room/user/${userId}`, {
        roomName,
        maxPlayer,
        roomPwd,
      })
      .then((response) => {
        console.log(response);
        const roomId = response.data.room.id;
        history.push(`/room/${roomId}`);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
        window.alert(error.msg);
      });
  };
};
// 방 들어갈 때 패스워드 확인하기
const roomPwCheckAPI = (userId, roomId, pwd) => {
  console.log(userId);
  console.log(parseInt(pwd));
  console.log(roomId);
  return async function (dispatch, useState, { history }) {
    console.log(pwd);
    await axios
      .put(`http://mafia.milagros.shop/api/enter/${roomId}/user/${userId}`, {
        roomPwd: pwd,
      })
      .then((res) => {
        console.log(res);
        history.replace(`/room/${roomId}`);
      })
      .catch((error) => {
        window.alert(error.response.data.msg);
      });
  };
};
// 유저 방에서 레디하기
const doReadyAPI = (userId, roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .ready(userId, roomId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
      });
  };
};
// 유저 방 레디 취소하기
const cancelReadyAPI = (userId, roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .cancelReady(userId, roomId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error.response.data.msg);
      });
  };
};
//방 시작하기
const doStartAPI = (userId, roomId) => {
  return async function (dispatch, useState, { history }) {
    await apis
      .start(userId, roomId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        const result = window.confirm(error.response.data.msg);
        if (result) {
          //시작하기
        } else {
          const secondResult = window.confirm('인원 수 줄여서 시작하냐?');
          if (secondResult) {
            //시작
          } else {
            //대기방으로
          }
        }
      });
  };
};

export default handleActions(
  {
    [SET_ROOM]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.room_list;
        console.log(draft.list);
        console.log(action.payload);
      }),
    // [ONE_POST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.post = action.payload.post;
    //     draft.post.comments = action.payload.comments;
    //   }),
    // [ADD_POST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.list.unshift(action.payload.post);
    //   }),
    // [EDIT_POST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.list = action.payload;
    //   }),

    //병우추가
    // [ADD_ROOM]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.room = action.payload.game_room;
    //     // console.log(action, '넘어오니?');
    //     console.log(draft.list);
    //   }),
    [PRIVATE_ROOM]: (state, action) =>
      produce(state, (draft) => {
        draft.roomState.roomId = action.payload.roomId;
        draft.roomState.privateState = action.payload.privateState;
      }),
    [PRIVATE_STATE]: (state, action) =>
      produce(state, (draft) => {
        draft.roomState.privateState = action.payload.privateState;
      }),
  },
  initialState
);

const actionCreators = {
  getRoomAPI,
  enterRoomDB,
  leaveRoomDB,
  createRoomDB,
  privateRoom,
  privateState,
  roomPwCheckAPI,
  doReadyAPI,
  doStartAPI,
  cancelReadyAPI,
};

export { actionCreators };
