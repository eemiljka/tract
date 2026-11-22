import { Tabs, Redirect } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

export default function TabLayout() {
  const { session, loading } = useAuth();

  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarActiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
      <Tabs.Screen name="nutrition" options={{ title: "Nutrition" }} />
      <Tabs.Screen name="weight" options={{ title: "Weight" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
