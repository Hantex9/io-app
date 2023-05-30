import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { isGestureEnabled } from "../../../../utils/navigation";
import ProfileDeletionMainScreen from "../screens/ProfileDeletionMainScreen";
import ProfileDeletionDetailsScreen from "../screens/ProfileDeletionDetailsScreen";

import { ProfileDeletionParamsList } from "./params";
import { ProfileDeletionRoutes } from "./routes";

const Stack = createStackNavigator<ProfileDeletionParamsList>();

export const ProfileDeletionStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ProfileDeletionRoutes.PROFILE_DELETION_MAIN}
    headerMode="none"
    screenOptions={{ gestureEnabled: isGestureEnabled }}
  >
    <Stack.Screen
      name={ProfileDeletionRoutes.PROFILE_DELETION_MAIN}
      component={ProfileDeletionMainScreen}
    />
    <Stack.Screen
      name={ProfileDeletionRoutes.PROFILE_DELETION_DETAILS}
      component={ProfileDeletionDetailsScreen}
    />
  </Stack.Navigator>
);
