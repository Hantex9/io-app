import React, { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { IOStyles } from "../../../../components/core/variables/IOStyles";
import { InfoScreenComponent } from "../../../../components/infoScreen/InfoScreenComponent";
import FooterWithButtons from "../../../../components/ui/FooterWithButtons";
import I18n from "../../../../i18n";
import { Pictogram } from "../../../../components/core/pictograms";
import { cancelButtonProps } from "../../../../features/bonus/bonusVacanze/components/buttons/ButtonConfigurations";

type Props = {
  onPressBack?: () => void;
};

/**
 * A View that is shown when the user has successfully completed the reqest of profile deletion
 */
const ProfileDeletionThankYouView: FC<Props> = ({ onPressBack }) => {
  const cancelButton = cancelButtonProps(
    () => onPressBack?.(), // onPress
    I18n.t("global.buttons.close"), // title
    undefined, // iconName
    "ThankYouPageDeletionCloseButton" // testID
  );
  return (
    <SafeAreaView
      style={IOStyles.flex}
      edges={["bottom", "left", "right"]}
      testID={"ProfileDeletionThankYouViewTestID"}
    >
      <InfoScreenComponent
        image={<Pictogram name="completed" />}
        title={I18n.t("profile.delete.thankYouPage.title")}
        body={I18n.t("profile.delete.thankYouPage.content")}
      />
      <FooterWithButtons type={"SingleButton"} leftButton={cancelButton} />
    </SafeAreaView>
  );
};

export default ProfileDeletionThankYouView;
