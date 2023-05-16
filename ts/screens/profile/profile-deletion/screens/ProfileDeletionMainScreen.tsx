import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";

import I18n from "../../../../i18n";
import { emptyContextualHelp } from "../../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../../components/screens/BaseScreenComponent";
import FooterWithButtons from "../../../../components/ui/FooterWithButtons";
import {
  cancelButtonProps,
  confirmButtonProps
} from "../../../../features/bonus/bonusVacanze/components/buttons/ButtonConfigurations";
import ScreenContent from "../../../../components/screens/ScreenContent";
import { IOStyles } from "../../../../components/core/variables/IOStyles";
import { InfoBox } from "../../../../components/box/InfoBox";
import { IOColors } from "../../../../components/core/variables/IOColors";
import { Body } from "../../../../components/core/typography/Body";
import { H4 } from "../../../../components/core/typography/H4";
import { ProfileDeletionRoutes } from "../navigation/routes";

const ProfileDeletionMainScreen = () => {
  const navigation = useNavigation();

  const screenTitle = I18n.t("profile.delete.title");

  const cancelButton = cancelButtonProps(
    () => navigation.goBack(),
    I18n.t("global.buttons.cancel")
  );

  const confirmButton = confirmButtonProps(
    () => navigation.navigate(ProfileDeletionRoutes.PROFILE_DELETION_DETAILS),
    I18n.t("global.buttons.continue")
  );

  return (
    <BaseScreenComponent
      accessibilityLabel={screenTitle}
      headerTitle={screenTitle}
      goBack
      contextualHelp={emptyContextualHelp}
    >
      <SafeAreaView style={IOStyles.flex} edges={["bottom", "left", "right"]}>
        <ScreenContent title={I18n.t("profile.delete.main.title")}>
          <View style={IOStyles.horizontalContentPadding}>
            <InfoBox
              iconName={"io-warning"}
              iconColor={IOColors["warning-500"]}
            >
              <H4>{I18n.t("global.genericAlert")}</H4>
              <Body>{I18n.t("profile.delete.main.description")}</Body>
            </InfoBox>
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
};

export default ProfileDeletionMainScreen;
