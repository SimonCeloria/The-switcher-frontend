import React, { useState, useEffect } from "react";

export function CardMovUser({
  img_url,
  clicked,
  handleClick,
  isUsed,
  ganador,
}) {
  const [currentImgUrl, setCurrentImgUrl] = useState(img_url);

  useEffect(() => {
    setCurrentImgUrl(isUsed ? "/back-mov.svg" : img_url);
  }, [isUsed, img_url]);

  return (
    <div className="card">
      <img
        onClick={isUsed || ganador.nombre ? null : handleClick}
        onMouseEnter={(e) => {
          if (!ganador.nombre) {
            e.target.style.transform = "scale(1.1)"; // Efecto hover (agrandar)
          }
        }}
        onMouseLeave={(e) => {
          if (!ganador.nombre) {
            e.target.style.transform = clicked ? "scale(1.14)" : "scale(1)";
          }
        }}
        src={currentImgUrl}
        style={{
          width: "135px",
          height: "202px",
          cursor:
            isUsed || ganador.nombre
              ? "not-allowed"
              : clicked
              ? "pointer"
              : "default",
          transform: clicked && !ganador.nombre ? "scale(1.14)" : "scale(1)", // Escala si está seleccionado
        }}
      />
    </div>
  );
}

export function CardMovEnemy() {
  return (
    <div className="card">
      <img src={"/back-mov.svg"} style={{ width: "25px", height: "37.5px" }} />
    </div>
  );
}
