// MovementList.jsx
import React, { useState, useContext } from "react";
import CardMovementContainer from "../../containers/CardMovementContainer";
import { CardMovEnemy } from "./CardMovement";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

const MovementList = ({ className = "" }) => {
  const { movimientos } = useContext(PartidaWSContext);
  const isMyTurn = useContext(PartidaWSContext).isMyTurn;
  const [selectedCard, setSelectedCard] = useState(null);
  const [waitingForEvent, setWaitingForEvent] = useState(false);

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
      {movimientos.map((movement, index) => (
        <div key={index} className="mx-1" data-testid="card-movement-user">
          <CardMovementContainer
            movement={movement}
            index={index}
            selectedCard={selectedCard}
            waitingForEvent={waitingForEvent}
            onCardClick={handleCardClick}
            onEventComplete={handleEventComplete}
            isMyTurn={isMyTurn}
          />
        </div>
      ))}
    </div>
  );
};

export default MovementList;

export const EnemyHandMovement = ({ idPlayer, className = "" }) => {
  const { amountMovs } = useContext(PartidaWSContext);

  if (!amountMovs[idPlayer]) {
    return null;
  }

  const amount = amountMovs[idPlayer].cantidad;
  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: amount }).map((_, index) => (
        <div key={index}>
          <CardMovEnemy />
        </div>
      ))}
    </div>
  );
};
