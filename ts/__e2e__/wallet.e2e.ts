import { device } from "detox";

import I18n from "../i18n";
import { e2eWaitRenderTimeout } from "./config";
import { ensureLoggedIn } from "./utils";

const CGN_BONUS_ITEM =
  "Carta Giovani Nazionale (CGN) è l’incentivo per i giovani che favorisce la partecipazione ad attività culturali, sportive e ricreative, su tutto il territorio nazionale";

describe("Wallet Screen", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await ensureLoggedIn();
  });

  describe("when the user adds a a new payment method", () => {
    it("should be able to add PagoBANCOMAT as new payment method", async () => {
      await openTabWallet();

      await waitToExistAndTapElement(
        by.text(I18n.t("global.buttons.add").toUpperCase())
      );
      await waitToExistAndTapElement(by.text(I18n.t("wallet.paymentMethod")));

      await waitToExistAndTapElement(
        by.text(I18n.t("wallet.methods.pagobancomat.name"))
      );

      await waitToExistAndTapElement(
        by.text(I18n.t("global.buttons.continue"))
      );

      await waitToExistAndTapElement(by.text(I18n.t("global.buttons.add")));

      const walletMainLabel = element(by.text(I18n.t("wallet.wallet")));
      await waitFor(walletMainLabel)
        .toExist()
        .withTimeout(e2eWaitRenderTimeout);
    });
  });

  describe("when the user adds a new bonus or discount", () => {
    it("should be able to add the CGN card", async () => {
      await openTabWallet();

      await waitToExistAndTapElement(
        by.text(I18n.t("global.buttons.add").toUpperCase())
      );

      await waitToExistAndTapElement(
        by.text(I18n.t("wallet.methods.bonus.name"))
      );

      await waitToExistAndTapElement(by.text(CGN_BONUS_ITEM));

      await waitToBeVisibleAndTapElement(
        by.text(I18n.t("bonus.cgn.cta.activeBonus"))
      );

      await waitToBeVisibleAndTapElement(
        by.text(I18n.t("bonus.cgn.cta.goToDetail"))
      );
    });
  });
});

const openTabWallet = async () => {
  const walletTabButton = element(by.text(I18n.t("global.navigator.wallet")));
  await waitFor(walletTabButton)
    .toBeVisible()
    .withTimeout(e2eWaitRenderTimeout);
  await walletTabButton.tap();
};

const waitToExistAndTapElement = async (matcher: Detox.NativeMatcher) => {
  const touchableElement = element(matcher);
  await waitFor(touchableElement).toExist().withTimeout(e2eWaitRenderTimeout);
  await touchableElement.tap();
  return touchableElement;
};

const waitToBeVisibleAndTapElement = async (matcher: Detox.NativeMatcher) => {
  const touchableElement = element(matcher);
  await waitFor(touchableElement)
    .toBeVisible()
    .withTimeout(e2eWaitRenderTimeout);
  await touchableElement.tap();
  return touchableElement;
};
