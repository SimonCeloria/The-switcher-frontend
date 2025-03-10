import { useContext, useRef } from "react";
import ChatList from "../components/Chat/ChatList";
import { PartidaWSContext } from "../contexts/PartidaWSContext";

const ChatListContainer = () => {
  const { mensajes } = useContext(PartidaWSContext);
  const colorsPool = ["#3D5AFE", "#009688", "#FF5722", "#8E24AA"];

  const colorMap = useRef({});

  const getColor = (name) => {
    if (!colorMap.current[name]) {
      const colorIndex =
        Object.keys(colorMap.current).length % colorsPool.length;
      colorMap.current[name] = colorsPool[colorIndex];
    }
    return colorMap.current[name];
  };

  return <ChatList messages={mensajes} getColor={getColor} />;
};

export default ChatListContainer;
