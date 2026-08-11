const USER_KEY = "finplan_user_id";

function getUserId() {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

// أثناء التطوير المحلي يُستخدم "/api" ويُحوَّل تلقائياً إلى الباك إند عبر vite.config.js
// عند النشر على الإنترنت (مثلاً الفرونت إند على Vercel والباك إند على Render)
// عرّف متغير البيئة VITE_API_URL في إعدادات الاستضافة برابط الباك إند + /api
const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getUserId(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "حدث خطأ غير متوقع");
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};

export { getUserId };
