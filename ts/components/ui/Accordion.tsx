import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as React from "react";
import { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import I18n from "../../i18n";
import customVariables from "../../theme/variables";
import { Body } from "../core/typography/Body";
import { IOStyles } from "../core/variables/IOStyles";
import ItemSeparatorComponent from "../ItemSeparatorComponent";
import TouchableDefaultOpacity from "../TouchableDefaultOpacity";
import IconFont from "./IconFont";
import Markdown from "./Markdown";

type Props = {
  title: string;
  content: string;
  onLinkClicked?: ComponentProps<typeof Markdown>["onLinkClicked"];
  shouldHandleLink?: ComponentProps<typeof Markdown>["shouldHandleLink"];
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: customVariables.spacerHeight
  },
  pad: {
    paddingVertical: customVariables.spacerHeight
  },
  headerIcon: {
    paddingHorizontal: 10,
    alignSelf: "center"
  }
});

/**
 *
 * @param props
 * @constructor
 * @deprecated Please use {@link RawAccordion} or {@link IOAccordion}
 */
const Accordion: React.FunctionComponent<Props> = (props: Props) => {
  const [expanded, setExpanded] = React.useState(false);

  const renderHeader = (title: string) => (
    <TouchableDefaultOpacity
      accessible={true}
      accessibilityRole={"button"}
      accessibilityLabel={
        props.title +
        (expanded
          ? I18n.t("global.accessibility.expanded")
          : I18n.t("global.accessibility.collapsed"))
      }
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.header}>
        <View style={IOStyles.flex}>
          <Body weight="SemiBold">{title}</Body>
        </View>
        <IconFont
          name={"io-right"}
          color={customVariables.brandPrimary}
          size={24}
          style={[
            styles.headerIcon,
            {
              transform: [{ rotateZ: expanded ? "-90deg" : "90deg" }]
            }
          ]}
        />
      </View>
      {!expanded && <ItemSeparatorComponent noPadded={true} />}
    </TouchableDefaultOpacity>
  );

  const renderContent = (content: string) => (
    <View style={styles.pad}>
      <Markdown
        shouldHandleLink={props.shouldHandleLink}
        onLinkClicked={(url: string) => {
          pipe(
            props.onLinkClicked,
            O.fromNullable,
            O.map(s => s(url))
          );
        }}
      >
        {content}
      </Markdown>
    </View>
  );

  return (
    <>
      {renderHeader(props.title)}
      {expanded && renderContent(props.content)}
    </>
  );
};

export default Accordion;
