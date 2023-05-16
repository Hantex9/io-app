import { ActionType, createAsyncAction } from "typesafe-actions";
import { InitializedProfile } from "../../../definitions/backend/InitializedProfile";
import { NetworkError } from "../../utils/errors";

export const loadNewProfile = createAsyncAction(
  "NEW_PROFILE_LOAD_REQUEST",
  "NEW_PROFILE_LOAD_SUCCESS",
  "NEW_PROFILE_LOAD_FAILURE"
)<void, InitializedProfile, NetworkError>();

export type NewProfileActions = ActionType<typeof loadNewProfile>;
