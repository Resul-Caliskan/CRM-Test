const Parameter = require("../models/parameter");

exports.addParameter = async (req, res) => {
  try {
    console.log("Parametre eklendi");
    const filter = req.body.title;
    const key = req.body.key;
    const newValue = req.body.values;
    const existingParameter = await Parameter.findOne({ title: filter });
    console.log("Parametre eklendi2"+filter);
    console.log("Parametre değeri:"+newValue);

    if (existingParameter !== null) {
      existingParameter.values.push(newValue);
      const updatedParameter = await existingParameter.save();
      console.log(updatedParameter);
    } else {
      const newParameter = new Parameter({
        title: filter,
        key:key,
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

exports.deleteParameterValue = async (req, res) => {
  try {
    const parameterId = req.params.parameterId;
    const valueId = req.params.valueId;

   
    const parameter = await Parameter.findById(parameterId);
    if (!parameter) {
      return res.status(404).json({ error: "Parametre bulunamadı" });
    }

    const index = parameter.values.indexOf(valueId);
    if (index === -1) {
      return res.status(404).json({ error: "Değer bulunamadı" });
    }

    parameter.values.splice(index, 1);
    await parameter.save();

    res.status(200).json({ message: "Değer başarıyla silindi" });
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
