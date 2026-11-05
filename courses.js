import { apiRequest } from "./client";

export async function getCourses({ category, search } = {}) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (search) params.append("search", search);
  const qs = params.toString();
  return apiRequest(`/courses/index.php${qs ? `?${qs}` : ""}`);
}

export async function getCourseDetail(id) {
  return apiRequest(`/courses/detail.php?id=${id}`);
}

export async function enrollCourse(courseId) {
  return apiRequest("/courses/enroll.php", {
    method: "POST",
    auth: true,
    body: { course_id: courseId },
  });
}
