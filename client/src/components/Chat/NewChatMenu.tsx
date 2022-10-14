import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { convertURL } from 'utils/convertURL';
import { NewChatMenuProps } from 'views/chat';
import { FaUserCircle } from 'react-icons/fa';

import styles from 'styles/components/Chat/NewChatMenu.module.scss';
import { AiFillCloseCircle } from 'react-icons/ai';
import { socket, WebSocketAPI } from 'api/WebSocketAPI';

export default function NewChatMenu({
  setSelectedRoom,
  setIsNewChatMenu,
}: NewChatMenuProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const families = useSelector((state: RootState) => state.user.families);

  const renderCards = families.map((family) => {
    const onNewMessageClicked = () => {
      WebSocketAPI.joinRoom({
        userId: user._id,
        participantId: family.userId,
      });

      socket.on('join', (chatId) => {
        setSelectedRoom(chatId);
        setIsNewChatMenu(false);
      });
    };

    return (
      <li className={styles.familyCard} key={family.userId}>
        {family.profile ? (
          <img src={convertURL(family.profile)} alt="사용자 프로필" />
        ) : (
          <FaUserCircle />
        )}
        <div className={styles.info}>
          <h2>{family.relationship ? family.relationship : '관계없음'}</h2>
          <h3>{family.name}</h3>
        </div>
        <button onClick={onNewMessageClicked}>메세지</button>
      </li>
    );
  });

  return (
    <div className={styles.container} onClick={() => setIsNewChatMenu(false)}>
      <div className={styles.NewChatMenu} onClick={(e) => e.stopPropagation()}>
        <h1>새로운 메세지</h1>
        <AiFillCloseCircle onClick={() => setIsNewChatMenu(false)} />
        <ul className={styles.familyList}>{renderCards}</ul>
      </div>
    </div>
  );
}
