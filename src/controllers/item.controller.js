const {
    createItem,
    detailStore,
    findItemById,
    findItemByTag,
    findItemByDeepSearching,
} = require('../services/item.service');
const create = (req, res) => {
    const {
        itemName,
        quantity,
        isDiscount,
        originalPrice,
        salePrice,
        public,
        typeId,
        typeDisplay,
        tagsArray,
    } = req.body;
    if (!itemName)
        return res.status(403).json({
            code: 403,
            message: 'No name!',
        });
    createItem({
        itemName,
        quantity,
        isDiscount,
        originalPrice,
        salePrice,
        public,
        typeId,
        typeDisplay,
        tagsArray,
    })
        .then((item) => {
            console.log(item);
            return res.status(200).json({
                code: 200,
                message: 'Created success item!',
            });
        })
        .catch((err) => {
            return res.status(400).json({
                code: 400,
                message: err,
            });
        });
};
const getDetailStore = (req, res) => {
    const fetchDetailStore = detailStore();
    fetchDetailStore
        .then((result) => {
            return res.status(200).json({
                code: 200,
                message: 'OK',
                payload: result,
            });
        })
        .catch((err) => {
            return res.status(400).json({
                code: 400,
                message: err,
            });
        });
};
const findById = (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({
            code: 400,
            message: 'Not found',
        });
    findItemById(id)
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                code: 400,
                message: 'Not found!',
            });
        })
        .then((item) => {
            if (!item)
                return res.status(400).json({
                    code: 400,
                    message: 'Not found!',
                });
            console.log(item.quantity);
            return res.status(200).json({
                code: 200,
                message: 'Found item!',
                payload: item,
            });
        });
};
const findByTag = (req, res) => {
    const { tags } = req.body;
    if (!tags || !Array.isArray(tags))
        return res.status(400).json({
            code: 400,
            message: 'Not found',
        });
    findItemByTag(tags)
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                code: 400,
                message: 'Not found!',
            });
        })
        .then((items) => {
            if (!items)
                return res.status(400).json({
                    code: 400,
                    message: 'Not found!',
                });
            return res.status(200).json({
                code: 200,
                message: 'Found item!',
                payload: items,
            });
        });
};
const findByDeepSearching = (req, res) => {
    let { v } = req.query;
    if (!v || !v.trim())
        return res.status(400).json({
            code: 400,
            message: 'Not found',
        });
    v = v.trim().split(' ');
    console.log(v);
    findItemByDeepSearching(v)
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                code: 400,
                message: 'Not found!',
            });
        })
        .then((items) => {
            if (!items)
                return res.status(400).json({
                    code: 400,
                    message: 'Not found!',
                });
            return res.status(200).json({
                code: 200,
                message: 'Found item!',
                payload: items,
            });
        });
};
module.exports = {
    create,
    getDetailStore,
    findById,
    findByTag,
    findByDeepSearching,
};
