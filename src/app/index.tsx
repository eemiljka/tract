import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NutritionChart } from "@/components/charts/NutritionChart";
import { WeightChart } from "@/components/charts/WeightChart";
import { WorkoutChart } from "@/components/charts/WorkoutChart";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          tract
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.statContainer}>
          <ThemedText style={styles.statLabel}>
            My workouts past 30 days
          </ThemedText>

          <ThemedText style={styles.statValue}>+12%</ThemedText>

          <WorkoutChart />
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.statContainer}>
          <ThemedText style={styles.statLabel}>
            My nutrition this week
          </ThemedText>

          <ThemedText style={styles.statValue}>95% on point</ThemedText>

          <NutritionChart />
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.statContainer}>
          <ThemedText style={styles.statLabel}>
            My weight past 30 days
          </ThemedText>

          <ThemedText style={styles.statValue}>+1.2 kg</ThemedText>

          <WeightChart />
        </ThemedView>
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
