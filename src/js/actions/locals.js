import { LOCAL_ACTION, NEW_MODEL, UPDATE_MODEL, EDIT_MODEL, CLEAR_MODEL } from '../middleware/locals';


export function newLocalModel(schema, type, attributes = {}) {
  return {
    [LOCAL_ACTION]: {
      method: NEW_MODEL,
      type,
      schema,
      attributes,
    },
  };
}

export function updateLocalModel(schema, type, attributes) {
  return {
    [LOCAL_ACTION]: {
      method: UPDATE_MODEL,
      type,
      schema,
      attributes,
    },
  };
}

export function editModel(schema, type, attributes) {
  return {
    [LOCAL_ACTION]: {
      method: EDIT_MODEL,
      type,
      schema,
      attributes,
    },
  };
}

export function removeLocalModel(schema, type, attributes) {
  return {
    [LOCAL_ACTION]: {
      method: CLEAR_MODEL,
      type,
      schema,
      attributes,
    },
  };
}
