// ==========================================
// SHARED FOOD DATA — TO BE REPLACED BY BACKEND API
// ==========================================

import Cart1 from "../assets/cart/Cart1.jpg";
import Cart1h from "../assets/cart/Cart1h.jpg";
import Cart2 from "../assets/cart/Cart2.jpg";
import Cart2h from "../assets/cart/Cart2h.jpg";
import Cart3 from "../assets/cart/Cart3.jpg";
import Cart3h from "../assets/cart/Cart3h.jpg";
import Cart4 from "../assets/cart/Cart4.jpg";
import Cart4h from "../assets/cart/Cart4h.jpg";
import Cart5 from "../assets/cart/Cart5.jpg";
import Cart5h from "../assets/cart/Cart5h.jpg";
import Cart6 from "../assets/cart/Cart6.jpg";
import Cart6h from "../assets/cart/Cart6h.jpg";

export const allFoods = [
  {
    id: 1,
    name: "Classic Beef Burger",
    basePrice: 599,
    category: "Fast Food",
    vendorId: "vendor_1",
    vendorName: "Burger Hub",
    vendorAvatar: "https://ui-avatars.com/api/?name=Burger+Hub&background=3A0519&color=fff",
    rating: 4.8,
    reviews: 124,
    description:
      "A juicy, flame-grilled beef patty stacked with fresh lettuce, ripe tomatoes, crunchy pickles, and melted cheddar cheese — all sandwiched in a toasted brioche bun. A classic done right.",
    images: [Cart1, Cart1h, Cart2h],
    spiceLevels: [
      { label: "Mild", priceExtra: 0 },
      { label: "Spicy", priceExtra: 0 },
      { label: "Extra Spicy 🌶️🌶️", priceExtra: 30 },
    ],
    addOns: [
      { label: "Extra Cheese", price: 80 },
      { label: "Crispy Bacon", price: 120 },
      { label: "Double Patty", price: 200 },
      { label: "Soft Drink (330ml)", price: 100 },
    ],
    tags: ["Bestseller", "Halal", "Grill"],
  },
  {
    id: 2,
    name: "Cheesy Fries",
    basePrice: 349,
    category: "Snacks",
    vendorId: "vendor_2",
    vendorName: "Potato & Co.",
    vendorAvatar: "https://ui-avatars.com/api/?name=Potato+Co&background=3A0519&color=fff",
    rating: 4.5,
    reviews: 89,
    description:
      "Golden, crispy fries loaded with a generous pour of creamy cheddar cheese sauce and topped with fresh herbs. The ultimate comfort snack that never disappoints.",
    images: [Cart2, Cart2h, Cart1h],
    spiceLevels: [
      { label: "Original", priceExtra: 0 },
      { label: "Spicy", priceExtra: 0 },
      { label: "Jalapeño 🌶️", priceExtra: 40 },
    ],
    addOns: [
      { label: "Extra Cheese Sauce", price: 60 },
      { label: "Chicken Strips", price: 150 },
      { label: "Dipping Sauce", price: 50 },
      { label: "Large Size", price: 100 },
    ],
    tags: ["Popular", "Vegetarian"],
  },
  {
    id: 3,
    name: "Chicken Samosas",
    basePrice: 449,
    category: "Appetizers",
    vendorId: "vendor_3",
    vendorName: "Desi Bites",
    vendorAvatar: "https://ui-avatars.com/api/?name=Desi+Bites&background=3A0519&color=fff",
    rating: 4.9,
    reviews: 210,
    description:
      "Crispy, golden triangles filled with spiced minced chicken, aromatic herbs, and caramelized onions. Served with our signature mint chutney and tamarind dip — a true desi classic.",
    images: [Cart3, Cart3h, Cart5h],
    spiceLevels: [
      { label: "Mild", priceExtra: 0 },
      { label: "Medium", priceExtra: 0 },
      { label: "Hot 🌶️🌶️", priceExtra: 20 },
    ],
    addOns: [
      { label: "Extra Chutney", price: 40 },
      { label: "6-Pack (instead of 4)", price: 120 },
      { label: "Raita Cup", price: 60 },
      { label: "Cold Drink", price: 100 },
    ],
    tags: ["Bestseller", "Desi", "Halal"],
  },
  {
    id: 4,
    name: "Veggie Delight Pizza",
    basePrice: 699,
    category: "Pizza",
    vendorId: "vendor_4",
    vendorName: "Pizza Paradise",
    vendorAvatar: "https://ui-avatars.com/api/?name=Pizza+Paradise&background=3A0519&color=fff",
    rating: 4.7,
    reviews: 156,
    description:
      "A hand-tossed pizza loaded with bell peppers, olives, mushrooms, red onions, and sweet corn, all smothered in a rich tomato base and a generous blanket of mozzarella cheese.",
    images: [Cart4, Cart4h, Cart2h],
    spiceLevels: [
      { label: "No Spice", priceExtra: 0 },
      { label: "Mild", priceExtra: 0 },
      { label: "Spicy Drizzle 🌶️", priceExtra: 50 },
    ],
    addOns: [
      { label: "Extra Mozzarella", price: 100 },
      { label: "Stuffed Crust", price: 150 },
      { label: "Garlic Bread", price: 120 },
      { label: "Large Size (14\")", price: 200 },
    ],
    tags: ["Vegetarian", "Halal"],
  },
  {
    id: 5,
    name: "Spicy Rolls",
    basePrice: 449,
    category: "Street Food",
    vendorId: "vendor_5",
    vendorName: "Street Food Junction",
    vendorAvatar: "https://ui-avatars.com/api/?name=Street+Food&background=3A0519&color=fff",
    rating: 4.6,
    reviews: 95,
    description:
      "Soft, flaky parathas packed with juicy grilled chicken strips, crunchy cabbage slaw, and a fiery chilli sauce. A street food icon that's impossible to resist.",
    images: [Cart5, Cart5h, Cart3h],
    spiceLevels: [
      { label: "Regular", priceExtra: 0 },
      { label: "Spicy", priceExtra: 0 },
      { label: "Fire 🔥🌶️", priceExtra: 30 },
    ],
    addOns: [
      { label: "Double Chicken", price: 130 },
      { label: "Cheese Slice", price: 70 },
      { label: "Extra Sauce", price: 40 },
      { label: "2-Pack", price: 380 },
    ],
    tags: ["Street Food", "Spicy", "Halal"],
  },
  {
    id: 6,
    name: "Loaded Fries",
    basePrice: 299,
    category: "Snacks",
    vendorId: "vendor_6",
    vendorName: "Fries Factory",
    vendorAvatar: "https://ui-avatars.com/api/?name=Fries+Factory&background=3A0519&color=fff",
    rating: 4.4,
    reviews: 67,
    description:
      "Thick-cut potato fries generously loaded with spiced chicken tikka, tangy salsa, sour cream, and a drizzle of hot sauce. This isn't just fries — it's a full meal.",
    images: [Cart6, Cart6h, Cart4h],
    spiceLevels: [
      { label: "Original", priceExtra: 0 },
      { label: "Spicy", priceExtra: 0 },
      { label: "Masala Blast 🌶️", priceExtra: 40 },
    ],
    addOns: [
      { label: "Extra Chicken", price: 120 },
      { label: "Extra Sour Cream", price: 50 },
      { label: "Upgrade to XL", price: 100 },
      { label: "Add Coleslaw", price: 70 },
    ],
    tags: ["Popular", "Filling", "Halal"],
  },
];
