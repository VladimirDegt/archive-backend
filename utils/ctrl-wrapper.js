const ctrlWrapper = (ctrl) => {
  const inner = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return inner;
};

module.exports = ctrlWrapper;
