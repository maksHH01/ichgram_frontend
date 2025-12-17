import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Messages.module.css";

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
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

  if (avatarUrl.startsWith("/moc/")) {
    return avatarUrl;
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${BACKEND_URL}${avatarUrl}`;
};

const MOCK_USERS_DATA = [
  {
    _id: "alex_id",
    username: "Alex",
    fullname: "Alex Mock",
    avatarUrl: "/moc/alex.jpg",
    isMock: true,
    initialMessages: [
      {
        id: "alex_msg_1",
        text: "Hi! I am Alex. How are you?",
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
        sender: {
          _id: "alex_id",
          username: "Alex",
          avatarUrl: "/moc/alex.jpg",
        },
        receiver: {
          _id: "USER_PLACEHOLDER",
        },
      },
    ],
  },
  {
    _id: "john_id",
    username: "John",
    fullname: "John Mock",
    avatarUrl: "/moc/john.jpg",
    isMock: true,
    initialMessages: [
      {
        id: "john_msg_1",
        text: "Bro, see you at the gym?",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        sender: {
          _id: "john_id",
          username: "John",
          avatarUrl: "/moc/john.jpg",
        },
        receiver: {
          _id: "USER_PLACEHOLDER",
        },
      },
    ],
  },
];

const Messages = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const myAvatarSrc = getAvatarSrc(currentUser?.avatarUrl);

  const location = useLocation();
  const navigate = useNavigate();

  const [, setTimeTick] = useState(() => Date.now());

  const [globalMessages, setGlobalMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("ichgram_global_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "ichgram_global_messages",
      JSON.stringify(globalMessages)
    );
  }, [globalMessages]);

  const [tempChatPartner, setTempChatPartner] = useState(null);

  const myChats = useMemo(() => {
    if (!currentUser) return [];

    const chatsMap = new Map();
    const myId = currentUser._id;

    MOCK_USERS_DATA.forEach((mockUser) => {
      if (mockUser._id === myId) return;

      const formattedInitialMessages = mockUser.initialMessages.map((m) => ({
        ...m,
        receiver: { _id: myId },
      }));

      const lastMsg =
        formattedInitialMessages[formattedInitialMessages.length - 1];

      chatsMap.set(mockUser._id, {
        partnerId: mockUser._id,
        partner: {
          _id: mockUser._id,
          username: mockUser.username,
          fullname: mockUser.fullname,
          avatarUrl: mockUser.avatarUrl,
          isMock: true,
        },
        lastMessageObj: lastMsg,
        lastMessage: lastMsg.text,
        timestamp: lastMsg.createdAt,
        messages: formattedInitialMessages,
      });
    });

    globalMessages.forEach((msg) => {
      const senderId = msg.sender._id;
      const receiverId = msg.receiver._id;

      const isInvolved = senderId === myId || receiverId === myId;
      if (!isInvolved) return;

      if (senderId === receiverId) return;

      const partner = senderId === myId ? msg.receiver : msg.sender;
      const chatId = partner._id;

      if (!chatsMap.has(chatId)) {
        chatsMap.set(chatId, {
          partnerId: partner._id,
          partner: partner,
          lastMessageObj: msg,
          timestamp: msg.createdAt,
          messages: [],
        });
      }

      const chatGroup = chatsMap.get(chatId);
      chatGroup.messages.push(msg);

      if (msg.createdAt > chatGroup.lastMessageObj.createdAt) {
        chatGroup.lastMessageObj = msg;
        chatGroup.lastMessage = msg.text;
        chatGroup.timestamp = msg.createdAt;
      }
    });

    let chatsList = Array.from(chatsMap.values()).map((group) => ({
      ...group,
      messages: group.messages.sort((a, b) => a.createdAt - b.createdAt),
    }));

    if (
      tempChatPartner &&
      !chatsList.find((c) => c.partnerId === tempChatPartner._id)
    ) {
      const newChat = {
        partnerId: tempChatPartner._id,
        partner: tempChatPartner,
        lastMessage: "",
        timestamp: tempChatPartner.timestamp,
        messages: [],
      };
      chatsList = [newChat, ...chatsList];
    }

    return chatsList.sort((a, b) => b.timestamp - a.timestamp);
  }, [globalMessages, currentUser, tempChatPartner]);

  const [activePartnerId, setActivePartnerId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivePartnerId(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [currentUser?._id]);

  const activeChat = useMemo(() => {
    return myChats.find((c) => c.partnerId === activePartnerId) || null;
  }, [myChats, activePartnerId]);

  const currentMessages = useMemo(() => {
    return activeChat?.messages || [];
  }, [activeChat]);

  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const targetUser = location.state?.startChatWith;
    if (targetUser && currentUser) {
      if (targetUser.id === currentUser._id) {
        navigate(location.pathname, { replace: true });
        return;
      }

      const timer = setTimeout(() => {
        setActivePartnerId(targetUser.id);

        const chatExists = myChats.some((c) => c.partnerId === targetUser.id);

        if (!chatExists) {
          setTempChatPartner({
            _id: targetUser.id,
            username: targetUser.username,
            avatarUrl: targetUser.avatarUrl,
            fullname: targetUser.fullname,
            timestamp: Date.now(),
          });
        }
        navigate(location.pathname, { replace: true, state: {} });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [location.state, currentUser, myChats, navigate, location.pathname]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [activePartnerId, currentMessages.length]);

  useEffect(() => {
    const interval = setInterval(() => setTimeTick(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChatSelect = (chatId) => {
    setActivePartnerId(chatId);
    setInputValue("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUser || !activeChat) return;

    const now = Date.now();
    const newMsgText = inputValue.trim();

    const newMessage = {
      id: now.toString() + Math.random(),
      text: newMsgText,
      createdAt: now,
      sender: {
        _id: currentUser._id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        fullname: currentUser.fullname,
      },
      receiver: {
        _id: activeChat.partner._id,
        username: activeChat.partner.username,
        avatarUrl: activeChat.partner.avatarUrl,
        fullname: activeChat.partner.fullname,
      },
    };

    setGlobalMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    if (tempChatPartner && tempChatPartner._id === activeChat.partner._id) {
      setTempChatPartner(null);
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (!window.confirm("Delete this message?")) return;
    setGlobalMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleViewProfile = () => {
    if (activeChat?.partner?.isMock) return;
    if (activeChat?.partner?.username) {
      navigate(`/users/${activeChat.partner.username}`);
    }
  };

  const handleAvatarClick = (username) => {
    if (activeChat?.partner?.isMock) return;
    if (username) navigate(`/users/${username}`);
  };

  if (!currentUser) return null;

  return (
    <div className={styles.messagesPage}>
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>{currentUser.username}</div>

        {myChats.map((chat) => (
          <div
            key={chat.partnerId}
            className={`${styles.chatItem} ${
              activeChat?.partnerId === chat.partnerId ? styles.active : ""
            }`}
            onClick={() => handleChatSelect(chat.partnerId)}
          >
            <img
              className={styles.avatarSm}
              src={getAvatarSrc(chat.partner.avatarUrl)}
              alt={chat.partner.username}
            />
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>{chat.partner.username}</div>
              <div className={styles.chatLast}>
                {chat.messages.length > 0 ? (
                  <span>
                    {chat.messages[chat.messages.length - 1].sender._id ===
                      currentUser._id && "You: "}
                    {chat.lastMessage} • {formatTimeAgo(chat.timestamp)}
                  </span>
                ) : (
                  <span style={{ color: "#aaa", fontStyle: "italic" }}>
                    No messages yet
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.chatWindow}>
        {activeChat ? (
          <>
            <div className={styles.chatHeader}>
              <img
                className={styles.headerAvatar}
                src={getAvatarSrc(activeChat.partner.avatarUrl)}
                alt={activeChat.partner.username}
              />
              <div className={styles.headerTitle}>
                {activeChat.partner.username}
              </div>
            </div>

            <div className={styles.chatMessages} ref={chatContainerRef}>
              <div className={styles.userHero}>
                <img
                  className={styles.heroAvatar}
                  src={getAvatarSrc(activeChat.partner.avatarUrl)}
                  alt={activeChat.partner.username}
                />
                <div className={styles.heroName}>
                  {activeChat.partner.username}
                </div>
                <div className={styles.heroSub}>
                  {activeChat.partner.fullname} • ICHgram
                </div>
                <button
                  className={styles.viewProfile}
                  onClick={handleViewProfile}
                  disabled={activeChat.partner.isMock}
                  style={{
                    cursor: activeChat.partner.isMock
                      ? "not-allowed"
                      : "pointer",
                    opacity: activeChat.partner.isMock ? 0.6 : 1,
                  }}
                  title={
                    activeChat.partner.isMock
                      ? "This is a demo user"
                      : "View Profile"
                  }
                >
                  View Profile
                </button>
              </div>

              {currentMessages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#8e8e8e",
                    marginTop: "20px",
                    fontSize: "14px",
                  }}
                >
                  No messages yet. Start a conversation!
                </div>
              )}

              {currentMessages.map((msg, index) => {
                const isMe = msg.sender._id === currentUser._id;
                const prevMsg = currentMessages[index - 1];
                const showDate = shouldShowDate(msg, prevMsg);

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className={styles.chatDate}>
                        {formatChatSeparator(msg.createdAt)}
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
                          src={getAvatarSrc(msg.sender.avatarUrl)}
                          alt="Partner"
                          onClick={() =>
                            handleAvatarClick(activeChat.partner.username)
                          }
                          style={{
                            cursor: activeChat.partner.isMock
                              ? "default"
                              : "pointer",
                          }}
                        />
                      )}

                      <div className={styles.messageContainer}>
                        {isMe && (
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete"
                          >
                            <img
                              src="/closeBtn.svg"
                              alt="Delete"
                              className={styles.deleteIcon}
                            />
                          </button>
                        )}
                        <div
                          className={`${styles.message} ${
                            isMe ? styles.right : styles.left
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>

                      {isMe && (
                        <img
                          className={styles.msgAvatar}
                          src={myAvatarSrc}
                          alt="Me"
                          onClick={() =>
                            navigate(`/users/${currentUser.username}`)
                          }
                          style={{ cursor: "pointer" }}
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
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              color: "#888",
            }}
          >
            <img
              src="/logo.svg"
              alt="Logo"
              style={{ width: "100px", opacity: 0.5, marginBottom: "20px" }}
            />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Messages;
