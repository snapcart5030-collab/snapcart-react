import { toast } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { socket } from "./socket";
import { Link } from "react-router-dom";
import { Contact_Url } from "./Api_URL_Page";
import "./ContactPage.css";

function ContactPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [typing, setTyping] = useState("");
  const typingTimeout = useRef(null);
  const chatBoxRef = useRef(null);

  // ✅ Fetch previous messages
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${Contact_Url()}/${user.email}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
  }, [user]);

  // ✅ Socket connection
  useEffect(() => {
    if (!user) return;

    socket.emit("register", user.email);

    const handleReceiveMessage = (data) => {
      if (data.sender === user.email) return;

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) => m._id === data.contactId && m.textMessage === data.message
        );
        if (alreadyExists) return prev;

        const index = prev.findIndex((m) => m._id === data.contactId);
        const updated = [...prev];

        if (index !== -1) {
          if (data.sender === "admin@gmail.com") {
            updated[index].responses = updated[index].responses || [];
            updated[index].responses.push({ message: data.message });
          } else {
            updated[index].textMessage = data.message;
          }
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: data.contactId || Date.now(),
              email: data.email,
              username: data.username || data.sender,
              textMessage: data.message,
              responses:
                data.sender === "admin@gmail.com"
                  ? [{ message: data.message }]
                  : [],
            },
          ];
        }
      });
    };

    const handleTyping = (data) => {
      if (data.sender !== user.email) {
        setTyping(`${data.sender} is typing...`);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTyping(""), 1500);
      }
    };

    socket.off("receiveMessage");
    socket.off("typing");
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
    };
  }, [user]);

  // ✅ Auto scroll
  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages, typing]);

  // ✅ Send message
  const handleSend = async () => {
    if (!user) {
      toast.error("Please login first to send messages!");
      return;
    }

    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(Contact_Url(), {
        username: user.username,
        email: user.email,
        textMessage,
      });

      const newMsg = res.data.data;
      setMessages((prev) => [...prev, newMsg]);

      socket.emit("sendMessage", {
        sender: user.email,
        receiver: "admin@gmail.com",
        message: textMessage,
        contactId: newMsg._id,
        username: user.username,
        email: user.email,
      });

      setTextMessage("");
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Failed to send message. Try again later.");
    }
  };

  // ✅ Typing logic
  const handleTyping = (e) => {
    if (!user) {
      toast.error("Please login first to type a message!");
      return;
    }

    setTextMessage(e.target.value);
    socket.emit("typing", { sender: user.email, receiver: "admin@gmail.com" });
  };

  const handleDeleteAll = async () => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete all your messages?"))
      return;

    try {
      await axios.post(`${Contact_Url()}/deleteAll`, { email: user.email });
      setMessages([]);
      toast.success("All messages deleted!");
    } catch (err) {
      console.error("Delete all error:", err);
      toast.error("Failed to delete messages.");
    }
  };

  return (
    <div className="my_contact_wrapper_5">
      <div className="my_contact_box_5">
        <div className="chat_header_5">
          <Link to="/" className="bi  bi-arrow-left btn chat_back_btn_5"></Link>
          <h2>Contact with Admin</h2>
          <button
            onClick={handleDeleteAll}
            disabled={!user}
            className="chat_delete_btn_5 bg-transparent"
            title="Delete All"
          >
            <i className="bi btn btn-danger bi-trash-fill"></i>
          </button>
        </div>

        <div className="my_chat_box" ref={chatBoxRef}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat_message_5 ${
                msg.email === user?.email ? "user_msg_5" : "admin_msg_5"
              }`}
            >
              <p>
                <strong className="text-primary fw-bold">
                  {msg.username || "You"}:
                </strong>{" "}
                <span className="text-danger">{msg.textMessage}</span>
              </p>

              {msg.responses?.map((r, j) => (
                <p key={j} className="admin_response_5 ms-4">
                  <strong>Admin:</strong>{" "}
                  <span className="text-success">{r.message}</span>
                </p>
              ))}
            </div>
          ))}
          {typing && <p className="typing_indicator_5">{typing}</p>}
        </div>

        <textarea
          value={textMessage}
          onChange={handleTyping}
          placeholder="Write message..."
          rows={3}
          className="my_contact_textarea_5"
        />
        <button onClick={handleSend} className="my_contact_msg_button_5">
          Send Message
        </button>
      </div>
    </div>
  );
}

export default ContactPage;
