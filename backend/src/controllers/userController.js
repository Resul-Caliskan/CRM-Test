const User = require("../models/user");

exports.checkUserMail = async (req, res) => {
  const mail = req.body.email;
  try {
    const users = await User.findOne({ email: mail });
    res.status(200).json({ id: users._id });
  } catch (error) {
    res.status(400).json({ message: "Böyle Bir Kullanıcı Bulunamadı" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: req.body.password,
      },
      { new: true }
    );
    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserById=async(req,res)=>{
  try{
    const userId=req.params.id;
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    res.status(200).json(user);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}
exports.updateUser = async(req,res) => {
  try{
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,  
        phone: req.body.phone,
      },
      { new: true }
    );
    res.status(200).json({message: "Güncelleme işlemi başarılı"});
      
  }catch(error){
    res.status(500).json({error : error.message});
  }
}
