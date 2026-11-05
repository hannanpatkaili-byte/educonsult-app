import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getPostBySlug, addComment } from "../../api/blog";
import { useAuth } from "../../context/AuthContext";

export default function BlogDetailScreen({ route }) {
  const { slug } = route.params;
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const load = () => {
    return getPostBySlug(slug)
      .then(setPost)
      .catch((e) => Alert.alert("Error", e.message));
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [slug]);

  const handleComment = async () => {
    if (!user) {
      Alert.alert("Login required", "Please login to comment.");
      return;
    }
    if (!commentText.trim()) return;

    setPosting(true);
    try {
      await addComment(post.id, commentText.trim());
      setCommentText("");
      await load();
    } catch (e) {
      Alert.alert("Could not post comment", e.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  if (!post) return <Text style={{ margin: 20 }}>Post not found.</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.meta}>
          By {post.author_name || "Unknown"} · {post.views} views
        </Text>

        <Text style={styles.content}>{post.content}</Text>

        <Text style={styles.sectionTitle}>Comments ({post.comments?.length || 0})</Text>

        {(post.comments || []).map((c) => (
          <View key={c.id} style={styles.comment}>
            <Text style={styles.commentUser}>{c.user_name}</Text>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        ))}

        <View style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleComment} disabled={posting}>
            <Text style={styles.commentButtonText}>{posting ? "..." : "Post"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  meta: { fontSize: 13, color: "#999", marginBottom: 16 },
  content: { fontSize: 15, color: "#333", lineHeight: 22, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  comment: { marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  commentUser: { fontWeight: "600", marginBottom: 2 },
  commentText: { color: "#444" },
  commentBox: { flexDirection: "row", marginTop: 10, alignItems: "flex-end", gap: 8 },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    maxHeight: 100,
  },
  commentButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  commentButtonText: { color: "#fff", fontWeight: "600" },
});
