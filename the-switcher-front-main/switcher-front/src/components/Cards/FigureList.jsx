import React, { useContext, useState, useEffect } from "react";
import CardFigureContainer from "../../containers/CardFigureContainer";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

const FiguresList = ({ idPlayer, className = "" }) => {
  const { figuras, isMyTurn } = useContext(PartidaWSContext);
  const [selectedCard, setSelectedCard] = useState(null);
  const [waitingForEvent, setWaitingForEvent] = useState(false);
  const handLength = figuras[idPlayer].enMano.length;

  const handleCardClick = (index) => {
    setSelectedCard(index);
    setWaitingForEvent(true);
  };

  const handleEventComplete = () => {
    setSelectedCard(null);
    setWaitingForEvent(false);
  };

  return (
    <div className={`flex ${className}`}>
      {figuras[idPlayer].enMano.map((figure, index) => (
        <div key={figure.id} className="mx-1" data-testid="card-figure-user">
          <CardFigureContainer
            figure={figure}
            index={index}
            selectedCard={selectedCard}
            waitingForEvent={waitingForEvent}
            onCardClick={handleCardClick}
            onEventComplete={handleEventComplete}
            isMyTurn={isMyTurn}
            handLength={handLength}
          />
        </div>
      ))}
    </div>
  );
};

export default FiguresList;
