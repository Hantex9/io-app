import * as pot from "@pagopa/ts-commons/lib/pot";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { createSelector } from "reselect";
import { getType } from "typesafe-actions";
import { UserDataProcessingStatusEnum } from "../../../definitions/backend/UserDataProcessingStatus";
import { UserDataProcessing } from "../../../definitions/backend/UserDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../definitions/backend/UserDataProcessingChoice";
import { computedProp } from "../../types/utils";
import { clearCache } from "../actions/profile";
import { Action } from "../actions/types";
import {
  deleteUserDataProcessing,
  loadUserDataProcessing,
  resetUserDataProcessingRequest,
  upsertUserDataProcessing
} from "../actions/userDataProcessing";
import { GlobalState } from "./types";

export type UserDataProcessingState = {
  [key in keyof typeof UserDataProcessingChoiceEnum]: pot.Pot<
    UserDataProcessing | undefined,
    Error
  >;
};

// TODO: integrate with profile while it will be a profile attribute

export const INITIAL_STATE: UserDataProcessingState = {
  [UserDataProcessingChoiceEnum.DOWNLOAD]: pot.none,
  [UserDataProcessingChoiceEnum.DELETE]: pot.none
};

const userDataProcessingReducer = (
  state: UserDataProcessingState = INITIAL_STATE,
  action: Action
): UserDataProcessingState => {
  switch (action.type) {
    case getType(loadUserDataProcessing.request): {
      return {
        ...state,
        ...computedProp(action.payload, pot.toLoading(state[action.payload]))
      };
    }
    case getType(loadUserDataProcessing.success): {
      return {
        ...state,
        ...computedProp(action.payload.choice, pot.some(action.payload.value))
      };
    }

    case getType(deleteUserDataProcessing.failure):
    case getType(upsertUserDataProcessing.failure):
    case getType(loadUserDataProcessing.failure):
      return {
        ...state,
        ...computedProp(
          action.payload.choice,
          pot.toError({ ...state[action.payload.choice] }, action.payload.error)
        )
      };

    case getType(deleteUserDataProcessing.request):
    case getType(upsertUserDataProcessing.request): {
      const maybeValue = state[action.payload];
      const prevValue = pot.isSome(maybeValue) ? maybeValue.value : undefined;

      return {
        ...state,
        ...computedProp(
          action.payload,
          pot.toUpdating(state[action.payload], prevValue)
        )
      };
    }
    case getType(upsertUserDataProcessing.success): {
      return {
        ...state,
        ...computedProp(action.payload.choice, pot.some(action.payload))
      };
    }
    case getType(resetUserDataProcessingRequest): {
      return {
        ...state,
        ...computedProp(action.payload, pot.none)
      };
    }

    case getType(clearCache):
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default userDataProcessingReducer;

// Selectors
export const userDataProcessingSelector = (state: GlobalState) =>
  state.userDataProcessing;

export const isUserDataProcessingDeleteSelector = createSelector(
  [userDataProcessingSelector],
  (userDataProcessing): pot.Pot<boolean, Error> =>
    pot.map(userDataProcessing.DELETE, userDataProcessingDelete =>
      pipe(
        userDataProcessingDelete,
        O.fromNullable,
        O.fold(
          () => false,
          dataProcessing =>
            dataProcessing.status === UserDataProcessingStatusEnum.PENDING
        )
      )
    )
);
