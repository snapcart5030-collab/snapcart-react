import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "./socket";
import "./Admin.css";
import toast from "react-hot-toast";
import AdminSocketNotifier from "./AdminSocketNotifier";

function Admin() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const adminEmail = "admin@gmail.com";
  const typingTimeouts = useRef({});

  // ✅ Fetch messages initially
  useEffect(() => {
  fetchMessages();
  socket.emit("register", adminEmail);
}, []);

// ✅ Real-time events (separate clean useEffect)
useEffect(() => {
  const handleReceive = (data) => {
    if (data.sender === adminEmail) return;

    setMessages((prev) => {
      const index = prev.findIndex((m) => m._id === data.contactId);
      const updated = [...prev];

      if (index !== -1) {
        updated[index].textMessage = data.message;
        return updated;
      } else {
        return [
          ...prev,
          {
            _id: data.contactId || Date.now(),
            email: data.email,
            username: data.username || data.sender,
            textMessage: data.message,
            responses: [],
          },
        ];
      }
    });
  };

  const handleTyping = (data) => {
    if (data.receiver === adminEmail) {
      setTypingUsers((prev) => ({ ...prev, [data.sender]: true }));

      if (typingTimeouts.current[data.sender])
        clearTimeout(typingTimeouts.current[data.sender]);
      typingTimeouts.current[data.sender] = setTimeout(() => {
        setTypingUsers((prev) => {
          const newTyping = { ...prev };
          delete newTyping[data.sender];
          return newTyping;
        });
      }, 1500);
    }
  };

  // 🔹 new — disconnected users
  const handleUserDisconnect = (data) => {
    if (data?.email && data.email !== adminEmail) {
      toast.error(`${data.email} has disconnected.`);
      alert(`⚠️ ${data.email} has disconnected.`);
      setMessages((prev) => [
        {
          _id: Date.now(),
          email: data.email,
          username: data.email.split("@")[0],
          textMessage: `⚠️ ${data.email} has disconnected.`,
          responses: [],
        },
        ...prev,
      ]);
    }
  };

  socket.on("receiveMessage", handleReceive);
  socket.on("typing", handleTyping);
  socket.on("userDisconnected", handleUserDisconnect);

  return () => {
    socket.off("receiveMessage", handleReceive);
    socket.off("typing", handleTyping);
    socket.off("userDisconnected", handleUserDisconnect);
  };
}, [adminEmail]);

  // ✅ Fetch messages from DB
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5030/contact");
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching admin messages:", err);
    }
  };

  // ✅ Admin sends reply
  const handleReply = async (contact) => {
    const msg = replyText[contact._id];
    if (!msg?.trim()) return;

    try {
      // 1️⃣ Save to DB
      await axios.post(`http://localhost:5030/contact/${contact._id}/reply`, {
        message: msg,
      });

      // 2️⃣ Update local state
      setMessages((prev) =>
        prev.map((m) =>
          m._id === contact._id
            ? {
                ...m,
                responses: [...(m.responses || []), { message: msg }],
              }
            : m
        )
      );

      // 3️⃣ Emit socket event
      socket.emit("sendMessage", {
        sender: adminEmail,
        receiver: contact.email,
        message: msg,
        contactId: contact._id,
      });

      // 4️⃣ Clear input for that chat
      setReplyText((prev) => ({ ...prev, [contact._id]: "" }));
    } catch (err) {
      console.error("Admin reply error:", err);
    }
  };

  return (
    <div className="admin-wrapper">
<AdminSocketNotifier/>

   <div className="py-4"></div>
      <h2 className="admin-title">💬 Admin Chat Panel</h2>

      {Object.keys(typingUsers).length > 0 && (
        <p className="typing-text">
          {Object.keys(typingUsers).join(", ")} typing...
        </p>
      )}

      <div className="admin-chat-list">
        {messages.map((msg) => (
          <div
            key={msg._id}
            onClick={() => setSelected(msg._id)}
            className={`chat-card ${selected === msg._id ? "selected" : ""}`}
          >
            <div className="chat-header">
              <h5 className="chat-username">{msg.username || msg.email}</h5>
            </div>

            <div className="chat-messages">
              <p className="user-message">
                <span className="label">User:</span> {msg.textMessage}
              </p>
              {msg.responses?.map((r, i) => (
                <p className="admin-message" key={i}>
                  <span className="label">Admin:</span> {r.message}
                </p>
              ))}
            </div>

            {selected === msg._id && (
              <div className="reply-box">
                <textarea
                  className="reply-input"
                  value={replyText[msg._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [msg._id]: e.target.value,
                    }))
                  }
                  placeholder="Type your reply..."
                />
                <button className="send-btn" onClick={() => handleReply(msg)}>
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
