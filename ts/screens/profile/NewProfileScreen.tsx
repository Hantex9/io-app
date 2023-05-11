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
          {/* Show name and surname */}
          <ListItemComponent
            title={I18n.t("profile.data.list.nameSurname")}
            subTitle={"WIP"} // TODO: Add the name and surnmame from the retrieved profile data
            hideIcon
            testID="name-surname"
          />
          <ListItemComponent
            title={I18n.t("profile.data.list.fiscalCode")}
            subTitle={"WIP"} // TODO: Add the fiscalCode from the retrieved profile data
            hideIcon
            testID="name-surname"
          />
          <ListItemComponent
            title={I18n.t("profile.data.list.email")}
            subTitle={"WIP"} // TODO: Add the email from the retrieved profile data
            hideIcon
            testID="name-surname"
          />
        </NBList>
      </ScreenContent>
    </TopScreenComponent>
  );
};

export default NewProfileScreen;
