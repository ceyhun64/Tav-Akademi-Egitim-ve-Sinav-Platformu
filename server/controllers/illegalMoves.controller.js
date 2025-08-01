const { User, IllegalMove } = require("../models/index");

exports.getIllegalMoves = async (req, res) => {
  try {
    const illegalMoves = await IllegalMove.findAll({
      include: ["user"],
    });
    res.status(200).json(illegalMoves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addIllegalMoves = async (req, res) => {
  try {
    const { userId, move } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const illegalMove = await IllegalMove.create({ userId, move });
    res.status(201).json(illegalMove);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteIllegalMove = async (req, res) => {
  try {
    const { id } = req.params;
    const illegalMove = await IllegalMove.findByPk(id);
    if (!illegalMove) {
      return res.status(404).json({ error: "Illegal move not found" });
    }
    await illegalMove.destroy();
    res.status(200).json(illegalMove);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
