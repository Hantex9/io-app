import React from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
import ROUTES from "../../../../navigation/routes";

const ProfileDeletionDetailsScreen = () => {
  const navigation = useNavigation();

  const screenTitle = I18n.t("profile.delete.title");

  const cancelButton = cancelButtonProps(() => {
    navigation.dispatch(StackActions.popToTop());
    navigation.goBack();
  }, I18n.t("global.buttons.cancel"));

  const confirmButton = confirmButtonProps(
    () => navigation.navigate(ROUTES.NEW_PROFILE_MAIN),
    I18n.t("global.buttons.continue")
  );

  return (
    <LoadingSpinnerOverlay isLoading={false}>
      <BaseScreenComponent
        accessibilityLabel={screenTitle}
        headerTitle={screenTitle}
        goBack
        contextualHelp={emptyContextualHelp}
      >
        <SafeAreaView style={IOStyles.flex} edges={["bottom", "left", "right"]}>
          {/* <View style={IOStyles.horizontalContentPadding}>
        <InfoBox
        iconName={"io-warning"}
        iconColor={IOColors["warning-500"]}
        >
        <H4>{I18n.t("global.genericAlert")}</H4>
        <Body>{I18n.t("profile.delete.main.description")}</Body>
        </InfoBox>
        </View>
      </ScreenContent> */}
          <ScreenContent
            title={I18n.t("profile.delete.main.title")}
          ></ScreenContent>
          <FooterWithButtons
            type="TwoButtonsInlineHalf"
            leftButton={cancelButton}
            rightButton={confirmButton}
          />
        </SafeAreaView>
      </BaseScreenComponent>
    </LoadingSpinnerOverlay>
  );
};

export default ProfileDeletionDetailsScreen;
