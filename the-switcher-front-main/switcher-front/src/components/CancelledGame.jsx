import React, { useState } from "react";
import "../Styles/Pallete.css";

export const CancelledGame = () => {
  const [isPopoutOpen, setIsPopoutOpen] = useState(true);

  if (!isPopoutOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo verdoso semitransparente */}
      <div className="absolute inset-0 bg-[#2C4C3B] bg-opacity-70"></div>

      <div className="relative w-full max-w-[320px] aspect-square z-10">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(#3A5C4A 1px, transparent 1px),
              linear-gradient(90deg, #3A5C4A 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        ></div>

        <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-[#D4B483] via-[#C0A172] to-[#B89B71] p-[6px] shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
          <div className="w-full h-full rounded-[22px] bg-[#1A472A] p-3 flex flex-col overflow-hidden">
            {/* Encabezado */}
            <div className="bg-[#1A472A] rounded-t-xl py-2 px-4 flex items-center justify-between">
              <div
                className="w-2 h-2 rounded-full bg-[#D4B483]"
                aria-hidden="true"
              ></div>
              <h2
                className="text-[#E8DCC4] font-bold text-lg tracking-wider"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
              >
                THE SWITCHER
              </h2>
              <div
                className="w-2 h-2 rounded-full bg-[#D4B483]"
                aria-hidden="true"
              ></div>
            </div>

            <div
              className="flex-1 bg-[#E8DCC4] my-2 rounded-lg p-4 text-center flex flex-col justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #E8DCC4 25%, #E0D4BC 25%, #E0D4BC 50%, #E8DCC4 50%, #E8DCC4 75%, #E0D4BC 75%, #E0D4BC 100%)",
                backgroundSize: "4px 4px",
              }}
            >
              <p className="text-[#1A472A] font-bold text-xl mb-2">
                Partida cancelada.
              </p>
              <p className="text-[#1A472A] text-sm mb-1">
                La partida ha sido cancelada.
              </p>
              <p className="text-[#1A472A] text-sm">
                Se te ha redirigido al lobby.
              </p>
            </div>

            <div className="bg-[#1A472A] rounded-b-xl p-4 flex justify-center items-center">
              <button
                onClick={() => setIsPopoutOpen(false)}
                className="w-16 h-16 rounded-full bg-gradient-to-b from-[#2A573A] to-[#1A472A] 
                  border-4 border-[#E8DCC4] text-[#E8DCC4] font-bold text-lg
                  transform transition-all duration-200
                  hover:from-[#346845] hover:to-[#2A573A]
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E8DCC4] focus:ring-opacity-50"
                style={{
                  textShadow: "0 -1px 1px rgba(0,0,0,0.5)",
                  boxShadow:
                    "0 2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
                }}
                data-testid="close-button"
              >
                OK
              </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 text-[#8B7355] text-[10px] font-medium opacity-80">
              <span>OK</span>
              <span>GAME SWITCHER</span>
              <span>OK</span>
            </div>
          </div>
        </div>

        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 rounded-t-full"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
};
