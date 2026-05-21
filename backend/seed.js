require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool, initDB } = require("./config/db");

const seed = async () => {
  await initDB();

  const client = await pool.connect();
  try {
    // Seed admin user — credentials come from .env, never hardcoded
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("❌ ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env before seeding.");
      process.exit(1);
    }

    const existing = await client.query("SELECT * FROM admins WHERE username = $1", [adminUsername]);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 12);
      await client.query("INSERT INTO admins (username, password_hash) VALUES ($1, $2)", [adminUsername, hash]);
      console.log(`✅ Admin user created: ${adminUsername}`);
    } else {
      console.log("ℹ️  Admin user already exists.");
    }

    // Seed sample list — only Dhan Beej
    const listsExist = await client.query("SELECT COUNT(*) FROM lists");
    if (parseInt(listsExist.rows[0].count) === 0) {
      const list1 = await client.query(
        `INSERT INTO lists (title, columns, highlights, sort_order) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          "धान बीज मूल्य सूची — खरीफ",
          JSON.stringify(["बीज का नाम", "प्रकार", "कंपनी / ब्रांड", "अवधि (दिन)", "भूमि का प्रकार", "नर्सरी समय"]),
          JSON.stringify({ orange: "मोटा धान", green: "महीन धान", purple: "नई किस्म" }),
          1,
        ]
      );

      const dhanItems = [
        { values: ["बंगबंधु", "मोटा धान", "माली", "140–145", "खाला / जल जमाव", "25 मई - 10 जून"], highlight: "orange" },
        { values: ["राजेंद्र मंसूरी", "मोटा धान", "माली", "145", "खाला / जल जमाव", "25 मई - 10 जून"], highlight: "orange" },
        { values: ["सोना मंसूरी", "मोटा धान", "माली", "140–145", "खाला / जल जमाव", "25 मई - 10 जून"], highlight: "orange" },
        { values: ["सांभा", "महीन धान", "श्रीराम", "140", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["कुबेर", "महीन धान", "सावन", "130–135", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["606", "महीन धान", "महेन्द्रा सीड्स", "110", "ऊँची भूमि", "20 जून - 30 जून"], highlight: "green" },
        { values: ["मोती–360", "महीन धान", "नुज़ीवीडू", "135–140", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["सरजू–52", "मोटा धान", "Brar Seed", "130–135", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "orange" },
        { values: ["प्रसन्ना", "महीन धान", "कृषक", "130–135", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["पूनम", "महीन धान", "गोदावरी गंगा", "120–125", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["6201", "महीन धान", "U.S.", "120–125", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["गोरखनाथ–509", "महीन धान", "हाइब्रिड", "120–125", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "green" },
        { values: ["सोनम", "महीन धान", "—", "135–140", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "purple" },
        { values: ["खुशबू–100001", "महीन धान", "—", "125–130", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "purple" },
        { values: ["काला नमक", "महीन धान", "—", "135–145", "मध्यम भूमि", "10 जून - 20 जून"], highlight: "purple" },
      ];

      for (let i = 0; i < dhanItems.length; i++) {
        await client.query(
          "INSERT INTO items (list_id, item_values, highlight, sort_order) VALUES ($1, $2, $3, $4)",
          [list1.rows[0].id, JSON.stringify(dhanItems[i].values), dhanItems[i].highlight, i + 1]
        );
      }
      console.log("✅ धान बीज list seeded with", dhanItems.length, "items");
    } else {
      console.log("ℹ️  Lists already exist, skipping seed.");
    }

    console.log("\n🎉 Seed completed!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
