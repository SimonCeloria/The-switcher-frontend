import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { rotatemovement } from "../containers/RotateMovs";

describe("RotateMovs", () => {

    it("debería devolver todas los movimientos validos", () => {
        const mockPlay = { mov: { a: 1, b: 2 }, isSpecial : false, coord : {x: 2, y: 3} };
        const FinalMovements = rotatemovement(mockPlay.mov, mockPlay.isSpecial, mockPlay.coord);

        expect(FinalMovements[0]).toEqual({ x: 3, y: 5 });
        expect(FinalMovements[1]).toEqual({ x: 4, y: 2 });
        expect(FinalMovements[2]).toEqual({ x: 1, y: 1 });
        expect(FinalMovements[3]).toEqual({ x: 0, y: 4 });
        
        
        expect(FinalMovements.length).toBe(4);
    });
    it("Deberia devolver un arreglo de largo 2", () => {
        const mockPlay = { mov: { a: 1, b: 1 }, isSpecial : false, coord: {x: 0, y: 1} };
        const FinalMovements = rotatemovement(mockPlay.mov, mockPlay.isSpecial, mockPlay.coord);
        
        expect(FinalMovements[0]).toEqual({ x: 1, y: 2 });  
        expect(FinalMovements[1]).toEqual({ x: 1, y: 0 });
        
        expect(FinalMovements.length).toBe(2);
    });
    it("Deberia mostrar las 4 opciones horizontales/verticales", () => {
        const mockPlayA = { mov: { a: 0, b: 1 }, isSpecial : false, coord: {x: 3, y: 3} };
        const FinalMovementsA = rotatemovement(mockPlayA.mov, mockPlayA.isSpecial, mockPlayA.coord);

        expect(FinalMovementsA[0]).toEqual({ x: 3, y: 4 });
        expect(FinalMovementsA[1]).toEqual({ x: 4, y: 3 });
        expect(FinalMovementsA[2]).toEqual({ x: 3, y: 2 });
        expect(FinalMovementsA[3]).toEqual({ x: 2, y: 3 });
        
        

        
        expect(FinalMovementsA.length).toBe(4);

        ///

        const mockPlayB = { mov: { a: 1, b: 0 }, isSpecial : false, coord: {x: 3, y: 3} };
        const FinalMovementsB = rotatemovement(mockPlayB.mov,mockPlayB.isSpecial, mockPlayB.coord);

        
        expect(FinalMovementsA[0]).toEqual({ x: 3, y: 4 });
        expect(FinalMovementsA[1]).toEqual({ x: 4, y: 3 });
        expect(FinalMovementsA[2]).toEqual({ x: 3, y: 2 });
        expect(FinalMovementsA[3]).toEqual({ x: 2, y: 3 });
        
        
        expect(FinalMovementsB.length).toBe(4);
    });
    it("Movimiento especial", () => {
        const mockPlay = { mov: { a: 0, b: 0 },isSpecial : true, coord: {x: 3, y: 2} };
        const FinalMovements = rotatemovement(mockPlay.mov, mockPlay.isSpecial, mockPlay.coord);

        expect(FinalMovements[0]).toEqual({ x: 3, y: 0 });
        expect(FinalMovements[1]).toEqual({ x: 3, y: 5 });
        expect(FinalMovements[2]).toEqual({ x: 0, y: 2 });
        expect(FinalMovements[3]).toEqual({ x: 5, y: 2 });
        
        
        expect(FinalMovements.length).toBe(4);
    });

    it("Movimiento especial no incluya la misma ficha", () => {
        const mockPlay = { mov: { a: 0, b: 0 },isSpecial : true, coord: {x: 0, y: 0} };
        const FinalMovements = rotatemovement(mockPlay.mov, mockPlay.isSpecial, mockPlay.coord);

        expect(FinalMovements[0]).toEqual({ x: 0, y: 5 });
        expect(FinalMovements[1]).toEqual({ x: 5, y: 0 });
        
        
        expect(FinalMovements.length).toBe(2);
    });
});