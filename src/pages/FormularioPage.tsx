import { useNavigate } from "react-router-dom";

import Formularios from "../components/Formularios";

export default function FormularioPage() {

  const navigate = useNavigate();

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Nuevo Participante
      </h1>

      <Formularios />

      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Volver
      </button>

    </div>

  );
}