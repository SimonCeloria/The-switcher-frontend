import React, { useEffect, useRef } from "react";

const ChatList = ({ messages, getColor }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 74);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="w-full h-full overflow-y-scroll hide-scrollbar p-1 rounded-lg">
      {messages.map((msg, index) => {
        // Mapeo la lista de mensajes y los voy printeando dependiendo que tipo de log es o si es un mensaje de chat
        return (
          <div key={index} className="mb-2 w-full">
            {msg.is_log ? (
              <div className="font-bold w-full bg-[--CremaChat] text-yellow-900 p-3 rounded-lg inline-block">
                {msg.figura && msg.jugador_bloqueado_id ? ( // Bloqueo de figura
                  <div className="flex">
                    <p
                      className="mt-1.5"
                      style={{ color: getColor(msg.jugador_id) }}
                    >
                      {msg.mensaje}
                    </p>
                    <img
                      src={`${msg.figura}`}
                      alt="Log related"
                      className="w-10 h-10 mb-2 ml-1"
                    />
                  </div>
                ) : msg.ganador ? ( // Anuncio de ganador
                  <div className="font-bold flex">
                    <p style={{ color: getColor(msg.jugador_id) }}>
                      {msg.mensaje}
                    </p>
                  </div>
                ) : msg.figura ? ( // Completo una figura
                  <div className="flex">
                    <p
                      className="mt-1.5"
                      style={{ color: getColor(msg.jugador_id) }}
                    >
                      {" "}
                      {msg.mensaje}{" "}
                    </p>
                    <img
                      src={`${msg.figura}`}
                      alt="Log related"
                      className="w-10 h-10 mb-2 ml-1"
                    />
                  </div>
                ) : msg.abandono ? ( // Jugador abandonó el partido
                  <div className="font-bold flex">
                    <p style={{ color: getColor(msg.jugador_id) }}>
                      {msg.mensaje}
                    </p>
                  </div>
                ) : msg.carta ? ( // Jugador usó una carta
                  <div className="font-bold flex">
                    <p
                      className="mt-1.5"
                      style={{ color: getColor(msg.jugador_id) }}
                    >
                      {msg.mensaje}
                    </p>
                    <img
                      src={`${msg.carta}`}
                      alt="Log related"
                      className="w-10 h-10 mb-2 ml-1"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <p
                className="break-words w-full border border-[--Marron] bg-[--CremaChat] text-[#1A1A1A] p-3 rounded-lg inline-block"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <strong style={{ color: getColor(msg.jugador_id) }}>
                  {msg.nombre}:
                </strong>{" "}
                {msg.mensaje}
              </p>
            )}
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatList;
