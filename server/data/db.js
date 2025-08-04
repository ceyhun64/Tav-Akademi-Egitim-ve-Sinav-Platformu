// //veritabanı bağlantısı
// require("dotenv").config(); //.env dosyasını dahil ettik
// const Sequelize = require("sequelize"); //sequelize kütüphanesini dahil ettik

// //sequelize nesnesi oluşturuyoruz
// const sequelize = new Sequelize(
//   process.env.DB_NAME, //db'nin içindeki veritabanı adı
//   process.env.DB_USER, //db'nin içindeki kullanıcı adı
//   process.env.DB_PASSWORD, //db'nin içindeki şifre
//   {
//     dialect: "mysql", //veritabanının dilini belirtiyoruz
//     host: process.env.DB_HOST, //veritabanının host adresi
//     logging: false,
//   }
// );

// async function connect() {
//   try {
//     await sequelize.authenticate(); //veritabanı bağlantısını test eder(true ise bir şey olmaz false ise hata fırlatılır)
//     console.log("veritabanı bağlantısı kuruldu");
//   } catch (error) {
//     console.log("veritabanı bağlantısı kurulamadı", error);
//   }
// }

// connect(); //veritabanı bağlantı fonksiyonunu çağırıyoruz

// module.exports = sequelize; //sequelize nesnesini dışarı aktarıyoruz

require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
  logging: false,
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("✅ Railway veritabanı bağlantısı kuruldu");
  } catch (error) {
    console.error("❌ Veritabanı bağlantı hatası:", error.message);
  }
}

connect();

module.exports = sequelize;
