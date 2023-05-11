import * as pot from "@pagopa/ts-commons/lib/pot";
import { getType } from "typesafe-actions";

import { InitializedProfile } from "../../../definitions/backend/InitializedProfile";
import { Action } from "../actions/types";
import { loadNewProfile } from "../actions/newProfile";
import { NetworkError } from "../../utils/errors";
import { GlobalState } from "./types";

export type NewProfileState = pot.Pot<InitializedProfile, NetworkError>;

const INITIAL_STATE: NewProfileState = pot.none;

export const newProfileSelector = (state: GlobalState): NewProfileState =>
  state.newProfile;

const reducer = (
  state: NewProfileState = INITIAL_STATE,
  action: Action
): NewProfileState => {
  switch (action.type) {
    case getType(loadNewProfile.request):
      return pot.toLoading(state);
    case getType(loadNewProfile.success):
      return pot.some(action.payload);
    case getType(loadNewProfile.failure):
      return pot.toError(state, action.payload);
    default:
      return state;
  }
};

export default reducer;
