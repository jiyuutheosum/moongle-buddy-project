import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ToastAndroid,
} from "react-native";
import modalStyles from "../styles/modalStyles";
// import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import * as DocumentPicker from "expo-document-picker";
import { ref, uploadBytes } from "firebase/storage";
import { FIREBASE_STORAGE } from "@/firebase-helpers";

interface UploadFileModalProps {
  visible: boolean;
  onClose: () => void;
  // onContinue: () => void;
  // onFileUpload: () => void;
  // files: { id: number; name: string }[];
  // onDiscard: () => void;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({
  visible,
  onClose,
  // onContinue,
  // files,
  // onFileUpload,
  // onDiscard,
}) => {
  //

  const [uploading, setUploading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [selectedDocuments, setSelectedDocuments] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);

  const handleUpload = async () => {
    if (user && selectedDocuments.length > 0) {
      setUploading(true);
      console.log(user.email);
      try {
        for (const item of selectedDocuments) {
          const response = await fetch(item.uri);
          const blob = await response.blob();

          const userStorageRef = ref(
            FIREBASE_STORAGE,
            `${user.email}/files/${item.name}`
          );

          const snapshot = await uploadBytes(userStorageRef, blob);
          console.log(snapshot.metadata.fullPath);
          ToastAndroid.show("Uploaded files successfully.", ToastAndroid.SHORT);
          setUploading(false);
          onClose();
        }
      } catch (err) {
        console.log("Error:", err);
      }
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true, // Allows the user to select any file
        type: ["application/msword", "application/pdf", "text/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const successResult =
          result as DocumentPicker.DocumentPickerSuccessResult;

        // To limit the amount of documents that is added to the array "selectedDocuments"
        if (selectedDocuments.length + successResult.assets.length <= 5) {
          setSelectedDocuments((prevSelectedDocuments) => [
            ...prevSelectedDocuments,
            ...successResult.assets,
          ]);
        } else {
          console.log("Maximum of 5 documents allowed.");
        }
      } else {
        console.log("Document selection cancelled.");
      }
    } catch (error) {
      console.log("Error picking documents:", error);
    }
  };

  const removeDocument = (index: number) => {
    setSelectedDocuments((prevSelectedDocuments) =>
      prevSelectedDocuments.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      {/* modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        {/* OVERLAY */}
        <TouchableOpacity
          onPress={onClose}
          style={modalStyles.overlay}
        ></TouchableOpacity>

        {/* BOTTOM SHEET VIEW */}
        <View style={modalStyles.bottomSheet}>
          {/* sheet title */}
          <Text style={modalStyles.sheetTitle}>Upload a File</Text>

          {/* upload area wrapper view */}
          <View style={modalStyles.inputWrapperView}>
            {/* upload area */}
            <TouchableOpacity
              onPress={pickDocuments}
              style={modalStyles.uploadAreaButton}
            >
              <Text style={modalStyles.uploadAreaText}>Click to Upload</Text>
            </TouchableOpacity>

            {/* flatlist wrapper */}
            <FlatList
              data={selectedDocuments}
              keyExtractor={(item) => item.uri.toString()}
              scrollEnabled={true}
              style={modalStyles.flatListWrapper}
              renderItem={({ item, index }) => (
                // rendering component
                <View style={modalStyles.uploadedFileItem}>
                  <Text style={modalStyles.uploadedFileTitle}>{item.name}</Text>
                  <TouchableOpacity
                    style={modalStyles.uploadedFileDelIcon}
                    onPress={() => removeDocument(index)}
                  >
                    <MaterialIcons
                      name="delete"
                      size={24}
                      color={"#aaa"}
                    ></MaterialIcons>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={modalStyles.fileEmptyText}>
                  No files uploaded yet.
                </Text>
              }
            ></FlatList>
          </View>

          {/* cancel or continue */}
          <View style={modalStyles.twoColButtonWrapperView}>
            {/* close modal / cancel process */}
            <TouchableOpacity
              onPress={onClose}
              style={modalStyles.cancelButton}
            >
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* continue */}
            <TouchableOpacity
              onPress={handleUpload}
              style={modalStyles.continueButton}
              disabled={uploading}
            >
              <Text style={modalStyles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
