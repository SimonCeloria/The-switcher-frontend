// LoginContainer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../services/ConfigAxios";
import LoginForm from "../components/LoginForm";
import { useForm } from "react-hook-form";
import PartidaServices from "../services/Partida";

const LoginContainer = () => {
  const [name, setName] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Check if user is already logged in
    const idPlayer = sessionStorage.getItem("idPlayer");
    if (idPlayer) {
      navigate("/play");
    }
  }, [navigate]);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      handleSubmit(createJugador)();
    }
  };

  const createJugador = async () => {
    try {
      const response = await PartidaServices.crearJugador(name.trim());

      const jugadorId = response.data.id;

      // Guardar el ID en sessionStorage
      sessionStorage.setItem("idPlayer", jugadorId);
      navigate("/play");
    } catch (error) {
      setServerError("Error al crear jugador. Por favor, intente de nuevo.");
    }
  };

  return (
    <LoginForm
      name={name}
      handleName={handleName}
      errors={errors}
      register={register}
      handleSubmit={handleSubmit(createJugador)}
      serverError={serverError}
      onEnter={handleEnter}
    />
  );
};

export default LoginContainer;
