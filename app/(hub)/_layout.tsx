import { Tabs, useRouter, useSegments } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { HubHeader } from "@/hub-components/hubHeader";
import { FilesHubHeader } from "@/hub-components/filesHubHeader";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

// layout for hub screens
export default function HubLayout() {
  const router = useRouter(); // Use the router hook
  const segments = useSegments(); // Get the current route segments

  // Determine which header to show based on the active route
  const renderHeader = () => {
    if (segments.includes("files")) {
      return <FilesHubHeader />;
    } else if (segments.includes("quizzes")) {
      return <HubHeader />;
    }
    return null; // Default case if no matching route
  };

  return (
    <>
      <StatusBar backgroundColor="#4ecdc4"></StatusBar>
      <Tabs
        initialRouteName="files/[id]"
        screenOptions={({ route }) => ({
          // tab bar
          tabBarIcon: ({ focused }) => {
            let iconName: "insert-drive-file" | "quiz" = "insert-drive-file";
            if (route.name === "files/[id]") iconName = "insert-drive-file";
            else if (route.name === "quizzes/[id]") iconName = "quiz";
            return <MaterialIcons name={iconName} size={24} color={focused ? "#FFE66D" : "#FFF"} />;
          },
          tabBarStyle: {
            backgroundColor: "#4ecdc4",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            height: 60,
          },
          tabBarLabelPosition: "beside-icon",
          tabBarActiveTintColor: "#FFE66D",
          tabBarInactiveTintColor: "#fff",
          tabBarLabelStyle: {
            fontFamily: "Poppins-Bold",
            fontSize: 16,
          },
          tabBarPosition: "bottom",

          // Header
          header: () => (
            <>
              <View style={styles.headerContainer}></View>
              <View>
                <TouchableOpacity
                  style={{ marginHorizontal: 20, marginTop: 50 }}
                  onPress={() => router.replace("/(main)/hub")} // Use replace instead of push
                >
                  <Ionicons name="arrow-back" size={24} color={"#fff"} />
                </TouchableOpacity>

                {/* Dynamically render the header */}
                {renderHeader()}
              </View>
            </>
          ),
          headerShadowVisible: false,
        })}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        {/* files/[id] => [id] is the study hub id */}
        <Tabs.Screen name="files/[id]" options={{ tabBarLabel: "Files" }} />
        <Tabs.Screen name="quizzes/[id]" options={{ tabBarLabel: "Quizzes" }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    backgroundColor: "#4ecdc4",
    height: "60%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
});