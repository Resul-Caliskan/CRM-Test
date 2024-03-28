const Parameter = require("../models/parameter");

exports.addParameter = async (req, res) => {
  try {
    const filter = req.body.title;
    const newValue = req.body.values;
    const existingParameter = await Parameter.findOne({ title: filter });

    if (existingParameter !== null) {
      existingParameter.values.push(newValue);
      const updatedParameter = await existingParameter.save();
      console.log(updatedParameter);
    } else {
      const newParameter = new Parameter({
        title: filter,
        values: [newValue],
      });

      await newParameter.save();
    }

    res.status(201).json({ message: "Title başarıyla eklendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllParameters = async (req, res) => {
  try {
    const parameters = await Parameter.find();
    res.status(200).json(parameters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteParameter = async (req, res) => {
  try {
    await Parameter.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Parametre başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateParameter = async (req, res) => {
  try {
    const updatedParameter = await Parameter.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        values: req.body.values,
      },
      { new: true }
    );
    res.status(200).json(updatedParameter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
