import { Participante } from "../models/Participante";

export type State = {
  participantes: Participante[];
  editando: Participante | null;
};

export type Action =
  | { type: "SET"; payload: Participante[] }
  | { type: "AGREGAR"; payload: Participante }
  | { type: "ELIMINAR"; payload: number }
  | { type: "EDITAR"; payload: Participante }
  | { type: "SET_EDITANDO"; payload: Participante | null }
  | { type: "RESET"; payload: Participante[] };

export const participantesReducer = (
  state: State,
  action: Action
): State => {
  switch (action.type) {
    case "SET":
      return { ...state, participantes: action.payload };

    case "AGREGAR":
      return {
        ...state,
        participantes: [...state.participantes, action.payload],
      };

    case "ELIMINAR":
      return {
        ...state,
        participantes: state.participantes.filter(
          (p) => p.id !== action.payload
        ),
      };

    case "EDITAR":
      return {
        ...state,
        participantes: state.participantes.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        editando: null,
      };

    case "SET_EDITANDO":
      return {
        ...state,
        editando: action.payload,
      };

    case "RESET":
      return { participantes: [], editando: null };

    default:
      return state;
  }
};