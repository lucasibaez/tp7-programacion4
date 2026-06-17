import { useEffect } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Formularios from "../components/Formularios";

import { useParticipantes } from "../context/ParticipantesContext";

export default function EditarPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    participantes,
    dispatch,
  } = useParticipantes();

  useEffect(() => {

    const participante = participantes.find(
      (p) => p.id === Number(id)
    );

    if (participante) {

      dispatch({
        type: "SET_EDITANDO",
        payload: participante,
      });

    }

  }, [id, participantes]);

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Editar Participante
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