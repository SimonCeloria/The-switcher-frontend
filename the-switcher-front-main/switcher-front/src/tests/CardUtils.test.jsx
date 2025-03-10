import { describe, it, expect } from "vitest";
import { GetFichaInfo, GetFigure, isValidFicha, GetMovCoords, isValidFigure, ShowMovs, ErrorNotificationFig, ErrorNotificationMov } from "../containers/CardUtils";
import { toast } from "react-hot-toast";

describe("GetFichaInfo", () => {
  it("debería devolver la información correcta de la ficha", () => {
    // Crear un elemento simulado
    const fichaElement = document.createElement("div");
    
    // Asignar atributos simulados
    fichaElement.setAttribute("data-ficha-back-id", "123");
    fichaElement.setAttribute("data-ficha-id", "33");
    fichaElement.setAttribute("data-ficha-x", "3");
    fichaElement.setAttribute("data-ficha-y", "5");

    // Llamar a la función
    const result = GetFichaInfo(fichaElement);
    
    // Comprobar el resultado
    expect(result).toEqual({
      pos: "33",
      id: "123",
      coordenadas: { x: "3", y: "5" },
    });
  });

  it("debería devolver valores undefined si no hay atributos", () => {
    const fichaElement = document.createElement("div");
    
    const result = GetFichaInfo(fichaElement);
    
    expect(result).toEqual({
      pos: null,
      id: null,
      coordenadas: { x: null, y: null },
    });
  });
});

describe('GetFigure', () => {
  const figures = [
    {nombre: "",fichas:[0, 1, 2, 3, 4, 5]},
    {nombre: "",fichas:[6, 7, 8, 9, 10, 11]},
    {nombre: "",fichas:[12, 13, 14, 15, 16, 17]},
  ];

  it('Deberia devolver el array que contiene la figura', () => {
    const ficha = { x: '2', y: '1' }; // calculatedficha = 1 * 6 + 2 = 8
    const result = GetFigure(ficha, figures);
    expect(result).toEqual(figures[1]); // Debe devolver el segundo arreglo [6, 7, 8, 9, 10, 11]
  });

  it('Deberia devolver null porque la figura no esta entre las resaltadas', () => {
    const ficha = { x: '5', y: '4' }; // calculatedficha = 4 * 6 + 5 = 29 
    const result = GetFigure(ficha, figures);
    expect(result).toBeNull(); // Debe devolver null
  });
});

describe('isValidFicha', () => {
  it("should validate ficha correctly", () => {
    const availableFichas = [1, 2, 3];
    const fichaId = "2";

    expect(isValidFicha(fichaId, availableFichas)).toBe(true);
    expect(isValidFicha("4", availableFichas)).toBe(false);
  });
});

describe("GetMovCoords", () => {
  it("debería devolver las coordenadas de movimiento correctas", () => {
    const cardmov = {
      movimiento: {
        mov_x: 5,
        mov_y: 10,
      },
    };

    const result = GetMovCoords(cardmov);

    expect(result).toEqual({ a: 5, b: 10 });
  });
});

describe("isValidFigure", () => {
  it("should validate figure correctly", () => {
    const namearrayfigures = "figure";
    const namecardfigure = "figure";

    expect(isValidFigure(namearrayfigures, namecardfigure)).toBe(true);
    expect(isValidFigure("figure", "figure2")).toBe(false);
  });
});

describe("ShowMovs", () => {
  // Mock del contexto
  const mockUpdateHighlightCoords = vi.fn();
  const cardmovmock = { a: 1, b: 1 };
  const pivotmock = { x: 2, y: 2 };
  const isSpecial = false;

  it("Deberia devolverme una lista de coordenadas correctas", async () => {
    const mockAllMovs = [{ x: 3, y: 3 }, { x: 3, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 1 }];
    
    const result = ShowMovs({
      cardmov: cardmovmock,
      pivot: pivotmock,
      isSpecial: isSpecial,
      updateHighlightCoords: mockUpdateHighlightCoords,
    });

    expect(result).toEqual([21, 9, 7, 19]); 
    // 3*6 + 3 = 21, 3 + 1*6 = 9, 1 + 3*6 = 19 , 1 + 1*6 = 7
  });
});


describe("ErrorNotificationMov", () => {
  it("debería reproducir el audio y mostrar la notificación de error", () => {
    // Mock del audio
    const playMock = vi.fn();
    global.Audio = vi.fn(() => ({
      play: playMock,
      volume: 0,
    }));

    // Mock de toast
    const toastMock = vi.spyOn(toast, "error");

    const mensaje = "Movimiento no válido";
    ErrorNotificationMov(mensaje);

    // Verificar que se haya reproducido el audio
    expect(Audio).toHaveBeenCalledWith('/sounds/fichaInvalida.mp3');
    expect(playMock).toHaveBeenCalled();
    expect(Audio().volume).toBe(0); 

    // Verificar que se haya mostrado el toast con el mensaje y los estilos correctos
    expect(toastMock).toHaveBeenCalledWith(mensaje, {
      duration: 1500,
      position: "top-center",
      style: {
        background: "var(--Rojo)",
        color: "#ffffff",
      },
    });
  });
});

describe("ErrorNotificationFig", () => {
  it("debería mostrar la notificación de error", () => {
    // Mock de toast
    const toastMock = vi.spyOn(toast, "error");

    const mensaje = "Figura no válida";
    ErrorNotificationFig(mensaje);

    // Verificar que se haya mostrado el toast con el mensaje y los estilos correctos
    expect(toastMock).toHaveBeenCalledWith(mensaje, {
      duration: 1500,
      position: "top-center",
      style: {
        background: "var(--Rojo)",
        color: "#ffffff",
      },
    });
  });
});

