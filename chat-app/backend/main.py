from fastapi import FastAPI, Response, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    id: int
    content: str
    sender: str


# Store messages in memory for simplicity
messages = []


@app.post("/chat/")
async def send_message(message: Message):
    # Add new message to the list
    messages.append(message)
    # Generate a response from the server
    server_message = Message(id=message.id + 1, content=f"Server received: {message.content}", sender="server")
    messages.append(server_message)
    return {"response": "Message sent", "messages": messages}


@app.put("/chat/{message_id}")
async def edit_message(message_id: int, updated_message: Message):
    # Find and update the message
    for msg in messages:
        if msg.id == message_id and msg.sender == "user":  # Only allow user to edit their own messages
            msg.content = updated_message.content
            return {"response": "Message updated", "messages": messages}
    raise HTTPException(status_code=404, detail="Message not found")


@app.delete("/chat/{message_id}")
async def delete_message(message_id: int):
    global messages
    # Filter out the message to be deleted
    messages = [msg for msg in messages if msg.id != message_id or msg.sender != "user"]  # Only user messages can be deleted
    return {"response": "Message deleted", "messages": messages}

# Clear all messages
@app.delete("/chat/clear/")
async def clear_chat():
    global messages
    messages.clear()
    return {"response": "Chat cleared", "messages": messages}
