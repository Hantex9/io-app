import { device } from "detox";
import I18n from "../../../i18n";
import { e2eWaitRenderTimeout } from "../../../__e2e__/config";
import { ensureLoggedIn } from "../../../__e2e__/utils";

const euCovidCertExpiredSubject = "🏥 EUCovidCert - expired";
const euCovidCertExpiredTitle = "Expired Certificate title";
const euCovidCertExpiredSubTitle = "Expired Certificate sub title";

const messageListTestId = "messageList";
const learnMoreLinkTestId = "euCovidCertLearnMoreLink";

describe("EuCovidCert Expired", () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await ensureLoggedIn();
  });

  it("should load all the messages", async () => {
    await waitFor(element(by.text(I18n.t("messages.contentTitle"))))
      .toBeVisible()
      .withTimeout(e2eWaitRenderTimeout);

    await waitFor(element(by.id(`MessageListItem_00000000000000000000000021`)))
      .toBeVisible()
      .withTimeout(e2eWaitRenderTimeout);

    await waitFor(element(by.id(`MessageListItem_00000000000000000000000001`)))
      .toExist()
      .withTimeout(e2eWaitRenderTimeout);
  });

  it("should find the expired EuCovidCert message and open it", async () => {
    await waitFor(element(by.text(euCovidCertExpiredSubject)))
      .toBeVisible()
      .whileElement(by.id(messageListTestId))
      .scroll(350, "down");

    const subject = element(by.text(euCovidCertExpiredSubject));
    await subject.tap();
  });

  it("should check all the correct elements in the details page", async () => {
    await waitFor(element(by.text(euCovidCertExpiredTitle)))
      .toBeVisible()
      .withTimeout(e2eWaitRenderTimeout);

    await waitFor(element(by.text(euCovidCertExpiredSubTitle)))
      .toBeVisible()
      .withTimeout(e2eWaitRenderTimeout);

    await waitFor(element(by.id(learnMoreLinkTestId)))
      .toBeVisible()
      .withTimeout(e2eWaitRenderTimeout);
  });
});