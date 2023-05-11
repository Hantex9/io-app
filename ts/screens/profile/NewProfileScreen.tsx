import React from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import { List as NBList } from "native-base";

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

const newProfileScreenIconProps: IconProps = {
  name: "io-profilo",
  size: HEADER_ICON_HEIGHT
};

const screenTitle = I18n.t("profile.main.title");

const NewProfileScreen = () => {
  useOnFirstRender(() => {
    // TODO: Invoke the action to fetch the profile data
  });

  return (
    <TopScreenComponent
      accessibilityLabel={screenTitle}
      headerTitle={screenTitle}
      appLogo
      contextualHelp={emptyContextualHelp}
    >
      <ScreenContent iconFont={newProfileScreenIconProps} title={screenTitle}>
        <NBList withContentLateralPadding>
          <ListItemComponent
            title={I18n.t("profile.data.list.nameSurname")}
            subTitle={"WIP"} // TODO: Add the name and surnmame from the retrieved profile data
            leftIcon={NameSurnameIcon}
            hideIcon
            testID="nameSurname"
          />
          <ListItemComponent
            title={I18n.t("profile.data.list.fiscalCode")}
            subTitle={"WIP"} // TODO: Add the fiscalCode from the retrieved profile data
            leftIcon={FiscalCodeIcon}
            hideIcon
            testID="fiscalCode"
          />
          <ListItemComponent
            title={I18n.t("profile.data.list.email")}
            subTitle={"WIP"} // TODO: Add the email from the retrieved profile data
            leftIcon={EmailIcon}
            hideIcon
            isLastItem
            testID="email"
          />
        </NBList>
      </ScreenContent>
    </TopScreenComponent>
  );
};

export default NewProfileScreen;
