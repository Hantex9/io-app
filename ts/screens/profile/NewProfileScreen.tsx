import React from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import { List as NBList } from "native-base";
import { useDispatch } from "react-redux";
import * as pot from "@pagopa/ts-commons/lib/pot";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";

import { emptyContextualHelp } from "../../utils/emptyContextualHelp";
import ScreenContent from "../../components/screens/ScreenContent";
import I18n from "../../i18n";
import TopScreenComponent from "../../components/screens/TopScreenComponent";
import { HEADER_ICON_HEIGHT } from "../../utils/constants";
import { useOnFirstRender } from "../../utils/hooks/useOnFirstRender";
import ListItemComponent from "../../components/screens/ListItemComponent";

import NameSurnameIcon from "../../../img/assistance/nameSurname.svg";
import FiscalCodeIcon from "../../../img/assistance/card.svg";
import EmailIcon from "../../../img/assistance/email.svg";
import { loadNewProfile } from "../../store/actions/newProfile";
import { newProfileSelector } from "../../store/reducers/newProfile";
import { LoadingErrorComponent } from "../../features/bonus/bonusVacanze/components/loadingErrorScreen/LoadingErrorComponent";
import GenericErrorComponent from "../../components/screens/GenericErrorComponent";
import { useIOSelector } from "../../store/hooks";
import { InitializedProfile } from "../../../definitions/backend/InitializedProfile";
import { getPrintableValueFromPot } from "../../utils/pot";

const newProfileScreenIconProps: IconProps = {
  name: "io-profilo",
  size: HEADER_ICON_HEIGHT
};

const screenTitle = I18n.t("profile.main.title");

const NewProfileScreen = () => {
  const dispatch = useDispatch();

  const newProfilePot = useIOSelector(newProfileSelector);

  useOnFirstRender(() => {
    loadProfile();
  });

  const loadProfile = () => {
    dispatch(loadNewProfile.request());
  };

  const getValueFromNewProfilePot = (value: keyof InitializedProfile) =>
    getPrintableValueFromPot(
      newProfilePot,
      value,
      I18n.t("global.remoteStates.notAvailable")
    );

  const LoadingView = () => (
    <LoadingErrorComponent
      isLoading
      loadingCaption={I18n.t("global.remoteStates.loading")}
      onRetry={() => null}
    />
  );

  const ErrorView = () => (
    <GenericErrorComponent onRetry={() => loadProfile()} />
  );

  const ProfileContentView = () => (
    <ScreenContent iconFont={newProfileScreenIconProps} title={screenTitle}>
      <NBList withContentLateralPadding>
        <ListItemComponent
          title={I18n.t("profile.data.list.nameSurname")}
          subTitle={`${getValueFromNewProfilePot(
            "name"
          )} ${getValueFromNewProfilePot("family_name")}`}
          leftIcon={NameSurnameIcon}
          hideIcon
          testID="nameSurname"
        />
        <ListItemComponent
          title={I18n.t("profile.data.list.fiscalCode")}
          subTitle={getValueFromNewProfilePot("fiscal_code")}
          leftIcon={FiscalCodeIcon}
          hideIcon
          testID="fiscalCode"
        />
        <ListItemComponent
          title={I18n.t("profile.data.list.email")}
          subTitle={getValueFromNewProfilePot("email")}
          leftIcon={EmailIcon}
          hideIcon
          isLastItem
          testID="email"
        />
      </NBList>
    </ScreenContent>
  );

  const NewProfileContentBody = () =>
    pot.fold(
      newProfilePot,
      () => <LoadingView />, // foldNone
      () => <LoadingView />, // foldNoneLoading
      () => <LoadingView />, // foldNoneUpdating
      () => <ErrorView />, // foldNoneError
      () => <ProfileContentView />, // foldSome
      () => <LoadingView />, // foldSomeLoading
      () => <LoadingView />, // foldSomeUpdating
      () => <ErrorView /> // foldSomeError
    );

  return (
    <TopScreenComponent
      accessibilityLabel={screenTitle}
      headerTitle={screenTitle}
      appLogo
      contextualHelp={emptyContextualHelp}
    >
      <NewProfileContentBody />
    </TopScreenComponent>
  );
};

export default NewProfileScreen;
