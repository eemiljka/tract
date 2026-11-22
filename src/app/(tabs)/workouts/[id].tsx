import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Workout = {
  id: string;
  name: string;
};

type Exercise = {
  id: string;
  name: string;
  muscle_group: string | null;
};

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [addedExercises, setAddedExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  async function loadWorkout() {
    if (!user || !id) return;

    setLoading(true);

    const { data: workoutData, error: workoutError } = await supabase
      .from("workout_templates")
      .select("id, name")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (workoutError) {
      console.error(workoutError.message);
      setError("Could not find this workout.");
      setLoading(false);
      return;
    }

    setWorkout(workoutData);

    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercises")
      .select("id, name, muscle_group")
      .or(`is_public.eq.true,user_id.eq.${user.id}`)
      .order("name");

    if (exerciseError) {
      console.error(exerciseError.message);
      Alert.alert("Error", "Could not load the exercise library.");
    } else {
      setExercises(exerciseData ?? []);
    }

    await loadAddedExercises();
    setLoading(false);
  }

  async function loadAddedExercises() {
    if (!id) return;

    const { data, error } = await supabase
      .from("workout_template_exercises")
      .select("exercise_id")
      .eq("template_id", id);

    if (error) {
      console.error(error.message);
      return;
    }

    const exerciseIds = (data ?? []).map((item) => item.exercise_id);

    if (exerciseIds.length === 0) {
      setAddedExercises([]);
      return;
    }

    const { data: details, error: detailsError } = await supabase
      .from("exercises")
      .select("id, name, muscle_group")
      .in("id", exerciseIds);

    if (detailsError) {
      console.error(detailsError.message);
      return;
    }

    const ordered = exerciseIds
      .map((exerciseId) =>
        details?.find((exercise) => exercise.id === exerciseId),
      )
      .filter((exercise): exercise is Exercise => exercise !== undefined);

    setAddedExercises(ordered);
  }

  useEffect(() => {
    loadWorkout();
  }, [id, user?.id]);

  async function addExercise(exercise: Exercise) {
    if (!id || addedExercises.some((item) => item.id === exercise.id)) {
      return;
    }

    setAdding(true);

    const { error } = await supabase.from("workout_template_exercises").insert({
      template_id: id,
      exercise_id: exercise.id,
    });

    setAdding(false);

    if (error) {
      console.error(error.message);
      Alert.alert("Error", error.message);
      return;
    }

    await loadAddedExercises();
    setModalVisible(false);
    setSearch("");
  }

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.back()}>
          <ThemedText>← Back to workouts</ThemedText>
        </Pressable>

        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <ThemedText>{error}</ThemedText>
        ) : workout ? (
          <>
            <ThemedText type="title">{workout.name}</ThemedText>

            <ThemedText type="subtitle">
              Exercises ({addedExercises.length})
            </ThemedText>

            {addedExercises.length === 0 ? (
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedText>No exercises added yet.</ThemedText>
              </ThemedView>
            ) : (
              <FlatList
                data={addedExercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <ThemedView
                    type="backgroundElement"
                    style={styles.exerciseItem}
                  >
                    <ThemedText type="subtitle">
                      {index + 1}. {item.name}
                    </ThemedText>
                    {item.muscle_group ? (
                      <ThemedText>{item.muscle_group}</ThemedText>
                    ) : null}
                  </ThemedView>
                )}
              />
            )}

            <Pressable
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <ThemedText style={styles.buttonText}>+ Add exercise</ThemedText>
            </Pressable>
          </>
        ) : (
          <ThemedText>Workout not found.</ThemedText>
        )}

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type="title">Exercise library</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="Search exercises..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
              />

              {adding ? <ActivityIndicator /> : null}

              <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                style={styles.exerciseList}
                ListEmptyComponent={
                  <ThemedText>No exercises found.</ThemedText>
                }
                renderItem={({ item }) => {
                  const alreadyAdded = addedExercises.some(
                    (exercise) => exercise.id === item.id,
                  );

                  return (
                    <Pressable
                      disabled={alreadyAdded || adding}
                      onPress={() => addExercise(item)}
                      style={styles.libraryItem}
                    >
                      <View>
                        <ThemedText type="subtitle">{item.name}</ThemedText>
                        {item.muscle_group ? (
                          <ThemedText>{item.muscle_group}</ThemedText>
                        ) : null}
                      </View>

                      <ThemedText>
                        {alreadyAdded ? "Added" : "+ Add"}
                      </ThemedText>
                    </Pressable>
                  );
                }}
              />

              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setSearch("");
                }}
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
    padding: Spacing.four,
    gap: Spacing.four,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  exerciseItem: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    marginBottom: Spacing.two,
  },
  addButton: {
    backgroundColor: "#222",
    padding: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(96, 96, 96, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
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
  exerciseList: {
    flexGrow: 0,
  },
  libraryItem: {
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    padding: Spacing.three,
    alignItems: "center",
  },
});
