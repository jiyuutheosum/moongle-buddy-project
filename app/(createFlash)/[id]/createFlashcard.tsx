import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

interface Flashcard {
  question: string;
  answer: string;
}

export default function CreateFlashcard() {
  const { id, name } = useLocalSearchParams(); // Get hub ID and flashcard name from the route
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { question: "", answer: "" },
  ]);

  const addFlashcard = () => {
    setFlashcards([...flashcards, { question: "", answer: "" }]);
  };

  const deleteFlashcard = (index: number) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  };

  const updateFlashcard = (index: number, field: "question" | "answer", value: string) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);
  };

  const saveFlashcards = () => {
    if (flashcards.some((card) => !card.question || !card.answer)) {
      Alert.alert("Error", "Please fill out all questions and answers.");
      return;
    }

    // Save flashcards to Firestore or any backend service
    console.log("Flashcards saved:", flashcards);
    Alert.alert("Success", "Flashcards saved successfully!");
    router.back(); // Navigate back to the previous screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Flashcards: {name}</Text>

      {flashcards.map((flashcard, index) => (
        <View key={index} style={styles.flashcardContainer}>
          <Text style={styles.label}>Question {index + 1}:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter question"
            value={flashcard.question}
            onChangeText={(text) => updateFlashcard(index, "question", text)}
          />
          <Text style={styles.label}>Answer:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter answer"
            value={flashcard.answer}
            onChangeText={(text) => updateFlashcard(index, "answer", text)}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteFlashcard(index)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addFlashcard}>
        <Text style={styles.addButtonText}>Add Flashcard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveFlashcards}>
        <Text style={styles.saveButtonText}>Save Flashcards</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  flashcardContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  addButton: {
    backgroundColor: "#4ecdc4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
  },
});