const { PoolImg, Booklet } = require("../models/index");
const logActivity = require("../helpers/logActivity");

exports.getPoolImgs = async (req, res) => {
  try {
    const poolImgs = await PoolImg.findAll();
    res.json(poolImgs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPoolImgById = async (req, res) => {
  try {
    const { id } = req.params;
    const poolImg = await PoolImg.findByPk(id);
    if (!poolImg) {
      return res.status(404).json({ message: "PoolImg not found" });
    }
    res.json(poolImg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createPoolImg = async (req, res) => {
  try {
    const {
      question,
      a,
      b,
      c,
      d,
      e,
      f,
      coordinate,
      answer,
      bookletId,
      questionCategoryId,
      difLevelId,
    } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const newPoolImg = await PoolImg.create({
      question,
      a,
      b,
      c,
      d,
      e,
      f,
      coordinate,
      answer,
      image: imagePath,
      bookletId,
      questionCategoryId,
      difLevelId,
    });
    const booklet = await Booklet.findByPk(bookletId);

    booklet.question_count++;
    await booklet.save();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından görsel soru eklendi.`,
      category: "PoolImg",
    });
    res.status(201).json(newPoolImg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePoolImg = async (req, res) => {
  try {
    const { id } = req.params;
    const poolImg = await PoolImg.findByPk(id);
    if (!poolImg) {
      return res.status(404).json({ message: "Pool image not found" });
    }

    const image = req.file ? req.file.path : req.body.image;

    await poolImg.update({
      image,
      question: req.body.question,
      a: req.body.a,
      b: req.body.b,
      c: req.body.c,
      d: req.body.d,
      e: req.body.e,
      f: req.body.f,
      answer: req.body.answer,
      bookletId: req.body.bookletId,
      questionCategoryId: req.body.questionCategoryId,
      difLevelId: req.body.difLevelId,
      coordinate: req.body.coordinate,
    });
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından görsel soru güncellendi.`,
      category: "PoolImg",
    });

    res.json(poolImg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePoolImg = async (req, res) => {
  try {
    const { id } = req.params;
    const poolImg = await PoolImg.findByPk(id);
    const bookletId = poolImg.bookletId;
    if (!poolImg) {
      return res.status(404).json({ message: "PoolImg not found" });
    }
    const booklet = await Booklet.findByPk(bookletId);
    booklet.question_count -= 1;
    await booklet.save();

    await poolImg.destroy();
    await logActivity({
      userId: req.user.id,
      action: `${req.user.name} adlı kullanıcı tarafından görsel soru silindi.`,
      category: "PoolImg",
    });
    res.json({ message: "PoolImg deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//sınav için burayı kullanıcaz
exports.getPoolImgsByBookletId = async (req, res) => {
  try {
    const { bookletId } = req.params;
    const poolImgs = await PoolImg.findAll({
      where: { bookletId },
    });
    
    res.json(poolImgs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
