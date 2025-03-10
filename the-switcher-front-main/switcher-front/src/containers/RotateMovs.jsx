import React from "react";

export const rotatemovement = (cardmov, isSpecial, pivot) => {
  let movs = [];
  if (isSpecial) {
    movs.push({ x: pivot.x, y: 0 });
    movs.push({ x: pivot.x, y: 5 });
    movs.push({ x: 0, y: pivot.y });
    movs.push({ x: 5, y: pivot.y });
  } else {
    movs.push({ x: pivot.x + cardmov.a, y: pivot.y + cardmov.b }); //(a,b)
    movs.push({ x: pivot.x + cardmov.b, y: pivot.y - cardmov.a }); // (b,-a)
    movs.push({ x: pivot.x - cardmov.a, y: pivot.y - cardmov.b }); // (-a,-b)
    movs.push({ x: pivot.x - cardmov.b, y: pivot.y + cardmov.a }); // (-b,a)
  }

  const validMovs = movs.filter(
    (mov) =>
      mov.x >= 0 &&
      mov.x <= 5 &&
      mov.y >= 0 &&
      mov.y <= 5 &&
      !(mov.x === pivot.x && mov.y === pivot.y)
  );

  return validMovs;
};
