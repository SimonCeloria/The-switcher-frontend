import { useContext } from "react";
import InputChat from "../components/Chat/InputChat";
import { PartidaWSContext } from "../contexts/PartidaWSContext";

const InputChatContainer = () => {
  const { handleMsg } = useContext(PartidaWSContext);
  const sendMessage = (msg) => {
    handleMsg(msg);
  };
  return <InputChat onSubmit={sendMessage} />;
};

export default InputChatContainer;
