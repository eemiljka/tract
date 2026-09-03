import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WorkoutChart } from "@/components/charts/WorkoutChart";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function WorkoutsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.push("/")}>
          <ThemedText type="title" style={styles.title}>
            Tract
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => setModalVisible(true)}>
          <ThemedView type="backgroundElement" style={styles.statContainer}>
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

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="title">Add Workout</ThemedText>

              <ThemedText>Workout form goes here.</ThemedText>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <ThemedText>Close</ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>
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

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(96, 96, 96, 0.5)",
  },

  modalContent: {
    width: "90%",
    padding: Spacing.four,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    backgroundColor: "white",
    gap: Spacing.three,
  },

  closeButton: {
    padding: Spacing.three,
    alignItems: "center",
  },
});
