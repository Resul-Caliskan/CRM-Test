const express = require("express");
const multer = require("multer");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const nomineeController = require("../controllers/nomineeController");

router.post("/nominee/add", nomineeController.addNominee);

router.post("/nominee/get-nominees", nomineeController.getNomineeByCompanyId);

router.post("/nominee/get-shared", nomineeController.getSharedNominees);

router.post("/nominee/get-all-nominees", nomineeController.getAllNominees);

router.put("/nominee/add-favorites/:id", nomineeController.addFavorite);

router.put("/nominee/delete-favorites/:id", nomineeController.deleteFavorites);

router.get("/nominee/get-favorites/:id", nomineeController.getAllFavorites);

router.post(
  "/nominee/get-position-shared-nominees",
  nomineeController.getSharedomineesByPositionId
);

router.post(
  "/nominee/get-position-requested-nominees",
  nomineeController.getRequestedNomineesByPositionId
);

router.post(
  "/nominee/get-position-suggested-nominees",
  nomineeController.getSuggestedNomineesByPositionId
);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/getcv",

  nomineeController.downloadCv
);
router.get(
  "/getallcvs/:id",

  nomineeController.getPdfById
);

module.exports = router;