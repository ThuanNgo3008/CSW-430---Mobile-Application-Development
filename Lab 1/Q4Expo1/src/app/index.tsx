import React, { useState } from "react";
import { Text, Button, View } from "react-native";

export default function App() {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>You've pressed the button: {pressCount} time(s)</Text>
      <Button title="Press me" onPress={() => setPressCount(pressCount + 1)} />
    </View>
  );
}