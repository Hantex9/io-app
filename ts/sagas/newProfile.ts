import { call, put, takeLatest } from "typed-redux-saga/macro";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { getGenericError, getNetworkError } from "../utils/errors";

import { BackendClient } from "../api/backend";
import { loadNewProfile } from "../store/actions/newProfile";
import { readablePrivacyReport } from "../utils/reporters";
import I18n from "../i18n";

export function* loadNewProfileSaga(
  getProfile: ReturnType<typeof BackendClient>["getProfile"]
) {
  try {
    const result = yield* call(getProfile, {});
    yield pipe(
      result,
      E.fold(
        error =>
          put(
            loadNewProfile.failure(
              getGenericError(new Error(readablePrivacyReport(error)))
            )
          ),
        response =>
          put(
            response.status === 200
              ? loadNewProfile.success(response.value)
              : loadNewProfile.failure(
                  getGenericError(new Error(I18n.t("profile.errors.load")))
                )
          )
      )
    );
  } catch (e) {
    yield* put(loadNewProfile.failure(getNetworkError(e)));
  }
}

export function* watchLoadNewProfileSaga(
  getProfile: ReturnType<typeof BackendClient>["getProfile"]
) {
  yield* takeLatest(loadNewProfile.request, loadNewProfileSaga, getProfile);
}
