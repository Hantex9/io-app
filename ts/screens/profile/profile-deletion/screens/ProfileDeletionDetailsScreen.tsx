import React from "react";

import { H1 } from "../../../../components/core/typography/H1";
import TopScreenComponent from "../../../../components/screens/TopScreenComponent";
import I18n from "../../../../i18n";
import { emptyContextualHelp } from "../../../../utils/emptyContextualHelp";

const screenTitle = I18n.t("profile.main.title");

const ProfileDeletionDetailsScreen = () => (
  <TopScreenComponent
    accessibilityLabel={screenTitle}
    headerTitle={screenTitle}
    contextualHelp={emptyContextualHelp}
  >
    <H1>TEST</H1>
  </TopScreenComponent>
);

export default ProfileDeletionDetailsScreen;
