import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import { getPrescriptionViewUrl } from "../../api/prescriptions";

export default function PrescriptionViewScreen({ route }) {
  const { id } = route.params;
  const [url, setUrl] = useState(null);

  useEffect(() => {
    getPrescriptionViewUrl(id).then(setUrl);
  }, [id]);

  if (!url) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: url }}
      style={styles.webview}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  webview: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
