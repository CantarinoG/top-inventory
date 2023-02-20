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
    res.render("categoryCreate", {
        title: "Create Category"
    });
}

exports.categoryCreatePost = [
    body("name", "Name is required.").trim().isLength({min: 1}).escape(),
    body("description", "Description is required.").trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });
        if(!errors.isEmpty()){
            res.render("categoryCreate", {
                title: "Create Category",
                category: category,
                errors: errors.array()
            });
            return;
        }
        category.save((err) => {
            if(err) {
                return next(err);
            }
            res.redirect(category.url);
        });
    }
]

exports.categoryDeleteGet = (req, res, next) => {
    async.parallel(
        {
            category(callback){
                Category.findById(req.params.id).exec(callback);
            },
            items(callback){
                    Item.find({category: req.params.id}).exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results.category == null) {
                res.redirect("/categories");
            }
            res.render("categoryDelete", {
                category: results.category,
                items: results.items
            });
        }
    );
}

exports.categoryDeletePost = (req, res, next) => {
    async.parallel(
        {
            category(callback){
                Category.findById(req.params.id).exec(callback);
            },
            items(callback){
                    Item.find({category: req.params.id}).exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results.items.length > 0) {
                res.render("categoryDelete", {
                    category: results.category,
                    items: results.items,
                    alert: "You must remove all items in the category before deleting."
                });
                return;
            }
            Category.findByIdAndRemove(req.params.id, (err) => {
                if(err) {
                    return next(err);
                }
                res.redirect("/categories");
            });
        }
    );
}

exports.categoryUpdateGet = (req, res, next) => {
    Category.findById(req.params.id).exec(function(err, category) {
        if(err) return next(err);
        if(category == null) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }
        res.render("categoryCreate", {
            title: "Update Category",
            category: category
        })
    });
}

exports.categoryUpdatePost = [
    body("name", "Name is required.").trim().isLength({min: 1}).escape(),
    body("description", "Description is required.").trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });
        if(!errors.isEmpty()){
            res.render("categoryCreate", {
                title: "Update Category",
                category: category,
                errors: errors.array()
            });
            return;
        }
        Category.findByIdAndUpdate(req.params.id, category, {}, (err, updatedCategory) => {
            if(err) return next(err);
            res.redirect(updatedCategory.url);
        });
    }
]