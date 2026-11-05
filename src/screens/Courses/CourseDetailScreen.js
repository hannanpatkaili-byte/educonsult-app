import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { getCourseDetail, enrollCourse } from "../../api/courses";
import { useAuth } from "../../context/AuthContext";

export default function CourseDetailScreen({ route }) {
  const { id } = route.params;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    getCourseDetail(id)
      .then(setCourse)
      .catch((e) => Alert.alert("Error", e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert("Login required", "Please login to enroll in this course.");
      return;
    }
    setEnrolling(true);
    try {
      await enrollCourse(id);
      Alert.alert("Success", "You are enrolled in this course!");
    } catch (e) {
      Alert.alert("Could not enroll", e.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (!course) return <Text style={{ margin: 20 }}>Course not found.</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.meta}>
        {course.category || "General"} · {course.level} · {course.price == 0 ? "Free" : `₹${course.price}`}
      </Text>
      {course.instructor_name && <Text style={styles.instructor}>By {course.instructor_name}</Text>}

      <Text style={styles.description}>{course.description}</Text>

      <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll} disabled={enrolling}>
        <Text style={styles.enrollText}>{enrolling ? "Enrolling..." : "Enroll Now"}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Lessons</Text>
      {course.lessons && course.lessons.length > 0 ? (
        course.lessons.map((lesson, i) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonRow}
            onPress={() => lesson.video_url && Linking.openURL(lesson.video_url)}
          >
            <Text style={styles.lessonNumber}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              {lesson.duration && <Text style={styles.lessonDuration}>{lesson.duration}</Text>}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: "#999" }}>No lessons added yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  meta: { fontSize: 13, color: "#2563eb", marginBottom: 4, textTransform: "capitalize" },
  instructor: { fontSize: 13, color: "#999", marginBottom: 16 },
  description: { fontSize: 15, color: "#333", lineHeight: 22, marginBottom: 20 },
  enrollButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  enrollText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eef2ff",
    color: "#2563eb",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "600",
    marginRight: 12,
  },
  lessonTitle: { fontSize: 15, color: "#222" },
  lessonDuration: { fontSize: 12, color: "#999", marginTop: 2 },
});
