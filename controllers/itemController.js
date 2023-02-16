const Item = require("../models/item.js");

exports.itemList = (req, res, next) => {
    Item.find({})
    .sort({name: 1})
    .populate("category")
    .exec(function (err, listItems) {
        if (err) {
            next(err);
        }
        res.render("itemList", {
            listItems: listItems
        });
    });
}

exports.itemDetail = (req, res, next) => {
    res.send(`Item detail: ${req.params.id}`);
}

exports.itemCreateGet = (req, res, next) => {
    res.send("Item create GET");
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