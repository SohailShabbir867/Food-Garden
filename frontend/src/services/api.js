const BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api");

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
};

export const normaliseFood = (food) => ({
  ...food,
  id: food._id,
  name: food.title,
  basePrice: food.price,
  images: food.images?.length ? food.images : food.image ? [food.image] : [],
  vendorId: food.vendor?.owner?._id || food.vendor?.owner || food.vendor?._id || food.vendor,
  vendorOwnerId: food.vendor?.owner?._id || food.vendor?.owner || null,
  vendorName: food.vendor?.storeName || food.vendorName,
  vendorAvatar: food.vendor?.logo || "",
  reviews: food.salesCount || 0,
  spiceLevels: food.spiceLevels?.length ? food.spiceLevels : [{ label: "Regular", priceExtra: 0 }],
  addOns: food.addOns || [],
  tags: food.tags || [],
});

export const fetchFoods = async (params = {}) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString();
  const data = await request(`/foods${query ? `?${query}` : ""}`);
  return data.foods.map(normaliseFood);
};

export const fetchFood = async (id) => normaliseFood((await request(`/foods/${id}`)).food);
export const createOrder = (body) => request("/orders", { method: "POST", body: JSON.stringify(body) });
export const fetchMyOrders = () => request("/orders");
export const fetchMyOrder = (orderNumber) => request(`/orders/${encodeURIComponent(orderNumber)}`);
export const removeMyOrder = (id) => request(`/orders/${id}`, { method: "DELETE" });

// ── Chat API ──────────────────────────────────────────────────────────────
export const fetchMyChats = () => request("/chats");
export const fetchChatMessages = (chatId) => request(`/chats/${encodeURIComponent(chatId)}/messages`);
export const sendChatMessage = (chatId, text) =>
  request(`/chats/${encodeURIComponent(chatId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
export const createOrFindChat = (recipientId, orderId) =>
  request("/chats", {
    method: "POST",
    body: JSON.stringify({ recipientId, orderId: orderId || undefined }),
  });
export const markChatRead = (chatId) =>
  request(`/chats/${encodeURIComponent(chatId)}/read`, { method: "PUT" });
