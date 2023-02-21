const Item = require("../models/item.js");
const Category = require("../models/category.js");
const async = require("async");
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
                listCategories: listCategories,
                title: "Create Item"
            });
        }
    );
}

exports.itemCreatePost = [
    body("name", "Name must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
    body("description", "Description must not be empty.")
    .trim()
    .isLength({min: 1}),
    body("price", "Price must be a number.")
    .isNumeric().escape(),
    body("price", "Price must not be empty.")
    .notEmpty().escape(),
    body("category", "A category must be selected.")
    .notEmpty().escape(),
    body("imageURL").trim(),
    body("pass", "Invalid password.").custom( (value, {req, loc, path}) => {
        if ('123' !== req.body.pass) {
            throw new Error("Invalid password.");
        } else {
            return value;
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            inStock: req.body.inStock,
            image: req.body.imageURL
        });
        if (!errors.isEmpty()) {
            Category.find({}).sort({name: 1}).exec(
                function (err, listCategories) {
                    if (err) {
                        return next(err);
                    }
                    res.render("itemCreate", {
                        listCategories: listCategories,
                        item: item,
                        errors: errors.array(),
                        title: "Create Item"
                    });
                }
            );
        return;
        }
        item.save((err) => {
            if(err) {
                return next(err);
            }
            res.redirect(item.url);
        })

    }
];

exports.itemDeleteGet = (req, res, next) => {
    Item.findById(req.params.id).exec(
        function(err, item) {
            if(err) {
                return next(err);
            }
            if(item == null){
                res.redirect("/items");
            }
            res.render("itemDelete", {
                item: item
            });
        }
    );
}

exports.itemDeletePost = [
    body("pass", "Invalid password.").custom( (value, {req, loc, path}) => {
        if ('123' !== req.body.pass) {
            throw new Error("Invalid password.");
        } else {
            return value;
        }
    }),
    (req, res, next) => {
        Item.findById(req.params.id).exec(
            function(err, item) {
                const errors = validationResult(req);
                if(err) {
                    return next(err);
                }
                if(item == null){
                    res.redirect("/items");
                }
                if (!errors.isEmpty()) {
                    res.render("itemDelete", {
                        item: item,
                        errors: errors.array()
                    });
                    return;
                }
                Item.findByIdAndRemove(req.params.id, (err) => {
                    if(err) {
                        return next(err);
                    }
                    res.redirect("/items");
                })
            }
        );
    }
];

exports.itemUpdateGet = (req, res, next) => {
    async.parallel({
        item(callback) {
            Item.findById(req.params.id).exec(callback);
        },
        categories(callback) {
            Category.find({}).exec(callback);
        }
    },
    (err, results) => {
        if(err) return next(err);
        if(results.item == null){
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }
        res.render("itemCreate", {
            listCategories: results.categories,
            item: results.item,
            title: "Update Item"
        });
    });
}

exports.itemUpdatePost = [
    body("name", "Name must not be empty.")
    .trim()
    .isLength({min: 1})
    .escape(),
    body("description", "Description must not be empty.")
    .trim()
    .isLength({min: 1}),
    body("price", "Price must be a number.")
    .isNumeric().escape(),
    body("price", "Price must not be empty.")
    .notEmpty().escape(),
    body("category", "A category must be selected.")
    .notEmpty().escape(),
    body("imageURL").trim(),
    body("pass", "Invalid password.").custom( (value, {req, loc, path}) => {
        if ('123' !== req.body.pass) {
            throw new Error("Invalid password.");
        } else {
            return value;
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            inStock: req.body.inStock,
            image: req.body.imageURL,
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            Category.find({}).sort({name: 1}).exec(
                function (err, listCategories) {
                    if (err) {
                        return next(err);
                    }
                    res.render("itemCreate", {
                        listCategories: listCategories,
                        item: item,
                        errors: errors.array(),
                        title: "Update Item"
                    });
                }
            );
        return;
        }
        Item.findByIdAndUpdate(req.params.id, item, {}, (err, updatedItem) => {
            if(err) return next(err);
            res.redirect(updatedItem.url);
        })
    }
];