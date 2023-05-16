import React from "react";
import { View } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as pot from "@pagopa/ts-commons/lib/pot";

import I18n from "../../../../i18n";
import { emptyContextualHelp } from "../../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../../components/core/variables/IOStyles";
import ScreenContent from "../../../../components/screens/ScreenContent";
import FooterWithButtons from "../../../../components/ui/FooterWithButtons";
import LoadingSpinnerOverlay from "../../../../components/LoadingSpinnerOverlay";
import {
  cancelButtonProps,
  confirmButtonProps
} from "../../../../features/bonus/bonusVacanze/components/buttons/ButtonConfigurations";
import ProfileDetailsList from "../../components/ProfileDetailsList";
import { useIOSelector } from "../../../../store/hooks";
import { newProfileSelector } from "../../../../store/reducers/newProfile";
import { useOnFirstRender } from "../../../../utils/hooks/useOnFirstRender";
import { loadNewProfile } from "../../../../store/actions/newProfile";

const ProfileDeletionDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const newProfilePot = useIOSelector(newProfileSelector);
  const isLoading = pot.isLoading(newProfilePot);
  const screenTitle = I18n.t("profile.delete.title");

  useOnFirstRender(() => {
    if (!pot.isSome(newProfilePot)) {
      dispatch(loadNewProfile.request());
    }
  });

  const cancelButton = cancelButtonProps(() => {
    navigation.dispatch(StackActions.popToTop());
    navigation.goBack();
  }, I18n.t("global.buttons.cancel"));

  const confirmButton = confirmButtonProps(
    () => null, // onPress
    I18n.t("global.buttons.confirm"), // title
    undefined, // iconName
    "confirmDeletion", // testID
    isLoading // disabled
  );

  const ProfileDeletionContent = () => (
    <SafeAreaView style={IOStyles.flex} edges={["bottom", "left", "right"]}>
      <ScreenContent
        title={"Riepilogo dati"}
        subtitle="Sei sicuro di voler eliminare il tuo profilo?"
      >
        <View style={IOStyles.horizontalContentPadding}>
          <ProfileDetailsList profile={newProfilePot} />
        </View>
      </ScreenContent>
      <FooterWithButtons
        type="TwoButtonsInlineHalf"
        leftButton={cancelButton}
        rightButton={confirmButton}
      />
    </SafeAreaView>
  );

  return (
    <LoadingSpinnerOverlay isLoading={isLoading}>
      <BaseScreenComponent
        accessibilityLabel={screenTitle}
        headerTitle={screenTitle}
        goBack
        contextualHelp={emptyContextualHelp}
      >
        <ProfileDeletionContent />
      </BaseScreenComponent>
    </LoadingSpinnerOverlay>
  );
};

export default ProfileDeletionDetailsScreen;
