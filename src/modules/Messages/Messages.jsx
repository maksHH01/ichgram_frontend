import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./Messages.module.css";

// --- УТИЛИТЫ ВРЕМЕНИ ---
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Active now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const formatChatSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}, ${timeStr}`;
};

const shouldShowDate = (currentMsg, prevMsg) => {
  if (!prevMsg) return true;
  const d1 = new Date(currentMsg.timestamp);
  const d2 = new Date(prevMsg.timestamp);
  const isDifferentDay = d1.toDateString() !== d2.toDateString();
  const isLongGap = d1 - d2 > 1000 * 60 * 30;
  return isDifferentDay || isLongGap;
};

const getAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return "/no-profile-pic-icon-11.jpg";
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${BACKEND_URL}${avatarUrl}`;
};

const Messages = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const myAvatarSrc = getAvatarSrc(currentUser?.avatarUrl);

  const [, setTimeTick] = useState(() => Date.now());

  // 1. STATE: Список чатов теперь содержит и историю сообщений (messages)
  const [chats, setChats] = useState(() => [
    {
      id: 1,
      name: "Alex",
      avatar: "/moc/alex.jpg",
      lastMessage: "Hello! How are you?",
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 часа назад
      messages: [
        {
          id: 101,
          text: "Hi Alex!",
          sender: "me",
          timestamp: Date.now() - 1000 * 60 * 60 * 25, // Вчера
        },
        {
          id: 102,
          text: "Hello! How are you?",
          sender: "them",
          timestamp: Date.now() - 1000 * 60 * 60 * 2, // Сегодня
        },
      ],
    },
    {
      id: 2,
      name: "John",
      avatar: "/moc/john.jpg",
      lastMessage: "See you!",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 дня назад
      messages: [
        {
          id: 201,
          text: "Bro, are you coming?",
          sender: "them",
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
        },
        {
          id: 202,
          text: "See you!",
          sender: "me",
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 5000,
        },
      ],
    },
    // Можно добавить сколько угодно людей...
  ]);

  // 2. STATE: ID активного чата (по умолчанию 1 - Alex)
  const [activeChatId, setActiveChatId] = useState(1);

  // Вычисляемое значение: находим объект текущего чата
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Берем сообщения ИЗ активного чата, а не из отдельного стейта
  const currentMessages = activeChat.messages || [];

  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  // Скроллим вниз при смене чата или добавлении сообщения
  useEffect(() => {
    scrollToBottom();
  }, [activeChatId, currentMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 3. СМЕНА ЧАТА
  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    setInputValue(""); // Очищаем поле ввода при смене юзера
    // На мобилке здесь можно закрывать список чатов, если нужно
  };

  // 4. ОТПРАВКА СООБЩЕНИЯ
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const now = Date.now();
    const newMsgText = inputValue.trim();

    const newMessage = {
      id: now,
      text: newMsgText,
      sender: "me",
      timestamp: now,
    };

    setInputValue("");

    // Обновляем общий стейт чатов
    setChats((prevChats) => {
      // Создаем новый массив
      const updatedChats = prevChats.map((chat) => {
        // Находим нужный чат по ID
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage], // Добавляем сообщение в историю ЭТОГО чата
            lastMessage: `You: ${newMsgText}`, // Обновляем превью
            timestamp: now, // Обновляем время
          };
        }
        return chat;
      });

      // Сортировка: чат с новым сообщением прыгает вверх
      return updatedChats.sort((a, b) => b.timestamp - a.timestamp);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  return (
    <div className={styles.messagesPage}>
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>
          {currentUser?.username || "Messages"}
        </div>

        {chats.map((chat) => (
          <div
            key={chat.id}
            // Добавляем класс active, если ID совпадает
            className={`${styles.chatItem} ${
              chat.id === activeChatId ? styles.active : ""
            }`}
            // ВЕШАЕМ ОБРАБОТЧИК КЛИКА
            onClick={() => handleChatSelect(chat.id)}
          >
            <img
              className={styles.avatarSm}
              src={chat.avatar}
              alt={chat.name}
            />
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>{chat.name}</div>
              <div className={styles.chatLast}>
                {chat.lastMessage.includes("Active now") ? (
                  "Active now"
                ) : (
                  <span>
                    {chat.lastMessage} • {formatTimeAgo(chat.timestamp)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <section className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <img
            className={styles.headerAvatar}
            src={activeChat.avatar}
            alt={activeChat.name}
          />
          <div className={styles.headerTitle}>{activeChat.name}</div>
        </div>

        <div className={styles.chatMessages} ref={chatContainerRef}>
          <div className={styles.userHero}>
            <img
              className={styles.heroAvatar}
              src={activeChat.avatar}
              alt={activeChat.name}
            />
            <div className={styles.heroName}>{activeChat.name}</div>
            <div className={styles.heroSub}>
              {activeChat.name.toLowerCase()} • ICHgram
            </div>
            <button className={styles.viewProfile}>View Profile</button>
          </div>

          {/* Рендерим currentMessages, которые мы достали из активного чата */}
          {currentMessages.map((msg, index) => {
            const isMe = msg.sender === "me";
            const prevMsg = currentMessages[index - 1];

            const showDate = shouldShowDate(msg, prevMsg);

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className={styles.chatDate}>
                    {formatChatSeparator(msg.timestamp)}
                  </div>
                )}

                <div
                  className={`${styles.row} ${
                    isMe ? styles.rightRow : styles.leftRow
                  }`}
                >
                  {!isMe && (
                    <img
                      className={styles.msgAvatar}
                      src={activeChat.avatar}
                      alt="Partner"
                    />
                  )}
                  <div
                    className={`${styles.message} ${
                      isMe ? styles.right : styles.left
                    }`}
                  >
                    {msg.text}
                  </div>
                  {isMe && (
                    <img
                      className={styles.msgAvatar}
                      src={myAvatarSrc}
                      alt="Me"
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="Write a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </section>
    </div>
  );
};

export default Messages;
