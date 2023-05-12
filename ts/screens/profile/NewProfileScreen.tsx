import React from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import { List as NBList } from "native-base";
import { useDispatch } from "react-redux";
import * as pot from "@pagopa/ts-commons/lib/pot";

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
import { PreferencesListItem } from "../../components/PreferencesListItem";
import { RemoteSwitch } from "../../components/core/selection/RemoteSwitch";
import { loadUserDataProcessing } from "../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../definitions/backend/UserDataProcessingChoice";
import { isUserDataProcessingDeleteSelector } from "../../store/reducers/userDataProcessing";

const newProfileScreenIconProps: IconProps = {
  name: "io-profilo",
  size: HEADER_ICON_HEIGHT
};

const screenTitle = I18n.t("profile.main.title");

const NewProfileScreen = () => {
  const dispatch = useDispatch();

  const newProfilePot = useIOSelector(newProfileSelector);
  const isUserDataProcessingDeletePot = useIOSelector(
    isUserDataProcessingDeleteSelector
  );

  useOnFirstRender(() => {
    loadProfile();
  });

  /**
   * Function that start fetch the profile informations
   */
  const loadProfile = () => {
    dispatch(loadNewProfile.request());
    dispatch(
      loadUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    );
  };

  /**
   * Wrapper function of `getPrintableValueFromPot` to get the value from the pot with a fallback value
   */
  const getValueFromNewProfilePot = (value: keyof InitializedProfile) =>
    getPrintableValueFromPot(
      newProfilePot,
      value,
      I18n.t("global.remoteStates.notAvailable")
    );

  /**
   * Wrapper component to show the loading view
   */
  const LoadingView = () => (
    <LoadingErrorComponent
      isLoading
      loadingCaption={I18n.t("global.remoteStates.loading")}
      onRetry={() => null}
    />
  );

  /**
   * Wrapper component to show the error view with the retry button to reload the profile
   */
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
          testID="email"
        />
        <PreferencesListItem
          title={I18n.t("profile.data.deletion.title")}
          description={I18n.t("profile.data.deletion.description")}
          rightElement={<RemoteSwitch value={isUserDataProcessingDeletePot} />}
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
