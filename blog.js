import { apiRequest } from "./client";

export async function getPosts({ tag, search } = {}) {
  const params = new URLSearchParams();
  if (tag) params.append("tag", tag);
  if (search) params.append("search", search);
  const qs = params.toString();
  return apiRequest(`/blog/index.php${qs ? `?${qs}` : ""}`);
}

export async function getPostBySlug(slug) {
  return apiRequest(`/blog/detail.php?slug=${encodeURIComponent(slug)}`);
}

export async function addComment(postId, text) {
  return apiRequest("/blog/comment.php", {
    method: "POST",
    auth: true,
    body: { post_id: postId, text },
  });
}
