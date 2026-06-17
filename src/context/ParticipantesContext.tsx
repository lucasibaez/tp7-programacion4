import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

import type { ReactNode } from "react";

import { Participante } from "../models/Participante";
import { participantesReducer } from "../reducers/participantesReducer";
import type { Action } from "../reducers/participantesReducer";

import { useAuth } from "./AuthContext";

interface ContextType {
  participantes: Participante[];
  editando: Participante | null;
  dispatch: React.Dispatch<Action>;

  agregar: (p: Participante) => void;
  eliminar: (id: number) => void;
  editar: (p: Participante) => void;
  resetear: () => void;
}

const ParticipantesContext =
  createContext<ContextType | undefined>(undefined);

export const ParticipantesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const { token, user } = useAuth();

  const [state, dispatch] = useReducer(participantesReducer, {
    participantes: [],
    editando: null,
  });

  // ======================================================
  // GET (SOLO SI HAY TOKEN)
  // ======================================================
  useEffect(() => {

    if (!token) return;

    fetch("http://localhost:8000/participantes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error GET");
        return res.json();
      })
      .then((data) =>
        dispatch({
          type: "SET",
          payload: data,
        })
      )
      .catch(console.error);

  }, [token]);

  // ======================================================
  // 🔥 CHECK ADMIN (FRONTEND UI ONLY)
  // ======================================================
  const isAdmin = user?.rol === "ADMIN";

  // ======================================================
  // AGREGAR (ADMIN ONLY)
  // ======================================================
  const agregar = (p: Participante) => {

    if (!token || !isAdmin) return;

    fetch("http://localhost:8000/participantes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(p),
    })
      .then((res) => res.json())
      .then((nuevo) =>
        dispatch({
          type: "AGREGAR",
          payload: nuevo,
        })
      );
  };

  // ======================================================
  // ELIMINAR (ADMIN ONLY)
  // ======================================================
  const eliminar = (id: number) => {

    if (!token || !isAdmin) return;

    fetch(`http://localhost:8000/participantes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() =>
      dispatch({
        type: "ELIMINAR",
        payload: id,
      })
    );
  };

  // ======================================================
  // EDITAR (ADMIN ONLY)
  // ======================================================
  const editar = (p: Participante) => {

    if (!token || !isAdmin) return;

    fetch(`http://localhost:8000/participantes/${p.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(p),
    })
      .then((res) => res.json())
      .then((actualizado) =>
        dispatch({
          type: "EDITAR",
          payload: actualizado,
        })
      );
  };

  // ======================================================
  // RESET LOCAL STATE
  // ======================================================
  const resetear = () => {
    dispatch({
      type: "RESET",
      payload: [],
    });
  };

  return (
    <ParticipantesContext.Provider
      value={{
        participantes: state.participantes,
        editando: state.editando,
        dispatch,
        agregar,
        eliminar,
        editar,
        resetear,
      }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
};

export const useParticipantes = () => {
  const context = useContext(ParticipantesContext);

  if (!context) {
    throw new Error("Error de contexto");
  }

  return context;
};