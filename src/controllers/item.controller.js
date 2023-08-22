const {
    createItem,
    detailStore,
    findItemById,
    findItemByTag,
    findItemByDeepSearching,
} = require('../services/item.service');
const { logEvents } = require('../middlewares/logEvents');
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
    const { q } = req.query;
    if (!id)
        return res.status(400).json({
            code: 400,
            message: 'Not found',
        });
    findItemById(id)
        .catch((error) => {
            process.env.NODE_ENV != 'development'
                ? logEvents(`${error.name}: ${error.message}`, `errors`)
                : console.log(`${error.name}: ${error.message}`);
            return res.status(500).json({
                code: 500,
                message: 'Hệ thống đang bận!',
            });
        })
        .then((item) => {
            if (!item)
                return res.status(404).json({
                    code: 404,
                    message: 'Not found!',
                });
            if (q > 0 && q > item.quantity)
                // out of stock
                return res.status(200).json({
                    code: 200,
                    message: 'Found item!',
                    payload: { item, status: 'out-stock' },
                });
            return res.status(200).json({
                code: 200,
                message: 'Found item!',
                payload: { item, status: 'in-stock' },
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
// const findByDeepSearching = (req, res) => {
//     let { v } = req.query;
//     if (!v || !v.trim())
//         return res.status(400).json({
//             code: 400,
//             message: 'Not found',
//         });
//     v = v.trim();
//     console.log(v);
//     findItemByDeepSearching(v)
//         .catch((err) => {
//             console.log(err);
//             return res.status(400).json({
//                 code: 400,
//                 message: 'Not found!',
//             });
//         })
//         .then((items) => {
//             if (!items)
//                 return res.status(400).json({
//                     code: 400,
//                     message: 'Not found!',
//                 });
//             return res.status(200).json({
//                 code: 200,
//                 message: 'Found item!',
//                 payload: items,
//             });
//         });
// };
module.exports = {
    create,
    getDetailStore,
    findById,
    findByTag,
    //findByDeepSearching,
};
