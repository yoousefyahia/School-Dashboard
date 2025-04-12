import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import '@/app/sytle/chat.css';

const socket = io("http://localhost:8080");

const ChatComponent = () => {
  const [messages, setMessages] = useState([]); // لتخزين الرسائل
  const [message, setMessage] = useState(""); // لتخزين الرسالة التي يتم كتابتها حاليًا
  const [chatOpen, setChatOpen] = useState(true); // للتحكم في فتح وغلق الشات
  const [userName, setUserName] = useState("User"); // اسم الشخص الذي تتحدث معه
  const [showOptions, setShowOptions] = useState(null); // لتحديد الرسالة التي تعرض لها الخيارات

  // تحميل الرسائل من localStorage عند أول تحميل
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (savedMessages) {
      setMessages(savedMessages);
    }

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, { ...newMessage }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // إرسال الرسالة
  const sendMessage = () => {
    if (message) {
      const newMessage = {
        sender: "You",
        text: message,
        id: Date.now(), // لكل رسالة توقيت مميز
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }), // تنسيق الوقت ليظهر الساعات والدقائق مع AM/PM
      };
      socket.emit("send_message", newMessage);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // حفظ الرسائل في localStorage
        return updatedMessages;
      });
      setMessage("");
    }
  };

  // غلق الشات
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // تعديل الرسالة
  const editMessage = (id) => {
    const newMessageText = prompt("أدخل النص الجديد للرسالة:");
    if (newMessageText) {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) =>
          msg.id === id ? { ...msg, text: newMessageText } : msg
        );
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // حفظ الرسائل بعد التعديل
        return updatedMessages;
      });
      setShowOptions(null); // إغلاق الخيارات بعد التعديل
    }
  };

  // حذف الرسالة
  const deleteMessage = (id) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((msg) => msg.id !== id);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // حفظ الرسائل بعد الحذف
      return updatedMessages;
    });
    setShowOptions(null); // إغلاق الخيارات بعد الحذف
  };

  // إظهار النقاط الثلاث عند الضغط عليها
  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id);
  };

  return (
    chatOpen && (
      <div className="chat-window">
        <div className="chat-header">
          <div className="user-info">
            <span className="chat-title">{userName}</span> {/* عرض اسم الشخص */}
          </div>
          <button className="close-chat" onClick={toggleChat}>
            ✖️ {/* زر لغلق الشات */}
          </button>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "You" ? "my-message" : "other-message"}`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
              <div className="message-info">
                <span
                  style={{
                    color: "red", 
                    fontSize: "12px", 
                  }}
                >
                  {msg.timestamp} {/* عرض وقت إرسال الرسالة مع AM/PM */}
                </span>
              </div>
              <div className="message-actions">
                {msg.sender === "You" && (
                  <button className="more-options" onClick={() => toggleOptions(msg.id)}>
                    ...
                    {showOptions === msg.id && (
                      <div className="options">
                        <button onClick={() => editMessage(msg.id)}>تعديل</button>
                        <span> </span>
                        <button onClick={() => deleteMessage(msg.id)}>حذف</button>
                      </div>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="أكتب رسالتك هنا"
          />
          <button onClick={sendMessage}>إرسال</button>
        </div>
      </div>
    )
  );
};

export default ChatComponent;
