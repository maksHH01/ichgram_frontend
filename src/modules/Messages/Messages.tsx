import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Messages.module.css";

interface IPartialUser {
  _id: string;
  username: string;
  avatarUrl?: string;
  fullname?: string;
}

interface IUser extends IPartialUser {}

interface IMessage {
  id: string;
  text: string;
  createdAt: number;
  sender: IPartialUser;
  receiver: IPartialUser;
  isRead: boolean;
}

interface IInitialMessage extends Omit<IMessage, "receiver"> {
  receiver: { _id: string };
}

interface IMockUser {
  _id: string;
  username: string;
  fullname: string;
  avatarUrl: string;
  isMock: true;
  initialMessages: IInitialMessage[];
}

interface IChat {
  partnerId: string;
  partner: IPartialUser & { isMock?: boolean };
  lastMessageObj?: IMessage;
  lastMessage: string;
  timestamp: number;
  messages: IMessage[];
  hasUnread: boolean;
}

interface ITempPartner extends IPartialUser {
  timestamp: number;
}

interface RootState {
  auth: {
    user: IUser | null;
  };
}

interface LocationState {
  startChatWith?: {
    id: string;
    username: string;
    avatarUrl?: string;
    fullname?: string;
  };
}

const MOCK_USERS_DATA: IMockUser[] = [
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
        receiver: { _id: "USER_PLACEHOLDER" },
        isRead: true,
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
        receiver: { _id: "USER_PLACEHOLDER" },
        isRead: true,
      },
    ],
  },
];

const formatTimeAgo = (timestamp?: number | string): string => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const formatChatSeparator = (timestamp: number | string): string => {
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

const shouldShowDate = (currentMsg: IMessage, prevMsg?: IMessage): boolean => {
  if (!prevMsg) return true;
  const d1 = new Date(currentMsg.createdAt);
  const d2 = new Date(prevMsg.createdAt);
  const isDifferentDay = d1.toDateString() !== d2.toDateString();
  const isLongGap = d1.getTime() - d2.getTime() > 1000 * 60 * 30; // 30 минут
  return isDifferentDay || isLongGap;
};

const getAvatarSrc = (avatarUrl?: string): string => {
  if (!avatarUrl) return "/no-profile-pic-icon-11.jpg";
  if (avatarUrl.startsWith("/moc/")) return avatarUrl;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${BACKEND_URL}${avatarUrl}`;
};

const Messages: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const myAvatarSrc = getAvatarSrc(currentUser?.avatarUrl);

  const location = useLocation();
  const navigate = useNavigate();

  const [, setTimeTick] = useState<number>(() => Date.now());

  const [globalMessages, setGlobalMessages] = useState<IMessage[]>(() => {
    try {
      const saved = localStorage.getItem("ichgram_global_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tempChatPartner, setTempChatPartner] = useState<ITempPartner | null>(
    null
  );
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const myChats: IChat[] = useMemo(() => {
    if (!currentUser) return [];

    const chatsMap = new Map<string, IChat>();
    const myId = currentUser._id;

    MOCK_USERS_DATA.forEach((mockUser) => {
      if (mockUser._id === myId) return;

      const formattedInitialMessages: IMessage[] = mockUser.initialMessages.map(
        (m) => ({
          ...m,
          receiver: { _id: myId, username: currentUser.username },
        })
      );

      const lastMsg =
        formattedInitialMessages[formattedInitialMessages.length - 1];

      chatsMap.set(mockUser._id, {
        partnerId: mockUser._id,
        partner: mockUser,
        lastMessageObj: lastMsg,
        lastMessage: lastMsg.text,
        timestamp: lastMsg.createdAt,
        messages: formattedInitialMessages,
        hasUnread: false,
      });
    });

    globalMessages.forEach((msg) => {
      const involved = msg.sender._id === myId || msg.receiver._id === myId;
      if (!involved) return;

      const partner = msg.sender._id === myId ? msg.receiver : msg.sender;
      if (!chatsMap.has(partner._id)) {
        chatsMap.set(partner._id, {
          partnerId: partner._id,
          partner: partner,
          messages: [],
          lastMessage: "",
          timestamp: 0,
          hasUnread: false,
        });
      }

      const chatGroup = chatsMap.get(partner._id)!;
      chatGroup.messages.push(msg);

      if (
        !chatGroup.lastMessageObj ||
        msg.createdAt > chatGroup.lastMessageObj.createdAt
      ) {
        chatGroup.lastMessageObj = msg;
        chatGroup.lastMessage = msg.text;
        chatGroup.timestamp = msg.createdAt;
      }
    });

    let chatsList: IChat[] = Array.from(chatsMap.values()).map((group) => {
      const sortedMsgs = group.messages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      const unreadCount = sortedMsgs.filter(
        (m) => m.receiver._id === myId && !m.isRead
      ).length;
      return { ...group, messages: sortedMsgs, hasUnread: unreadCount > 0 };
    });

    if (
      tempChatPartner &&
      !chatsList.find((c) => c.partnerId === tempChatPartner._id)
    ) {
      chatsList.unshift({
        partnerId: tempChatPartner._id,
        partner: tempChatPartner,
        lastMessage: "",
        timestamp: tempChatPartner.timestamp,
        messages: [],
        hasUnread: false,
      });
    }

    return chatsList.sort((a, b) => b.timestamp - a.timestamp);
  }, [globalMessages, currentUser, tempChatPartner]);

  const activeChat = useMemo(() => {
    return myChats.find((c) => c.partnerId === activePartnerId) || null;
  }, [myChats, activePartnerId]);

  const currentMessages = useMemo(() => {
    return activeChat?.messages || [];
  }, [activeChat]);

  useEffect(() => {
    localStorage.setItem(
      "ichgram_global_messages",
      JSON.stringify(globalMessages)
    );
  }, [globalMessages]);

  useEffect(() => {
    const interval = setInterval(() => setTimeTick(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activePartnerId && currentUser) {
      setGlobalMessages((prevMessages) => {
        const hasUnread = prevMessages.some(
          (msg) =>
            msg.sender._id === activePartnerId &&
            msg.receiver._id === currentUser._id &&
            !msg.isRead
        );

        if (!hasUnread) return prevMessages;

        return prevMessages.map((msg) => {
          if (
            msg.sender._id === activePartnerId &&
            msg.receiver._id === currentUser._id &&
            !msg.isRead
          ) {
            return { ...msg, isRead: true };
          }
          return msg;
        });
      });
    }
  }, [activePartnerId, currentUser]);

  useEffect(() => {
    const targetUser = (location.state as LocationState)?.startChatWith;
    if (targetUser && currentUser) {
      if (targetUser.id === currentUser._id) {
        navigate(location.pathname, { replace: true, state: {} });
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

  const handleChatSelect = (chatId: string): void => {
    setActivePartnerId(chatId);
    setInputValue("");
  };

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUser || !activeChat) return;

    const newMessage: IMessage = {
      id: Date.now().toString() + Math.random(),
      text: inputValue.trim(),
      createdAt: Date.now(),
      sender: currentUser,
      receiver: activeChat.partner,
      isRead: false,
    };

    setGlobalMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    if (tempChatPartner && tempChatPartner._id === activeChat.partner._id) {
      setTempChatPartner(null);
    }
  };

  const handleDeleteMessage = (messageId: string): void => {
    if (!window.confirm("Delete this message?")) return;
    setGlobalMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSendMessage(e);
  };

  const handleViewProfile = (): void => {
    if (activeChat?.partner?.isMock) return;
    if (activeChat?.partner?.username) {
      navigate(`/users/${activeChat.partner.username}`);
    }
  };

  const handleAvatarClick = (username?: string): void => {
    if (activeChat?.partner?.isMock) return;
    if (username) navigate(`/users/${username}`);
  };

  if (!currentUser) {
    return null;
  }

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
              <div className={styles.chatNameRow}>
                <span
                  className={`${styles.chatName} ${
                    chat.hasUnread ? styles.unread : ""
                  }`}
                >
                  {chat.partner.username}
                </span>
                {chat.hasUnread && <div className={styles.unreadDot}></div>}
              </div>
              <div
                className={`${styles.chatLast} ${
                  chat.hasUnread ? styles.unread : ""
                }`}
              >
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
                >
                  View Profile
                </button>
              </div>
              {currentMessages.length === 0 && (
                <div className={styles.noMessagesPlaceholder}>
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
            <form className={styles.chatInput} onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Write a message..."
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                onKeyDown={handleKeyDown}
              />
            </form>
          </>
        ) : (
          <div className={styles.noChatSelected}>
            <img src="/logo.svg" alt="Logo" className={styles.noChatLogo} />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Messages;
