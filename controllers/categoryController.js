const Category = require("../models/category.js");
const Item = require("../models/item.js");
const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.categoryList = (req, res, next) => {
    Category.find({})
    .sort({name: 1})
    .exec(function (err, listCategories){
        if (err) {
            return next(err);
        }
        res.render("categoryList", {
            listCategories: listCategories
        });
    }); 
}

exports.categoryDetail = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            items(callback) {
                Item.find({category: mongoose.Types.ObjectId(req.params.id)}).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if(results.category == null){
                const err = new Error("Category not found");
                err.status = 404;
                return next(err);
            }
            res.render("categoryDetail", {
                category: results.category,
                items: results.items
            });
        }
    );
}

exports.categoryCreateGet = (req, res, next) => {
    res.render("categoryCreate");
}

exports.categoryCreatePost = (req, res, next) => {
    res.send("Category create POST");
}

exports.categoryDeleteGet = (req, res, next) => {
    res.send("Category delete GET");
}

exports.categoryDeletePost = (req, res, next) => {
    res.send("Category delete POST");
}

exports.categoryUpdateGet = (req, res, next) => {
    res.send("Category update GET");
}

exports.categoryUpdatePost = (req, res, next) => {
    res.send("Category update POST");
}