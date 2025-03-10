import { useContext } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";

const colorMap = {
  rojo: "/A.svg",
  verde: "/C.svg",
  azul: "/D.svg",
  amarillo: "/B.svg",
};

const UltimoColor = () => {
  const { colorBloqueado } = useContext(PartidaWSContext);

  const mostrarColor = (color) => {
    if (colorMap[color]) {
      return (
        <div className="p-2 text-center flex items-center justify-between border-4 border-dotted border-[var(--Marron)] rounded-lg shadow-lg">
          <span className="text-lg font-semibold text-[var(--Marron)]">
            Color bloqueado:
          </span>
          <img
            src={colorMap[color]}
            alt="Color bloqueado"
            style={{ width: "50px", height: "50px" }}
            className="ml-2"
          />
        </div>
      );
    }
    return (
      <div className="text-center p-2 bg-[var(--Crema)] border-4 border-dotted border-[var(--Marron)] rounded-lg shadow-lg">
        <p className="text-lg font-semibold text-[var(--Marron)]">
          No hay color bloqueado.
        </p>
        <p className="text-sm text-[var(--Marron)]">
          Todos los colores se pueden jugar.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-[var(--Crema)] p-4 rounded-lg shadow-lg border-4 border-[var(--Amarillo)] font-poppins text-lg">
      {mostrarColor(colorBloqueado)}
    </div>
  );
};

export default UltimoColor;
