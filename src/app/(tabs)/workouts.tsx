import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { WorkoutChart } from "@/components/charts/WorkoutChart";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Workout = {
  id: string;
  name: string;
  created_at: string;
};

export default function WorkoutsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadWorkouts() {
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_templates")
      .select("id, name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading workouts:", error.message);
      Alert.alert("Error", "Could not load your workouts.");
    } else {
      setWorkouts(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadWorkouts();
  }, [user?.id]);

  async function saveWorkout() {
    const name = workoutName.trim();

    if (!name) {
      Alert.alert("Missing name", "Please enter a workout name.");
      return;
    }

    if (!user) {
      Alert.alert("Not logged in", "Please log in again.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("workout_templates").insert({
      user_id: user.id,
      name,
    });

    setSaving(false);

    if (error) {
      console.error("Error saving workout:", error.message);
      Alert.alert("Error", error.message);
      return;
    }

    setWorkoutName("");
    setModalVisible(false);
    await loadWorkouts();

    Alert.alert("Success", "Your workout was saved!");
  }

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

        <ThemedView type="backgroundElement" style={styles.statContainer}>
          <ThemedText style={styles.statLabel}>
            My workouts past 30 days
          </ThemedText>
          <ThemedText style={styles.statValue}>+12%</ThemedText>
          <WorkoutChart />
        </ThemedView>

        <ThemedText type="subtitle">My workouts</ThemedText>

        {loading ? (
          <ActivityIndicator />
        ) : workouts.length === 0 ? (
          <ThemedText>You haven't created any workouts yet.</ThemedText>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/workouts/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <ThemedView type="backgroundElement" style={styles.workoutItem}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                </ThemedView>
              </Pressable>
            )}
          />
        )}

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="title">Create workout</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="Workout name (e.g. Push Day)"
                placeholderTextColor="#888"
                value={workoutName}
                onChangeText={setWorkoutName}
                maxLength={60}
              />

              <Pressable
                onPress={saveWorkout}
                disabled={saving}
                style={styles.saveButton}
              >
                <ThemedText style={styles.saveButtonText}>
                  {saving ? "Saving..." : "Save workout"}
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setWorkoutName("");
                }}
                style={styles.closeButton}
              >
                <ThemedText>Cancel</ThemedText>
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
  workoutItem: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    marginBottom: Spacing.two,
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
    borderRadius: Spacing.four,
    backgroundColor: "white",
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    color: "#111",
  },
  saveButton: {
    backgroundColor: "#222",
    padding: Spacing.three,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  closeButton: {
    padding: Spacing.three,
    alignItems: "center",
  },
});
