import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateForm } from "../components/CreateForm";

export const CreateFormContainer = ({ handleSubmitExt }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [formData, setFormData] = useState({
    nombrePartida: "",
    cantMin: 2,
    cantMax: 4,
    esPrivada: false,
    contraseña: "",
  });

  useEffect(() => {
    setValue("cantMin", formData.cantMin);
    setValue("cantMax", formData.cantMax);
  }, [formData]);

  const onSubmit = async () => {
    handleSubmitExt(formData);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      handleSubmit(onSubmit)();
    }
  };

  // Handle input changes
  const handleName = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleMaxPlayersClick = (max) => {
    setFormData((prev) => ({ ...prev, cantMax: max }));
    if (max <= formData.cantMin) {
      setFormData((prev) => ({ ...prev, cantMin: max }));
    }
  };

  const handleMinPlayersClick = (min) => {
    setFormData((prev) => ({ ...prev, cantMin: min }));
    if (min >= formData.cantMax) {
      setFormData((prev) => ({ ...prev, cantMax: min }));
    }
  };

  const handlePrivacidadChange = () => {
    setFormData((prev) => ({ ...prev, esPrivada: !prev.esPrivada }));
  };

  const handleContraseñaChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, contraseña: value }));
  };

  return (
    <CreateForm
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      onEnter={handleEnter}
      errors={errors}
      handleMinPlayersClick={handleMinPlayersClick}
      handleMaxPlayersClick={handleMaxPlayersClick}
      handleName={handleName}
      cantMin={formData.cantMin}
      cantMax={formData.cantMax}
      esPrivada={formData.esPrivada}
      contraseña={formData.contraseña}
      handlePrivacidadChange={handlePrivacidadChange}
      handleContraseñaChange={handleContraseñaChange}
    />
  );
};
