// file list
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from "react-native";
// import hubScreensStyles from "@/styles/hubScreensStyles";
import hubScreensStyles from "../styles/hubScreensStyles";
import { EmptyListScreen } from "@/allPurpose-components/emptyListScreen";
import {
  ref,
  list,
  listAll,
  StorageReference,
  getDownloadURL,
} from "firebase/storage";
import { FIREBASE_STORAGE } from "@/firebase-helpers";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "expo-router";
import * as IntentLauncher from "expo-intent-launcher";
import gemini_model, { AI_MODEL } from "@/firebase-helpers/gemini";
import ViewPDFModal from "./viewPDF";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

export const FilesList = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [files, setFiles] = useState<any>([]);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizedContent, setSummarizedContent] = useState("");

  const [webViewVisibility, setWebViewVisibility] = useState(false);
  const [webViewContent, setWebViewContent] = useState("");
  const [webViewFileName, setWebViewFileName] = useState("");

  const getFiles = async () => {
    if (!user?.email) return;

    try {
      const listRef = ref(FIREBASE_STORAGE, `${user.email}/files/`);
      const res = await listAll(listRef);

      const filePaths = res.items.map((itemRef) => itemRef);
      setFiles(filePaths); // Set all at once
    } catch (error) {
      ToastAndroid.show(`Error: ${error.message || error}`, ToastAndroid.SHORT);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFiles();
    }, [user?.email])
  );

  const summarizeFile = async (url: string, mimeType: string) => {
    console.log(url);
    try {
      setIsSummarizing(true);

      const fileUri = FileSystem.documentDirectory + "temp-file";
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      const base64Data = await FileSystem.readAsStringAsync(
        downloadResult.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      const result = await AI_MODEL.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
        "Summarize this document and return in HTML content with bit of CSS styles.",
      ]);

      const summary = result.response
        .text()
        .replaceAll("```", "")
        .replace("html", "");
      console.log(summary);
      setSummarizedContent(summary);
      setWebViewContent(summary);
      setIsSummarizing(false);
      setWebViewVisibility(true);
    } catch (err) {
      console.error("Summarization error:", err);
    } finally {
      setIsSummarizing(false);
    }
  };
  // render file item component
  const renderItem = ({ item }: { item: StorageReference }) => {
    return (
      <>
        <TouchableOpacity
          style={hubScreensStyles.item}
          onPress={async () => {
            const url = await getDownloadURL(item);
            const name = item.name.split("/").pop() || "";
            let fileType = "";

            if (name.endsWith(".pdf")) {
              fileType = "application/pdf";
            } else if (name.endsWith(".doc")) {
              fileType = "application/msword";
            } else if (name.endsWith(".docx")) {
              fileType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            } else if (name.endsWith(".txt")) {
              fileType = "text/plain";
            } else {
              fileType = "*/*"; // fallback for unknown types
            }

            IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
              data: url,
              flags: 1,
              type: fileType,
            });
          }}
        >
          {/* file title */}
          <Text style={hubScreensStyles.itemTitle}>
            {item.name.split("/").pop()}
          </Text>
          {/* file owner */}
          <Text style={[hubScreensStyles.ownedByLabel, { color: "#969696" }]}>
            {item.fullPath.split("/")[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isSummarizing}
          style={{
            width: 128,
            backgroundColor: "#f9f9f9",
            padding: 15,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            display: item.name.startsWith("(Summarized)") ? "none" : "flex",
          }}
          onPress={async () => {
            const url = await getDownloadURL(item);
            const name = item.name.split("/").pop() || "";
            let fileType = "";

            if (name.endsWith(".pdf")) {
              fileType = "application/pdf";
            } else if (name.endsWith(".doc")) {
              fileType = "application/msword";
            } else if (name.endsWith(".docx")) {
              fileType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            } else if (name.endsWith(".txt")) {
              fileType = "text/plain";
            } else {
              fileType = "*/*"; // fallback for unknown types
            }
            if (url) {
              summarizeFile(url, fileType);
              setWebViewFileName(name);
            }
          }}
        >
          <Text style={{ textAlign: "center" }}>Summarize</Text>
        </TouchableOpacity>
      </>
    );
  };

  if (files.length === 0) {
    return (
      <>
        <TouchableOpacity
          style={{
            width: 128,
            backgroundColor: "#f9f9f9",
            padding: 15,
            marginLeft: 24,
            borderRadius: 8,
            gap: 6,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            flexDirection: "row",
          }}
          onPress={getFiles}
        >
          <Ionicons name="refresh" size={24} />
          <Text>Refresh</Text>
        </TouchableOpacity>
        <EmptyListScreen
          title="No files"
          message="You don't have any files yet."
          iconName="folder-open-outline"
        ></EmptyListScreen>
      </>
    );
  }

  return (
    <>
      {/* container */}
      <View style={hubScreensStyles.container}>
        <TouchableOpacity
          style={{
            width: 128,
            backgroundColor: "#f9f9f9",
            padding: 15,
            borderRadius: 8,
            gap: 6,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            flexDirection: "row",
          }}
          onPress={getFiles}
        >
          <Ionicons name="refresh" size={24} />
          <Text>Refresh</Text>
        </TouchableOpacity>
        <FlatList
          data={files}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          scrollEnabled={false}
        />
        <ViewPDFModal
          onClose={() => {
            setWebViewVisibility(false);
            getFiles();
          }}
          visible={webViewVisibility}
          content={webViewContent}
          fileName={webViewFileName}
        />
      </View>
    </>
  );
};
