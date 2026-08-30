import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WorkoutChart } from "@/components/charts/WorkoutChart";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function WorkoutsScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.push("/")}>
          <ThemedText type="title" style={styles.title}>
            Tract
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => console.log("Add workout button pressed")}>
          <ThemedView type="backgroundElement" style={styles.statContainer}>
            {/* Add an icon to the button. Also, modal needs to open when pressed */}
            <ThemedText style={styles.statValue}>+ Add workout</ThemedText>
          </ThemedView>
        </Pressable>

        <Pressable onPress={() => console.log("Chart area pressed")}>
          <ThemedView type="backgroundElement" style={styles.statContainer}>
            <ThemedText style={styles.statLabel}>
              My workouts past 30 days
            </ThemedText>
            <ThemedText style={styles.statValue}>+12%</ThemedText>
            <WorkoutChart />
          </ThemedView>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },

  title: {
    textAlign: "center",
    marginBottom: Spacing.four,
  },

  statContainer: {
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },

  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
});
