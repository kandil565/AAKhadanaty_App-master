import http from "http";

const testAPI = async () => {
  // Wait for server to start
  console.log("⏳ في انتظار بدء الخادم...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/health",
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          console.log("✅ API Response:");
          console.log(JSON.stringify(response, null, 2));
          resolve();
        } catch (e) {
          console.error("❌ Error parsing response:", e.message);
          reject(e);
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Request error:", error.message);
      reject(error);
    });

    req.end();
  });
};

testAPI()
  .then(() => {
    console.log("\n✅ جميع الاختبارات نجحت!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ فشل الاختبار:", error.message);
    process.exit(1);
  });
