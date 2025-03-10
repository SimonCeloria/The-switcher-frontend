import { rotatemovement } from "../containers/RotateMovs";
import toast, { Toaster } from "react-hot-toast";

export const ErrorNotificationMov = (msg) => {
  const audio = new Audio("/sounds/fichaInvalida.mp3");
  audio.volume = 0.15;
  audio.play();

  toast.error(msg, {
    duration: 1500,
    position: "top-center",

    // Estilos
    style: {
      background: "var(--Rojo)",
      color: "#ffffff",
    },
  });
};

export const ErrorNotificationFig = (msg) => {
  toast.error(msg, {
    duration: 1500,
    position: "top-center",

    // Estilos
    style: {
      background: "var(--Rojo)",
      color: "#ffffff",
    },
  });
};

// Obtener las coordenadas de la ficha
export const GetMovCoords = (cardmov) => {
  return { a: cardmov.movimiento.mov_x, b: cardmov.movimiento.mov_y };
};

// Obtener la informacion de la ficha
export const GetFichaInfo = (fichaElement) => {
  const fichaID = fichaElement.getAttribute("data-ficha-back-id"); // ID que se le asigna en el back
  const fichaPos = fichaElement.getAttribute("data-ficha-id"); // Posicion en el tablero
  const fichaXCord = fichaElement.getAttribute("data-ficha-x"); // Coordenada x del back
  const fichaYCord = fichaElement.getAttribute("data-ficha-y"); // Coordenada y del back

  return {
    pos: fichaPos, //Posision en el tablero
    id: fichaID, //ID de la ficha
    coordenadas: { x: fichaXCord, y: fichaYCord }, //Coordenadas de la ficha
  };
};

// Obtener la informacion de la figura
export const GetFigure = (ficha, figures) => {
  const calculatedficha = parseInt(ficha.y, 10) * 6 + parseInt(ficha.x, 10);
  const foundobject = figures.find((obj) =>
    obj.fichas.map((ficha) => parseInt(ficha, 10)).includes(calculatedficha)
  ); //Busca entre las figuras resaltadas, la ficha a la que pertenece
  return foundobject || null; // Retorna el objeto o null
};

export const isValidFigure = (nameArrayFigures, nameCardFigure) => {
  return nameArrayFigures === nameCardFigure;
};

// Mostrar los movimientos posibles
export const ShowMovs = ({
  cardmov,
  pivot,
  isSpecial,
  updateHighlightCoords,
}) => {
  // Pivot es las coordenadas de la ficha enviadas del back
  const AllMovs = rotatemovement(cardmov, isSpecial, pivot); // pj: {xCord: 2, yCord: 3}
  const newHighlightCoords = AllMovs.map((mov) => mov.y * 6 + mov.x);
  updateHighlightCoords(newHighlightCoords);
  return newHighlightCoords;
};

// Verificar si la ficha es valida
export const isValidFicha = (fichaId, availableFichas) => {
  const fichaIdInt = parseInt(fichaId, 10); //Es posicion no ID
  const availableFichasInt = availableFichas.map((ficha) =>
    parseInt(ficha, 10)
  );

  return availableFichasInt.includes(fichaIdInt); // La ficha esta en los movimientos validos
};

//Verificar si la figura es bloqueable
export const isValidBlock = (figuras, figuraPlayerId) => {
  var oneIsAlreadyBlock = false;
  figuras[figuraPlayerId].enMano.map((figura) => {
    figura.bloqueada ? (oneIsAlreadyBlock = true) : null;
  });
  if (oneIsAlreadyBlock) {
    //ya habia una bloqueada
    ErrorNotificationFig("El jugador ya tiene una carta bloqueada");
    return false;
  }
  if (
    figuras[figuraPlayerId].enMano.length == 1 &&
    figuras[figuraPlayerId].enMazo == 0
  ) {
    //No puede ser bloqueado pues, tiene una sola carta
    ErrorNotificationFig("El jugador tiene una sola carta");
    return false;
  }
  return true;
};
