import { createContext, useState } from "react";

export const PartidaContext = createContext();

export function PartidaContextProvider(props) {
  const [idPartida, setIdPartida] = useState(
    sessionStorage.getItem("idPartida")
  );

  return (
    <PartidaContext.Provider
      value={{
        idPartida: idPartida,
        setIdPartida: setIdPartida,
      }}
    >
      {props.children}
    </PartidaContext.Provider>
  );
}
