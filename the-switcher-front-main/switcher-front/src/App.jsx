import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { ListaPartidaContextProvider } from "./contexts/ListaPartidaContext";
import { LobbyPage } from "./pages/Lobby";
import Game from "./pages/Game";
import MyContextLayout from "./ContextLayout";
import NotFound from "./pages/NotFound";
import ListaPartidasContainer from "./containers/ListaPartidasContainer";
import toast, { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/play"
            element={
              <ProtectedRoute>
                <ListaPartidaContextProvider>
                  <ListaPartidasContainer />
                </ListaPartidaContextProvider>
              </ProtectedRoute>
            }
          />
          <Route element={<MyContextLayout />}>
            <Route path="/lobby/:uuidPartida" element={<LobbyPage />} />

            <Route
              path="/game/:uuidPartida"
              element={
                <div>
                  <Toaster />
                  <Game />
                </div>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />{" "}
        </Routes>
      </Router>
    </div>
  );
}
export default App;
