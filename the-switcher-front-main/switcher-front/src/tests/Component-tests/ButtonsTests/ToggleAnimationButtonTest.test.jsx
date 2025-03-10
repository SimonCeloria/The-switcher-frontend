import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import ToggleAnimationButton from "../../../components/Button/ToggleAnimationButton";
import { isAnimated, setIsAnimated } from "../../../Styles/AnimationVariable";

describe("ToggleAnimationButton", () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();

    // Initialize the global isAnimated state for the test
    setIsAnimated(true); // Start with true for the test
  });

  it("toggles animation state and updates session storage", () => {
    const toggleMock = vi.fn();

    // Set initial value in sessionStorage to true
    sessionStorage.setItem("isAnimated", JSON.stringify(true));

    // Render the component
    render(<ToggleAnimationButton toggle={toggleMock} />);

    // Verify that the toggle function was called with the correct initial state
    expect(toggleMock).toHaveBeenCalledWith(true);

    // Click the button to toggle animation
    const button = screen.getByText("Toggle Animation");
    fireEvent.click(button);

    // Check if the global isAnimated state was updated to false
    expect(isAnimated).toBe(false);
    expect(toggleMock).toHaveBeenCalledWith(false); // Check if toggle was called with the new state

    // Simulate re-rendering the component by setting sessionStorage to false
    sessionStorage.setItem("isAnimated", JSON.stringify(false));
    render(<ToggleAnimationButton toggle={toggleMock} />);

    // Ensure the button reflects the correct state from sessionStorage
    expect(toggleMock).toHaveBeenCalledWith(false); // Ensure toggle is called with the updated state
  });
});
