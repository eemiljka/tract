import { StyleSheet, View } from "react-native";

export function WeightChart() {
  return (
    <View style={styles.chart}>
      <View style={[styles.bar, styles.bar1]} />
      <View style={[styles.bar, styles.bar2]} />
      <View style={[styles.bar, styles.bar3]} />
      <View style={[styles.bar, styles.bar4]} />
      <View style={[styles.bar, styles.bar5]} />
      <View style={[styles.bar, styles.bar6]} />
      <View style={[styles.bar, styles.bar7]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 12,
  },

  bar: {
    width: 20,
    borderRadius: 6,
  },

  bar1: {
    height: "65%",
  },

  bar2: {
    height: "60%",
  },

  bar3: {
    height: "68%",
  },

  bar4: {
    height: "72%",
  },

  bar5: {
    height: "75%",
  },

  bar6: {
    height: "82%",
  },

  bar7: {
    height: "88%",
  },
});
