const Item = require("../models/item.js");
const Category = require("../models/category.js");
const { body, validationResult } = require("express-validator");

exports.itemList = (req, res, next) => {
    Item.find({})
    .sort({name: 1})
    .populate("category")
    .exec(function (err, listItems) {
        if (err) {
            return next(err);
        }
        res.render("itemList", {
            listItems: listItems
        });
    });
}

exports.itemDetail = (req, res, next) => {
    Item.findById(req.params.id)
    .populate("category")
    .exec(function (err, item) {
        if (err) {
            return next(err);
        }
        if (item == null) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }
        res.render("itemDetail", {
            item: item
        });
    });
}

exports.itemCreateGet = (req, res, next) => {
    Category.find({}).sort({name: 1}).exec(
        function (err, listCategories) {
            if (err) {
                return next(err);
            }
            res.render("itemCreate", {
                listCategories: listCategories
            });
        }
    );
}

exports.itemCreatePost = (req, res, next) => {
    res.send("Item create POST");
}

exports.itemDeleteGet = (req, res, next) => {
    res.send("Item delete GET");
}

exports.itemDeletePost = (req, res, next) => {
    res.send("Item delete POST");
}

exports.itemUpdateGet = (req, res, next) => {
    res.send("Item update GET");
}

exports.itemUpdatePost = (req, res, next) => {
    res.send("Item update POST");
}