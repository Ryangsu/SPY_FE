import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { actionCreators as voteActions } from '../redux/modules/vote';

// 이미지
import VoteBG from '../images/VoteBG.png';
import BasicProfile from '../images/BasicProfile.png';
import BasicProfile_Death from '../images/BasicProfile_Death.png';
import Ai from '../images/Ai.png';

// 변호사 모달
const LawyerVoteModal = (props) => {
  const { isMe, roomId, _handleModal, showing, children, ...rest } = props;
  console.log(props);
  const dispatch = useDispatch();
  const round = useSelector((state) => state.room.round);
  console.log(round);
  const user_list = useSelector((state) => state.vote.userList);
  const Alive = user_list.filter((user) => user.isEliminated === 'N');

  const [voteBtnClicked, setVoteBtnClicked] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [chosenId, setChosenId] = useState(0);
  const [chosenRoomId, setChosenRoomId] = useState(0);
  const ref = useRef();

  const clicked = (idx) => {
    setVoteBtnClicked(idx);
    console.log(idx);
    const chosen = user_list[idx];
    setChosenId(chosen.user.id);
    setChosenRoomId(chosen.roomId);
    console.log(chosen);
    console.log(chosen.user.id, '유저 아이디');
    console.log(chosen.roomId, '룸 아이디');
    console.log(chosen.user, '제발');
  };

  const submitClicked = () => {
    if (voteBtnClicked !== null) {
      dispatch(voteActions.lawyerActDB(chosenRoomId, chosenId));
      dispatch(voteActions.lawyerNullVote(false));
      setSubmit(true);
    } else {
      window.alert('해고 당할거 같은 직원을 선택해주세요 :)');
    }
    console.log(chosenId);
    console.log(chosenRoomId);
  };

  console.log(submit);
  return createPortal(
    <Container>
      <Background onClick={_handleModal} />
      <ModalBlock {...rest} src={VoteBG}>
        <Title>변호사 투표</Title>
        <Contents>
          해고 당할 거 같은 직원에게 투표하세요.
          <br />
          <br />단 투표를 안하게 되면 무효표 처리 되어 랜덤 선택 됩니다.
        </Contents>

        {/* 롤을 부여받은대로 보여줘야함 */}
        {(() => {
          if (user_list.length <= 6) {
            return (
              <SixVotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <Wrapper>
                        <JobCheckImg
                          disabled={submit}
                          src={
                            p.isEliminated.includes('N')
                              ? BasicProfile
                              : BasicProfile_Death
                          }
                          pointer={p.isEliminated.includes('Y') || submit}
                          ref={ref}
                          key={p.id}
                          opacity={idx === voteBtnClicked ? '30%' : '100%'}
                          onClick={() => clicked(idx)}
                        ></JobCheckImg>
                        <Nickname>{p.nickname}</Nickname>
                      </Wrapper>
                    );
                  })}
              </SixVotePlayerWrap>
            );
          } else if (user_list.length <= 8) {
            return (
              <EightVotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <Wrapper>
                        <JobCheckImg
                          disabled={submit}
                          src={
                            p.isEliminated.includes('N')
                              ? BasicProfile
                              : BasicProfile_Death
                          }
                          pointer={p.isEliminated.includes('Y') || submit}
                          ref={ref}
                          key={p.id}
                          opacity={idx === voteBtnClicked ? '30%' : '100%'}
                          onClick={() => clicked(idx)}
                        ></JobCheckImg>
                        <Nickname>{p.nickname}</Nickname>
                      </Wrapper>
                    );
                  })}
              </EightVotePlayerWrap>
            );
          } else if (user_list.length <= 10) {
            return (
              <TenVotePlayerWrap>
                {user_list &&
                  user_list.map((p, idx) => {
                    return (
                      <Wrapper>
                        <JobCheckImg
                          disabled={submit}
                          src={
                            p.isEliminated.includes('N')
                              ? BasicProfile
                              : BasicProfile_Death
                          }
                          pointer={p.isEliminated.includes('Y') || submit}
                          ref={ref}
                          key={p.id}
                          opacity={idx === voteBtnClicked ? '30%' : '100%'}
                          onClick={() => clicked(idx)}
                        ></JobCheckImg>
                        <Nickname>{p.nickname}</Nickname>
                      </Wrapper>
                    );
                  })}
              </TenVotePlayerWrap>
            );
          }
        })()}

        {/* 소켓으로 현재 뭐 눌렀는지 통신 & 누르면 비활성화 시키기*/}
        <SendBtn disabled={submit} onClick={submitClicked}>
          선택 완료
        </SendBtn>
      </ModalBlock>
    </Container>,
    document.getElementById('LawyerVoteModal')
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  animation: modal-bg-show 1s;
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBlock = styled.div`
  position: absolute;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 10rem;
  align-items: center;
  padding: 3rem;
  background: url('${(props) => props.src}') no-repeat center/cover;
  width: 60rem;
  height: 40rem;
  max-width: 100rem;
  animation: modal-show 1s;
  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 10rem;
    }
  }
`;
const SixVotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 30px 30px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
`;
const EightVotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 30px 30px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
`;
const TenVotePlayerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 30px 30px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 1rem;
  font-size: 4rem;

  @media screen and (max-width: 1040px) {
    font-size: 4rem;
  }
`;

const Contents = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  margin: 1rem;
  font-size: 2rem;

  @media screen and (max-width: 1040px) {
    font-size: 1.25rem;
  }
`;

const Nickname = styled.div`
  color: white;
  font-family: 'yg-jalnan';
  width: auto;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
  @media screen and (max-width: 1040px) {
    font-size: 0.75rem;
  }
`;

const JobCheckImg = styled.div`
  display: flex;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  pointer-events: ${(props) => (+props.pointer ? 'none' : null)};
  background: url('${(props) => props.src}') no-repeat center/contain;
  margin: auto;
  cursor: pointer;
  opacity: ${(props) => props.opacity};
  @media screen and (max-width: 1040px) {
    width: 120px;
    height: 120px;
  }
`;

const SendBtn = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 1.5rem;
  background-color: #9296fd;
  margin-top: 2px;
  font-size: 1rem;
  font-family: 'yg-jalnan';
  color: #fff;
  cursor: pointer;
  :disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export default LawyerVoteModal;
