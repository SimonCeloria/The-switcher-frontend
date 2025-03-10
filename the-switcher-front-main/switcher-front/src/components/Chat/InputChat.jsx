import { useEffect } from "react";
import { useForm } from "react-hook-form";

const InputChat = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (errors.message) {
      const timer = setTimeout(() => {
        clearErrors("message");
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [errors.message, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (data.message !== "") {
          onSubmit(data.message);
          setValue("message", "");
        }
      })}
    >
      <div className="pb-1 ml-4 w-[93%]">
        <div className="flex">
          <input
            {...register("message", { required: true, maxLength: 240 })}
            className={`flex-grow p-2 bg-[--CremaChat] mr-1 rounded-lg border ${
              errors.message
                ? "border-red-500 border-1 shake"
                : "border-[--Marron]"
            } focus:outline-none`}
            placeholder="Escribe un mensaje..."
            autoComplete="off"
          />

          <input
            type="submit"
            value={"Enviar"}
            className="send-button bg-[--Celeste3] text-white px-6 py-2 rounded-lg hover:bg-[--Celeste2] active:bg-[--Celeste1]"
          />
        </div>
      </div>
    </form>
  );
};

export default InputChat;
