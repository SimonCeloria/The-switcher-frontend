import React from "react";
import { Outlet } from "react-router-dom";
import { PartidaWSContextProvider } from "./contexts/PartidaWSContext";
import { PartidaContextProvider } from "./contexts/PartidaContext";
import { ProtectedPartida } from "./components/ProtectedPartida";

const MyContextLayout = () => {
  return (
    <PartidaContextProvider>
      <ProtectedPartida>
        <PartidaWSContextProvider>
          <Outlet />
        </PartidaWSContextProvider>
      </ProtectedPartida>
    </PartidaContextProvider>
  );
};

export default MyContextLayout;
