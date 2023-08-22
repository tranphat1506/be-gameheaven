const cartService = require('../services/cart.service');
const getCartInfo = (req, res) => {
    const { id } = req.body;
    if (!id)
        return res.status(400).json({
            code: 400,
            message: 'Fail.',
        });
    cartService
        .getCartInfoById(id)
        .then((data) => {
            //console.log(data);
            return res.status(200).json({
                code: 200,
                message: 'Success.',
                payload: data,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: 'Server đang bận.',
            });
        });
};

const GET_CART = 0;
const ADD_ITEM = 1;
const REMOVE_ITEM = 2;
const updateCart = async (req, res) => {
    const _id = req.body._id;
    if (!_id)
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized!',
        });
    const type = req.body.type;
    const updated_items = req.body.updated_items;
    switch (type) {
        case GET_CART:
            cartService
                .getCartInfoById(_id)
                .then((data) => {
                    //console.log(data);
                    return res.status(200).json({
                        code: 200,
                        message: 'Success.',
                        payload: data,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        code: 500,
                        message: 'Server đang bận.',
                    });
                });
            break;
        case ADD_ITEM:
            if (!updated_items || !updated_items.length)
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden!',
                });
            cartService
                .addItemToCart(_id, updated_items)
                .then((data) => {
                    return res.status(200).json({
                        code: 200,
                        payload: data,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({
                        code: 500,
                        message: 'Server đang bận.',
                    });
                });
            break;
        default:
            return res.status(403).json({
                code: 403,
                message: 'Forbidden!',
            });
    }
};

module.exports = {
    getCartInfo,
    updateCart,
};
