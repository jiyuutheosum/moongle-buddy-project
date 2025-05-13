import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { getAuth } from "firebase/auth";
import { FIREBASE_STORAGE } from "@/firebase-helpers";
import { ref, uploadBytes } from "firebase/storage";

type ViewPDFProps = {
  content: string;
  visible: boolean;
  onClose: () => void;
  fileName: string;
};

const ViewPDFModal = ({
  content,
  visible,
  onClose,
  fileName,
}: ViewPDFProps) => {
  const saveHTMLToPDF = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Generate PDF from HTML
      const { uri } = await Print.printToFileAsync({ html: content });

      const pdfName = `(Summarized) ${fileName}`;
      const newUri = FileSystem.documentDirectory + pdfName;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      const response = await fetch(newUri);
      const blob = await response.blob();

      const userStorageRef = ref(
        FIREBASE_STORAGE,
        `${user!.email}/files/${newUri.split("/").pop()}`
      );

      const snapshot = await uploadBytes(userStorageRef, blob);
      console.log(snapshot.metadata.fullPath);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        ToastAndroid.show("Uploaded on database", ToastAndroid.SHORT);
        await Sharing.shareAsync(newUri);
      } else {
        console.log("Sharing is not available");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Close Button */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={saveHTMLToPDF} style={styles.closeButton}>
            <Text style={styles.closeText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* PDF Viewer */}
        <WebView
          style={styles.webview}
          startInLoadingState={true}
          source={{ html: content }}
          renderLoading={() => (
            <ActivityIndicator style={{ flex: 1 }} size="large" />
          )}
          originWhitelist={["*"]}
        />
      </View>
    </Modal>
  );
};

export default ViewPDFModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  closeButton: {
    padding: 10,
    alignSelf: "flex-end",
    backgroundColor: "#eee",
    borderRadius: 5,
    margin: 8,
  },
  closeText: {
    fontSize: 16,
    color: "#333",
  },
  webview: {
    flex: 1,
  },
});
