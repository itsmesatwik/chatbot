import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // Import the CSS file

interface Message {
  id: number;
  content: string;
  sender: string;
}

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

  const sendMessage = async () => {
    try {
      const newMessage = { id: Date.now(), content: message, sender: "user" };
      const res = await axios.post("http://localhost:8000/chat/", newMessage);
      setMessages(res.data.messages);
      setMessage(""); // Clear input after sending message
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const editMessage = async (id: number) => {
    try {
      const updatedMessage = { id, content: message, sender: "user" };
      const res = await axios.put(
        `http://localhost:8000/chat/${id}`,
        updatedMessage
      );
      setMessages(res.data.messages);
      setMessage(""); // Clear input after editing
      setEditingMessageId(null); // Exit edit mode
    } catch (error) {
      console.error("Error editing message", error);
    }
  };

  const clearChat = () => {
    setMessages([]); // Clear all messages in the frontend
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:8000/chat/${id}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  const startEditing = (message: Message) => {
    if (message.sender === "user") {
      setEditingMessageId(message.id);
      setMessage(message.content); // Set input to the current message content
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat with Ava</h1>

      <div className="chat-window">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-container ${
              msg.sender === "server" ? "server-message" : "user-message"
            }`}
          >
            <div className="message-bubble">
              <span>{msg.content}</span>
              {msg.sender === "user" && (
                <div className="message-controls">
                  <i
                    className="fas fa-edit"
                    onClick={() => startEditing(msg)}
                  ></i>
                  <i
                    className="fas fa-trash-alt"
                    onClick={() => deleteMessage(msg.id)}
                  ></i>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="message-input"
      />
      {editingMessageId ? (
        <button
          onClick={() => editMessage(editingMessageId)}
          className="send-button"
        >
          Update Message
        </button>
      ) : (
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      )}
    </div>
  );
};

export default App;
