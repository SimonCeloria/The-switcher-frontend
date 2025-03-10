import React, { useState, useEffect } from "react";
import { isAnimated, setIsAnimated } from "../../Styles/AnimationVariable";

const ToggleAnimationButton = ({ toggle }) => {
  const toggleBackground = () => {
    setIsAnimated(!isAnimated);
    toggle(isAnimated);
  };

  // load from session storage
  useEffect(() => {
    const isAnimated = JSON.parse(sessionStorage.getItem("isAnimated"));
    if (isAnimated !== null) {
      setIsAnimated(isAnimated);
      toggle(isAnimated);
    }
  }, []);

  // save in session storage
  useEffect(() => {
    sessionStorage.setItem("isAnimated", JSON.stringify(isAnimated));
  }, [isAnimated]);

  return (
    <button
      onClick={toggleBackground}
      className="bg-[var(--Celeste2)] text-white font-bold py-2 px-4 rounded"
      style={{ position: "absolute", bottom: "10px", right: "15px" }}
    >
      Toggle Animation
    </button>
  );
};

export default ToggleAnimationButton;
