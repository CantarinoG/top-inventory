const Category = require("../models/category.js");

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
    res.send(`Category detail: ${req.params.id}`);
}

exports.categoryCreateGet = (req, res, next) => {
    res.send("Category create GET");
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