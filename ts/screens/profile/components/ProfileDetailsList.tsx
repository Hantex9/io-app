import React, { FC } from "react";
import * as pot from "@pagopa/ts-commons/lib/pot";

import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";
import ListItemComponent from "../../../components/screens/ListItemComponent";
import I18n from "../../../i18n";

import NameSurnameIcon from "../../../../img/assistance/nameSurname.svg";
import FiscalCodeIcon from "../../../../img/assistance/card.svg";
import EmailIcon from "../../../../img/assistance/email.svg";
import { getPrintableValueFromPot } from "../../../utils/pot";
import { NewProfileState } from "../../../store/reducers/newProfile";
import { LoadingErrorComponent } from "../../../features/bonus/bonusVacanze/components/loadingErrorScreen/LoadingErrorComponent";

type Props = {
  profile: NewProfileState;
};

const ProfileDetailsList: FC<Props> = ({ profile }) => {
  /**
   * Wrapper function of `getPrintableValueFromPot` to get the value from the pot with a fallback value
   */
  const getValueFromProfilePot = (key: keyof InitializedProfile) =>
    getPrintableValueFromPot(
      profile,
      key,
      I18n.t("global.remoteStates.notAvailable")
    );

  const LoadingDetailItem = () => (
    <LoadingErrorComponent
      isLoading
      loadingCaption={I18n.t("global.remoteStates.loading")}
      onRetry={() => null}
    />
  );

  const ProfileData = () => (
    <>
      <ListItemComponent
        title={I18n.t("profile.data.list.nameSurname")}
        subTitle={`${getValueFromProfilePot("name")} ${getValueFromProfilePot(
          "family_name"
        )}`}
        leftIcon={NameSurnameIcon}
        hideIcon
        testID="nameSurname"
      />
      <ListItemComponent
        title={I18n.t("profile.data.list.fiscalCode")}
        subTitle={getValueFromProfilePot("fiscal_code")}
        leftIcon={FiscalCodeIcon}
        hideIcon
        testID="fiscalCode"
      />
      <ListItemComponent
        title={I18n.t("profile.data.list.email")}
        subTitle={getValueFromProfilePot("email")}
        leftIcon={EmailIcon}
        hideIcon
        testID="email"
      />
    </>
  );

  const ProfileDetailsContent = () =>
    pot.fold(
      profile,
      () => <LoadingDetailItem />, // foldNone
      () => <LoadingDetailItem />, // foldNoneLoading
      () => <LoadingDetailItem />, // foldNoneUpdating
      () => <LoadingDetailItem />, // foldNoneError
      () => <ProfileData />, // foldSome
      () => <LoadingDetailItem />, // foldSomeLoading
      () => <LoadingDetailItem />, // foldSomeUpdating
      () => <LoadingDetailItem /> // foldSomeError
    );

  return <ProfileDetailsContent />;
};

export default ProfileDetailsList;
