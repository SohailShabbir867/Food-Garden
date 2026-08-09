// backend/utils/seeder.js

const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
const Order = require("../models/Order");
const Report = require("../models/Report");
const Contact = require("../models/Contact");
const Notification = require("../models/Notification");

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("ℹ️ Database already contains data. Skipping initial seeding.");
      return;
    }

    console.log("🌱 Database is empty. Seeding initial Food Garden admin and sample data...");

    // 1. Create Super Admin
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "admin@foodgarden.com",
      password: "admin123",
      role: "admin",
      status: "active",
      phone: "+92 300 1234567",
      city: "Lahore",
      isVerified: true,
    });

    // 2. Create Sample Vendors & Users
    const vendorOwner1 = await User.create({
      name: "Tariq Mahmood",
      email: "spicegarden@foodgarden.com",
      password: "password123",
      role: "vendor",
      status: "active",
      phone: "+92 321 8889990",
      city: "Lahore",
      restaurantName: "Spice Garden",
      isVerified: true,
    });

    const vendorOwner2 = await User.create({
      name: "Ayesha Malik",
      email: "pizzapalace@foodgarden.com",
      password: "password123",
      role: "vendor",
      status: "active",
      phone: "+92 333 4445556",
      city: "Lahore",
      restaurantName: "Pizza Palace",
      isVerified: true,
    });

    const buyer1 = await User.create({
      name: "Sohail Shabbir",
      email: "sohail@example.com",
      password: "password123",
      role: "buyer",
      status: "active",
      phone: "+92 301 7776665",
      city: "Lahore",
      isVerified: true,
    });

    const buyer2 = await User.create({
      name: "Ali Hassan",
      email: "ali@example.com",
      password: "password123",
      role: "buyer",
      status: "active",
      phone: "+92 302 9998887",
      city: "Lahore",
      isVerified: true,
    });

    // 3. Create Vendor Records
    const vendor1 = await Vendor.create({
      storeName: "Spice Garden",
      owner: vendorOwner1._id,
      ownerName: vendorOwner1.name,
      email: vendorOwner1.email,
      phone: vendorOwner1.phone,
      city: "Lahore",
      cuisine: "Pakistani BBQ & Karahi",
      status: "approved",
      rating: 4.9,
    });

    const vendor2 = await Vendor.create({
      storeName: "Pizza Palace",
      owner: vendorOwner2._id,
      ownerName: vendorOwner2.name,
      email: vendorOwner2.email,
      phone: vendorOwner2.phone,
      city: "Lahore",
      cuisine: "Italian & Fast Food",
      status: "approved",
      rating: 4.7,
    });

    // 4. Create Food Items
    const food1 = await Food.create({
      title: "Special Zinger Burger",
      description: "Crispy chicken fillet with secret mayo sauce and iceberg lettuce.",
      price: 550,
      category: "Burgers",
      vendor: vendor1._id,
      vendorName: vendor1.storeName,
      isAvailable: true,
      rating: 4.8,
    });

    const food2 = await Food.create({
      title: "Crown Crust Chicken Pizza (Large)",
      description: "Creamy chicken, jalapenos, stuffed cheese crown crust.",
      price: 1450,
      category: "Pizza",
      vendor: vendor2._id,
      vendorName: vendor2.storeName,
      isAvailable: true,
      rating: 4.9,
    });

    const food3 = await Food.create({
      title: "Chicken Malai Boti Roll",
      description: "Charcoal grilled malai boti wrapped in soft paratha with garlic sauce.",
      price: 320,
      category: "Rolls",
      vendor: vendor1._id,
      vendorName: vendor1.storeName,
      isAvailable: true,
      rating: 4.6,
    });

    // 5. Create Sample Orders
    await Order.create({
      orderNumber: "FG-9081",
      buyer: buyer1._id,
      buyerName: buyer1.name,
      vendor: vendor1._id,
      vendorName: vendor1.storeName,
      items: [
        { food: food1._id, title: food1.title, quantity: 2, price: food1.price },
        { food: food3._id, title: food3.title, quantity: 1, price: food3.price },
      ],
      totalPrice: 1420,
      status: "Delivered",
      deliveryAddress: "Gulberg III, Main Boulevard, Lahore",
      phone: buyer1.phone,
    });

    await Order.create({
      orderNumber: "FG-9082",
      buyer: buyer2._id,
      buyerName: buyer2.name,
      vendor: vendor2._id,
      vendorName: vendor2.storeName,
      items: [
        { food: food2._id, title: food2.title, quantity: 1, price: food2.price },
      ],
      totalPrice: 1450,
      status: "On the Way",
      deliveryAddress: "DHA Phase 5, Sector C, Lahore",
      phone: buyer2.phone,
    });

    // 6. Create Sample Reports
    await Report.create({
      reportNumber: "REP-101",
      reporter: buyer2._id,
      reporterName: buyer2.name,
      reporterEmail: buyer2.email,
      targetType: "food",
      targetName: "Special Zinger Burger",
      subject: "Food quality issue",
      description: "The order delivered was cold and lacked extra sauce requested.",
      status: "open",
      priority: "medium",
    });

    // 7. Create Sample Contacts
    await Contact.create({
      ticketId: "CONT-1001",
      name: "Sohail Shabbir",
      email: "sohail@example.com",
      phone: "+92 301 7776665",
      subject: "Vendor Partnership Inquiry",
      message: "Hello Food Garden team, I would like to list my restaurant 'Grill Master' on your marketplace. What are the requirements?",
      status: "unread",
      replies: [],
    });

    await Contact.create({
      ticketId: "CONT-1002",
      name: "M Radif Fiaz",
      email: "radif@example.com",
      phone: "+92 300 4443322",
      subject: "Order Payment Help",
      message: "My payment was deducted twice via JazzCash for order #FG-8821. Please review and refund.",
      status: "replied",
      replies: [
        {
          sender: "admin",
          text: "Hi Radif, we have received your transaction receipt and initiated a refund to your JazzCash wallet.",
          sentAt: new Date(Date.now() - 3600000),
        },
      ],
    });

    // 8. Create Sample Notification
    await Notification.create({
      title: "Welcome to Food Garden Admin Portal",
      message: "All administrative systems and database metrics are fully operational.",
      targetRole: "all",
      sender: superAdmin._id,
      senderName: "Super Admin",
    });

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding error:", error.message);
  }
};

module.exports = seedDatabase;
