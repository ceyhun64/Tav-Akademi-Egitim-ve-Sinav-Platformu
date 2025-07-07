require("dotenv").config(); // Her zaman aynı .env dosyasını yükler

const Sequelize = require("sequelize");

let sequelize;

if (process.env.DB_URL) {
  // Production veya uzak veritabanı için connection string varsa kullan
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "mysql",
    logging: false,
  });
} else {
  // Yoksa local ayarları kullan
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
}

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Veritabanı bağlantısı kuruldu");
  } catch (error) {
    console.error("Veritabanı bağlantısı kurulamadı", error);
  }
}

connect();

module.exports = sequelize;
