import React from "react";
import ChatListContainer from "../../containers/ChatListContainer";
import InputChatContainer from "../../containers/InputChatContainer";

const Chat = () => {
  return (
    <div className="chat-container bg-[--Crema] border-2 hide-scrollbar border-[--Marron2] p-4 rounded-lg shadow-md h-full flex flex-col">
      {/* Lista de mensajes */}
      <div className="flex-grow overflow-y-auto chat-scrollbar pt-2 pr-1 pl-2.5">
        <ChatListContainer />
      </div>

      {/* Enviar mensaje */}
      <InputChatContainer />
    </div>
  );
};

export default Chat;
