import { Drawer } from "expo-router/drawer";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabLayout from "./(tabs)/_layout";

export default function DrwaerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            drawerLabel: "Home",
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        {/* <Drawer.Screen
          name="mySleepPrediction"
          options={{
            title: "Sleep Prediction",
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
