var express = require('express');
var router = express.Router();

const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');

router.get("/", (req, res, next) => {
  async.parallel(
    {
      categoryCount(callback){
        Category.countDocuments({}, callback);
      },
      itemCount(callback){
        Item.countDocuments({}, callback);
      }
    },
    (err, results) => {
      res.render("index", {
        error: err,
        data: results
      });
    }
  );
})

router.get("/category/create", categoryController.categoryCreateGet);
router.post("/category/create", categoryController.categoryCreatePost);
router.get("/category/:id/delete", categoryController.categoryDeleteGet);
router.post("/category/:id/delete", categoryController.categoryDeletePost);
router.get("/category/:id/update", categoryController.categoryUpdateGet);
router.post("/category/:id/update", categoryController.categoryUpdatePost);
router.get("/category/:id", categoryController.categoryDetail);
router.get("/categories", categoryController.categoryList);

router.get("/item/create", itemController.itemCreateGet);
router.post("/item/create", itemController.itemCreatePost);
router.get("/item/:id/delete", itemController.itemDeleteGet);
router.post("/item/:id/delete", itemController.itemDeletePost);
router.get("/item/:id/update", itemController.itemUpdateGet);
router.post("/item/:id/update", itemController.itemUpdatePost);
router.get("/item/:id", itemController.itemDetail);
router.get("/items", itemController.itemList);

module.exports = router;
