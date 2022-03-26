import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

//효과음
import click from '../sound/Click Sound.mp3';

import { IoMdClose } from 'react-icons/io';
import Slider from '../components/Slider/Slider';
const RuleModal = ({ showModal, setShowModal }) => {
  // const [modal, setModal] = useState(true);
  //클릭 효과음
  const sound = new Audio(click);
  const close = () => {
    setShowModal((prev) => !prev)
    sound.play();
  }

  const modalRef = useRef();

  const closeBtn = (e) => {
    if (modalRef.current === e.target) showModal(false);
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        console.log('I pressed');
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  return (
    <>
      {showModal ? (
        <ModalBg onClick={closeBtn} ref={modalRef}>
          <WrapModal showModal={showModal}>
            <div>
              <Slider />
            </div>
            <CloseModal onClick={close}>
              닫기
            </CloseModal>
          </WrapModal>
        </ModalBg>
      ) : null}
    </>
  );
};

const WrapModal = styled.div`
  width: 65%;
  height: 80%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #212121;
  color: #000;
  display: flex;
  /* grid-template-columns: 1fr 1fr; */
  position: relative;
  z-index: 10;
  text-align: center;
  justify-content: center;
  align-items: center;
  @media (max-width: 600) {
    width: 50rem;
  }
`;

const ModalBg = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseModal = styled.button`
  cursor: pointer;
  border: none;
  position: absolute;
  background-color: #9296fd;
  top: 30px;
  right: 60px;
  width: 9%;
  min-width: 60px;
  height: 48px;
  border-radius: 30px;
  box-shadow: 3px 3px 3px #bbbbbbbb;
  font-family: 'yg-jalnan';
  color: #dddddd;
  font-size: 1.2rem;
  padding: 0;
  z-index: 10;
`;

export default RuleModal;
