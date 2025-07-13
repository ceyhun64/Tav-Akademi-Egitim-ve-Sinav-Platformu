const { UploadFile, UploadFileUser, User } = require("../models/index");
const logActivity = require("../helpers/logActivity");

exports.uploadSingleFile = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Dosya yüklenmedi." });
    }
    const fileUrl = file.secure_url || file.path; // Cloudinary URL'si
    const newUploadFile = await UploadFile.create({
      name,
      file_url: fileUrl,
    });
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const lokasyonId = user.lokasyonId;
    const grupId = user.grupId;

    const users = await User.findAll({
      where: {
        lokasyonId,
        grupId,
      },
    });
    const userIds = users.map((user) => user.id);

    await Promise.all(
      userIds.map((userId) =>
        UploadFileUser.create({
          user_id: userId,
          file_id: newUploadFile.id,
        })
      )
    );

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${name}' adlı dosya yükledi.`,
      category: "UploadFile",
    });
    res.status(201).json(newUploadFile);
  } catch (error) {
    console.error("Tekli dosya yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.uploadMultipleFiles = async (req, res) => {
  try {
    const { name } = req.body;
    const fileUrls = req.files.map((file) => file.path); // Dosya URL'lerini alıyoruz

    // Her bir dosya için eğitim kaydı oluşturuyoruz
    const newUploadFiles = await Promise.all(
      fileUrls.map((fileUrl) =>
        UploadFile.create({
          name,
          file_url: fileUrl, // Her dosyanın URL'sini buraya ekliyoruz
        })
      )
    );
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    const lokasyonId = user.lokasyonId;
    const grupId = user.grupId;

    const users = await User.findAll({
      where: {
        lokasyonId,
        grupId,
      },
    });
    const userIds = users.map((user) => user.id);
    await Promise.all(
      userIds.flatMap((userId) =>
        newUploadFiles.map((file) =>
          UploadFileUser.create({
            user_id: userId,
            file_id: file.id,
          })
        )
      )
    );

    // Eğitim kayıtları oluşturulduktan sonra, UploadFileUser tablosuna kayıt ekleme işlemi

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${newUploadFiles.length}' adet eğitim dosyası yükledi.`,
      category: "UploadFile",
    });

    res.status(201).json(newUploadFiles); // Başarılı sonuç
  } catch (error) {
    console.error("Çoklu dosya yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.getUploadedFilesByManager = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    const lokasyonId = user.lokasyonId;
    const grupId = user.grupId;
    const users = await User.findAll({
      where: {
        lokasyonId,
        grupId,
      },
    });
    const userIds = users.map((user) => user.id);
    const uploadedFiles = await UploadFile.findAll({
      where: {
        id: userIds,
      },
    });
    res.json(uploadedFiles);
  } catch (error) {
    console.error("Dosya listesi alınırken bir hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.getUploadedFilesByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploadfileUsers = await UploadFileUser.findAll({
      where: {
        user_id: userId,
      },
    });
    const uploadedFiles = await Promise.all(
      uploadfileUsers.map(async (uploadfileUser) => {
        const uploadFile = await UploadFile.findByPk(uploadfileUser.file_id);
        return uploadFile;
      })
    );
    res.json(uploadedFiles);
  } catch (error) {
    console.error("Dosya listesi alınırken bir hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.deleteUploadedFile = async (req, res) => {
  try {
    const { ids } = req.body; // örn: [2,3,4]

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "ID'ler belirtilmedi veya geçersiz formatta." });
    }

    // ids zaten array olduğu için split yapmaya gerek yok
    const idArray = ids.map((id) => id.toString().trim());

    // Silinecek dosyaları bul
    const filesToDelete = await UploadFile.findAll({
      where: {
        id: idArray,
      },
    });

    if (filesToDelete.length === 0) {
      return res.status(404).json({ message: "Hiç dosya bulunamadı." });
    }

    // Sil
    for (const file of filesToDelete) {
      await file.destroy();
    }

    res.json({ message: `${filesToDelete.length} dosya başarıyla silindi.` });
  } catch (error) {
    console.error("Dosya silinirken bir hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.updateDowloaded = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.body;

    const uploadFileUser = await UploadFileUser.findOne({
      where: {
        user_id: userId,
        file_id: fileId,
      },
    });
    const user = await User.findByPk(userId);
    if (!uploadFileUser) {
      return res.status(404).json({ message: "Dosya bulunamadı." });
    }
    uploadFileUser.is_downloaded = true;
    await uploadFileUser.save();
    res.json({ user, uploadFileUser });
  } catch (error) {
    console.error("Dosya silinirken bir hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.getDownloadedUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    const lokasyonId = user.lokasyonId;
    const grupId = user.grupId;
    const users = await User.findAll({
      where: {
        lokasyonId,
        grupId,
      },
    });
    const userIds = users.map((user) => user.id);
    const uploadedFiles = await UploadFileUser.findAll({
      where: {
        user_id: userIds,
        is_downloaded: true,
      },
      include: [
        {
          model: UploadFile,
          as: "file",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });

    res.json(uploadedFiles);
  } catch (error) {
    console.error("Dosya listesi alınırken bir hata oluştu:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
