const { Booklet } = require("../models/index");
const logActivity = require("../helpers/logActivity");

exports.getBooklets = async (req, res) => {
  try {
    const booklets = await Booklet.findAll();
    res.json(booklets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.getTeoBooklets = async (req, res) => {
  try {
    const booklets = await Booklet.findAll({ where: { type: "teo" } });
    res.json(booklets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.getImgBooklets = async (req, res) => {
  try {
    const booklets = await Booklet.findAll({ where: { type: "img" } });
    res.json(booklets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.getBookletByType = async (req, res) => {
  try {
    const { type } = req.params;
    const booklets = await Booklet.findAll({ where: { type } });
    res.json(booklets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.createBooklet = async (req, res) => {
  try {
    const { name, type } = req.body;
    const newBooklet = await Booklet.create({ name, type });

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${name}' adlı kitapçığı oluşturdu.`,
      category: "Booklet",
    });

    res.status(201).json(newBooklet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.updateBooklet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await Booklet.update({ name }, { where: { id } });
    const updatedBooklet = await Booklet.findByPk(id);

    if (!updatedBooklet) {
      return res.status(404).json({ message: "Kitapçık bulunamadı." });
    }

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${name}' adlı kitapçığı güncelledi.`,
      category: "Booklet",
    });

    res.json(updatedBooklet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.deleteBooklet = async (req, res) => {
  try {
    const { id } = req.params;
    const booklet = await Booklet.findByPk(id);

    if (!booklet) {
      return res.status(404).json({ message: "Kitapçık bulunamadı." });
    }

    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı '${booklet.name}' adlı kitapçığı sildi.`,
      category: "Booklet",
    });

    await booklet.destroy();

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.getBookletById = async (req, res) => {
  try {
    const { id } = req.params;
    const booklet = await Booklet.findByPk(id);
    if (!booklet) {
      return res.status(404).json({ message: "Kitapçık bulunamadı." });
    }
    res.json(booklet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
