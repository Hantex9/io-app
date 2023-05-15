import React from "react";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import { IconProps } from "react-native-vector-icons/Icon";
import { useDispatch } from "react-redux";
import * as pot from "@pagopa/ts-commons/lib/pot";

import { emptyContextualHelp } from "../../utils/emptyContextualHelp";
import ScreenContent from "../../components/screens/ScreenContent";
import I18n from "../../i18n";
import TopScreenComponent from "../../components/screens/TopScreenComponent";
import { HEADER_ICON_HEIGHT } from "../../utils/constants";
import { useOnFirstRender } from "../../utils/hooks/useOnFirstRender";

import { loadNewProfile } from "../../store/actions/newProfile";
import { newProfileSelector } from "../../store/reducers/newProfile";
import { LoadingErrorComponent } from "../../features/bonus/bonusVacanze/components/loadingErrorScreen/LoadingErrorComponent";
import GenericErrorComponent from "../../components/screens/GenericErrorComponent";
import { useIOSelector } from "../../store/hooks";
import { PreferencesListItem } from "../../components/PreferencesListItem";
import { RemoteSwitch } from "../../components/core/selection/RemoteSwitch";
import { loadUserDataProcessing } from "../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../definitions/backend/UserDataProcessingChoice";
import { isUserDataProcessingDeleteSelector } from "../../store/reducers/userDataProcessing";
import { IOStyles } from "../../components/core/variables/IOStyles";
import { ProfileDeletionRoutes } from "./profile-deletion/navigation/routes";
import { ProfileDeletionParamsList } from "./profile-deletion/navigation/params";
import ProfileDetailsList from "./components/ProfileDetailsList";

const newProfileScreenIconProps: IconProps = {
  name: "io-profilo",
  size: HEADER_ICON_HEIGHT
};

const screenTitle = I18n.t("profile.main.title");

const NewProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<StackNavigationProp<ProfileDeletionParamsList>>();

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

  const handleSwitchValueChange = (value: boolean) => {
    if (value) {
      navigation.navigate(ProfileDeletionRoutes.PROFILE_DELETION_MAIN);
    }
  };

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
      <View style={IOStyles.horizontalContentPadding}>
        <ProfileDetailsList profile={newProfilePot} />
        <PreferencesListItem
          title={I18n.t("profile.data.deletion.title")}
          description={I18n.t("profile.data.deletion.description")}
          rightElement={
            <RemoteSwitch
              value={isUserDataProcessingDeletePot}
              onValueChange={handleSwitchValueChange}
            />
          }
        />
      </View>
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
