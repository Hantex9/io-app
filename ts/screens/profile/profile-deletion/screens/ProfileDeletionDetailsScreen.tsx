import React, { useLayoutEffect, useMemo } from "react";
import { View } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { constUndefined } from "fp-ts/lib/function";
import * as pot from "@pagopa/ts-commons/lib/pot";

import I18n from "../../../../i18n";
import { emptyContextualHelp } from "../../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../../components/core/variables/IOStyles";
import ScreenContent from "../../../../components/screens/ScreenContent";
import FooterWithButtons from "../../../../components/ui/FooterWithButtons";
import {
  cancelButtonProps,
  confirmButtonProps
} from "../../../../features/bonus/bonusVacanze/components/buttons/ButtonConfigurations";
import ProfileDetailsList from "../../components/ProfileDetailsList";
import { useIOSelector } from "../../../../store/hooks";
import { newProfileSelector } from "../../../../store/reducers/newProfile";
import { useOnFirstRender } from "../../../../utils/hooks/useOnFirstRender";
import { loadNewProfile } from "../../../../store/actions/newProfile";
import { isUserDataProcessingDeleteSelector } from "../../../../store/reducers/userDataProcessing";
import {
  resetUserDataProcessingRequest,
  upsertUserDataProcessing
} from "../../../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../../../definitions/backend/UserDataProcessingChoice";
import { LoadingErrorComponent } from "../../../../features/bonus/bonusVacanze/components/loadingErrorScreen/LoadingErrorComponent";
import ProfileDeletionThankYouView from "../components/ProfileDeletionThankYouView";
import { useHardwareBackButton } from "../../../../hooks/useHardwareBackButton";

const ProfileDeletionDetailsScreen = () => {
  const screenTitle = I18n.t("profile.delete.title");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const newProfilePot = useIOSelector(newProfileSelector);
  const isUserDataProcessingDeletePot = useIOSelector(
    isUserDataProcessingDeleteSelector
  );

  // Memoized values to track the loading and error state of the pots
  const isLoading = useMemo(
    () =>
      pot.isLoading(newProfilePot) ||
      pot.isLoading(isUserDataProcessingDeletePot) ||
      pot.isUpdating(isUserDataProcessingDeletePot),
    [newProfilePot, isUserDataProcessingDeletePot]
  );
  const isError = useMemo(
    () =>
      pot.isError(newProfilePot) || pot.isError(isUserDataProcessingDeletePot),
    [newProfilePot, isUserDataProcessingDeletePot]
  );

  const isRequestCompleted = useMemo(
    () => pot.getOrElse(isUserDataProcessingDeletePot, false),
    [isUserDataProcessingDeletePot]
  );

  useOnFirstRender(() => {
    // Don't load the profile if it is already loaded
    if (!pot.isSome(newProfilePot)) {
      dispatch(loadNewProfile.request());
    }
    // Reset the request state if the user has already requested but was in error
    if (pot.isError(isUserDataProcessingDeletePot)) {
      dispatch(
        resetUserDataProcessingRequest(UserDataProcessingChoiceEnum.DELETE)
      );
    }
  });

  useLayoutEffect(() => {
    // If the request is completed or is in error we don't want that the user can go back to the previous screen through the swipe gesture
    if (isRequestCompleted || isError) {
      navigation.setOptions({
        gestureEnabled: false
      });
    }
  }, [isRequestCompleted, isError, navigation]);

  useHardwareBackButton(() => {
    // If the request is completed or is in error, when is pressed the hardware back button we want to dismiss the screen to the root
    if (isRequestCompleted || isError) {
      handleGoBack();
    }
    return true;
  });

  const confirmDeletion = () => {
    dispatch(
      upsertUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    );
  };

  const handleGoBack = () => {
    navigation.dispatch(StackActions.popToTop());
    navigation.goBack();
  };

  const cancelButton = cancelButtonProps(
    handleGoBack,
    I18n.t("global.buttons.cancel")
  );

  const confirmButton = confirmButtonProps(
    confirmDeletion, // onPress
    I18n.t("global.buttons.confirm"), // title
    constUndefined(), // iconName
    "confimDeletionTestID", // testID
    isLoading // disabled
  );

  const LoadingView = () => (
    <LoadingErrorComponent
      isLoading
      loadingCaption={I18n.t("global.remoteStates.loading")}
      onRetry={() => null}
      testID="loadingView"
    />
  );

  const ErrorView = () => (
    <LoadingErrorComponent
      onRetry={confirmDeletion}
      isLoading={false}
      onAbort={handleGoBack}
      loadingCaption={I18n.t("profile.delete.error.description")}
      errorText={I18n.t("profile.delete.error.description")}
      testID="errorView"
    />
  );

  /**
   * Content of the screen showing the profile details
   */
  const ProfileDeletionContentDetails = () => (
    <BaseScreenComponent
      accessibilityLabel={screenTitle}
      headerTitle={screenTitle}
      goBack
      contextualHelp={emptyContextualHelp}
    >
      <SafeAreaView style={IOStyles.flex} edges={["bottom", "left", "right"]}>
        <ScreenContent
          title={I18n.t("profile.delete.details.title")}
          subtitle={I18n.t("profile.delete.details.subtitle")}
        >
          <View
            style={IOStyles.horizontalContentPadding}
            testID="profileDetailsView"
          >
            <ProfileDetailsList profile={newProfilePot} />
          </View>
        </ScreenContent>
        <FooterWithButtons
          type="TwoButtonsInlineHalf"
          leftButton={cancelButton}
          rightButton={confirmButton}
        />
      </SafeAreaView>
    </BaseScreenComponent>
  );

  const ContentView = () =>
    isError ? (
      <ErrorView />
    ) : isLoading ? (
      <LoadingView />
    ) : isRequestCompleted ? (
      <ProfileDeletionThankYouView onPressBack={handleGoBack} />
    ) : (
      <ProfileDeletionContentDetails />
    );

  return <ContentView />;
};

export default ProfileDeletionDetailsScreen;
