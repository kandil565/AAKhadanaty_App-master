import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("🔄 جاري الاتصال بـ MongoDB...");
    console.log(`📍 Connection String: ${process.env.MONGODB_URI.substring(0, 50)}...`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log("✅ تم الاتصال بـ MongoDB بنجاح!");
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    console.log(`🔗 URL: ${conn.connection.client.options.srvHost}`);
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\n📚 المجموعات الموجودة (${collections.length}):`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ تم إغلاق الاتصال بنجاح");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ خطأ في الاتصال:");
    console.error(error.message);
    process.exit(1);
  }
};

testConnection();
