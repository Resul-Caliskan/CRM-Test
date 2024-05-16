const User = require("../models/user");
const Customer = require("../models/customer");
const customer = require("../models/customer");

exports.addCustomer = async (req, res) => {
  try {
    const existingCompany = await Customer.findOne({
      companyname: req.body.companyname,
    });
    if (existingCompany) {
      return res
        .status(409)
        .json({ error: "Bu şirket adı daha önce kullanılmış." });
    }
    const existingWebsite = await Customer.findOne({
      companyweb: req.body.companyweb,
    });
    if (existingWebsite) {
      return res
        .status(409)
        .json({ error: "Bu web sitesi daha önce kullanılmış" });
    }

    const existingEmail = await Customer.findOne({
      contactmail: req.body.contactmail,
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Bu mail daha önce kullanılmış" });
    }

    const existingNumber = await Customer.findOne({
      contactnumber: req.body.contactnumber,
    });
    if (existingNumber) {
      return res.status(409).json({ error: "Bu numara daha önce kullanılmış" });
    }

    const newCustomer = new Customer({
      companyname: req.body.companyname,
      companytype: req.body.companytype,
      companysector: req.body.companysector,
      companyadress: req.body.companyadress,
      companycity: req.body.companycity,
      companycountry: req.body.companycountry,
      companyweb: req.body.companyweb,
      contactname: req.body.contactname,
      contactmail: req.body.contactmail,
      contactnumber: req.body.contactnumber,
      companycounty: req.body.companycounty,
    });

    await newCustomer.save();
    res.status(201).json({ message: "Müşteri başarıyla eklendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.userAddToCustomer = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: "Bu mail daha önce kullanılmış" });
    }

    const existingPhoneUser = await User.findOne({ phone: req.body.phone });
    if (existingPhoneUser) {
      return res
        .status(409)
        .json({ error: "Bu numara daha önce kullanılmış." });
    }
    const user = req.body;
    const newUser = new User({
      email: user.email,
      password: user.password,
      companyId: req.params.id,
      role: req.body.role,
      phone: req.body.phone,
    });
    console.log(req.body.phone);
    newUser
      .save()
      .then(() => {})
      .catch((err) => {
        console.error("Kullanıcı eklenirken hata oluştu:", err);
      });

    const id = req.params.id;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $push: { users: [newUser._id] },
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        companyname: req.body.companyname,
        companytype: req.body.companytype,
        companysector: req.body.companysector,
        companyadress: req.body.companyadress,
        companycity: req.body.companycity,
        companycountry: req.body.companycountry,
        companyweb: req.body.companyweb,
        contactname: req.body.contactname,
        contactmail: req.body.contactmail,
        contactnumber: req.body.contactnumber,
        companycounty: req.body.companycounty,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "Müşteri başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerByName = async (req, res) => {
  try {
    const customerName = req.params.name;
    const customer = await Customer.findOne(customerName);

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    res.status(200).json(customer._id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerNameById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }
    res.status(200).json({ customername: customer.companyname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.industryAddToCustomer = async (req, res) => {
  try {
    const industry = req.body.industry;

    const id = req.params.id;
    const isExisting = await Customer.findById(id);
    if (isExisting.industries.includes(industry)) {
      return res.status(400).json({ error: "Bu Sektör Zaten Mevcut." });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $push: { industries: [industry] },
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.industryRemoveFromCustomer = async (req, res) => {
  try {
    const industry = req.body.industry;
    const id = req.params.id;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $pull: { industries: industry },
      },
      { new: true }
    );

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerIndustries = async (req, res) => {
  try {
    const id = req.params.id;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Müşteri bulunamadı." });
    }

    const industries = customer.industries;

    res.status(200).json({ industries: industries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.companyAddToCustomer = async (req, res) => {
  try {
    const company = req.body.company;
    const id = req.params.id;

    const isExisting = await Customer.findById(id);
    if (isExisting.companies.includes(company)) {
      return res.status(400).json({ error: "Bu Şirket Zaten Mevcut." });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $push: { companies: company },
      },
      { new: true }
    );

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.companyRemoveFromCustomer = async (req, res) => {
  try {
    const company = req.body.company;
    const id = req.params.id;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $pull: { companies: company },
      },
      { new: true }
    );

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerCompanies = async (req, res) => {
  try {
    const id = req.params.id;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Müşteri bulunamadı." });
    }

    const companies = customer.companies;

    res.status(200).json({ companies: companies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateCompanyByName = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
       
        companies: req.body.companies,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

