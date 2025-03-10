import React from "react";
import "../../Styles/AnimatedCard.css";

export function CardFigureUser({
  block,
  figuretype,
  clicked,
  handleClick,
  ganador = {},
  handLength,
}) {
  return (
    <div
      className={`figure-card ${
        block && handLength > 1 ? "flipped" : "flipped-back"
      }`}
    >
      <div className="card-inner">
        <div
          className="card-front"
          onClick={ganador.nombre ? null : handleClick}
        >
          <div
            onMouseEnter={(e) => {
              !clicked ? (e.target.style.transform = "scale(1.12)") : "";
            }}
            onMouseLeave={(e) => {
              !clicked ? (e.target.style.transform = "scale(1)") : "";
            }}
          >
            <img
              data-testid="card-figure"
              src={figuretype}
              style={{
                width: "60px",
                height: "60px",
                cursor: ganador.nombre
                  ? "not-allowed"
                  : clicked
                  ? "pointer"
                  : "default",
                transform:
                  clicked && !ganador.nombre ? "scale(1.2)" : "scale(1)",
              }}
            />
          </div>
        </div>
        <div className="card-back">
          <img
            src={"/back.svg"}
            data-testid="card-figure-block"
            style={{
              width: "60px",
              height: "60px",
              cursor: "not-allowed",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CardFigureUser;
