import * as React from "react";
import { useCallback } from "react";
import {
  StyleSheet,
  Pressable,
  GestureResponderEvent
  // PixelRatio
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  interpolate,
  Extrapolate,
  interpolateColor
} from "react-native-reanimated";
import themeVariables from "../../theme/variables";
import { IOColors, IOColorType } from "../core/variables/IOColors";
import { IOSpringValues, IOScaleValues } from "../core/variables/IOAnimations";
import { BaseTypography } from "../core/typography/BaseTypography";
import { IOButtonStyles } from "../core/variables/IOStyles";
import { WithTestID } from "../../types/WithTestID";

type Props = WithTestID<{
  color?: "primary" | "danger" | "contrast";
  label: string;
  small?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress: (event: GestureResponderEvent) => void;
}>;

type ColorStates = {
  default: string;
  pressed: string;
  label: {
    default: IOColorType;
    disabled: IOColorType;
  };
};

// COMPONENT CONFIGURATION

const mapColorStates: Record<NonNullable<Props["color"]>, ColorStates> = {
  // Primary button
  primary: {
    default: IOColors.blue,
    pressed: IOColors.blue600,
    label: {
      default: "white",
      disabled: "white"
    }
  },
  // Danger button
  danger: {
    default: IOColors.errorGraphic,
    pressed: IOColors.errorDark,
    label: {
      default: "white",
      disabled: "white"
    }
  },
  // Contrast button
  contrast: {
    default: IOColors.white,
    pressed: IOColors.blue50,
    label: {
      default: "blue",
      disabled: "white"
    }
  }
};

// Disabled state
const colorPrimaryButtonDisabled: IOColorType = "bluegreyLight";

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    textAlignVertical: "center", // Android
    justifyContent: "center",
    /* Legacy visual properties. They will be replaced with
    dynamic ones once NativeBase is gone */
    borderRadius: themeVariables.btnBorderRadius,
    paddingHorizontal: 16,
    // Reset default visual parameters
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0
    /* Properties related to the new accessible variant
    with visual parameters based on the FontScale.
    We left them here because they will be a starting point
    for the next iterations of the component. */
    // paddingVertical: PixelRatio.getFontScale() * 10,
    // paddingHorizontal: PixelRatio.getFontScale() * 16,
    // borderRadius: PixelRatio.getFontScale() * 8
  },
  backgroundDisabled: {
    backgroundColor: IOColors[colorPrimaryButtonDisabled]
  }
});

export const ButtonSolid = ({
  color = "primary",
  label,
  small = false,
  fullWidth = false,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID
}: Props) => {
  const isPressed: Animated.SharedValue<number> = useSharedValue(0);

  // Scaling transformation applied when the button is pressed
  const animationScaleValue = IOScaleValues?.basicButton?.pressedState;

  // Using a spring-based animation for our interpolations
  const progressPressed = useDerivedValue(() =>
    withSpring(isPressed.value, IOSpringValues.button)
  );

  // Interpolate animation values from `isPressed` values
  const pressedAnimationStyle = useAnimatedStyle(() => {
    // Link color states to the pressed states
    const bgColor = interpolateColor(
      progressPressed.value,
      [0, 1],
      [mapColorStates[color].default, mapColorStates[color].pressed]
    );

    // Scale down button slightly when pressed
    const scale = interpolate(
      progressPressed.value,
      [0, 1],
      [1, animationScaleValue],
      Extrapolate.CLAMP
    );

    return {
      backgroundColor: bgColor,
      transform: [{ scale }]
    };
  });

  const onPressIn = useCallback(() => {
    // eslint-disable-next-line functional/immutable-data
    isPressed.value = 1;
  }, [isPressed]);
  const onPressOut = useCallback(() => {
    // eslint-disable-next-line functional/immutable-data
    isPressed.value = 0;
  }, [isPressed]);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={"button"}
      testID={testID}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessible={true}
      disabled={disabled}
      style={
        fullWidth
          ? IOButtonStyles.dimensionsFullWidth
          : IOButtonStyles.dimensionsDefault
      }
    >
      <Animated.View
        style={[
          styles.button,
          small
            ? IOButtonStyles.buttonSizeSmall
            : IOButtonStyles.buttonSizeDefault,
          disabled
            ? styles.backgroundDisabled
            : { backgroundColor: mapColorStates[color]?.default },
          /* Prevent Reanimated from overriding background colors
          if button is disabled */
          !disabled && pressedAnimationStyle
        ]}
      >
        <BaseTypography
          weight={"Bold"}
          color={
            disabled
              ? mapColorStates[color]?.label?.disabled
              : mapColorStates[color]?.label?.default
          }
          style={[
            IOButtonStyles.label,
            small
              ? IOButtonStyles.labelSizeSmall
              : IOButtonStyles.labelSizeDefault
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          /* A11y-related props:
          DON'T UNCOMMENT THEM */
          /* allowFontScaling
          maxFontSizeMultiplier={1.3} */
        >
          {label}
        </BaseTypography>
      </Animated.View>
    </Pressable>
  );
};

export default ButtonSolid;