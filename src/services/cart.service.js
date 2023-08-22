const { UserModel } = require('../models/users.model');
const { ItemModel } = require('../models/item.model');
const _ = require('underscore');
const getCartInfoById = (userId, limit = 0) => {
    return new Promise((resolve, reject) => {
        UserModel.aggregate([
            {
                $match: { _id: userId },
            },
            {
                $project: {
                    _id: 1,
                    totalItem: { $size: '$store_details.cart_store' },
                    store: {
                        $sortArray: {
                            input: '$store_details.cart_store',
                            sortBy: { add_time: 1 },
                        },
                    },
                },
            },
        ])
            .then(([data]) => {
                if (!data.totalItem) return resolve(data);
                const cartStore = {};
                const itemList = data.store.map((item) => {
                    cartStore[item.item_id] = { ...item };
                    delete cartStore[item.item_id]['item_id']; // dont need this field
                    return item.item_id;
                });
                // console.log('Item List: ', itemList);
                // console.log('Cart Store: ', cartStore);
                return [
                    data,
                    cartStore,
                    ItemModel.aggregate([
                        {
                            $match: {
                                _id: { $in: itemList },
                                public: true,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                typeOfItem: '$typeOfItem',
                                itemName: '$itemName',
                                quantity: '$quantity',
                                itemImages: '$itemImages',
                                prices: '$prices',
                                tags: '$tags',
                            },
                        },
                        {
                            $addFields: {
                                sort_index: {
                                    $indexOfArray: [itemList, '$_id'],
                                },
                            },
                        },
                        {
                            $sort: { sort_index: 1 },
                        },
                    ]),
                ];
            })
            .then(async ([storeInfo, cartStore, storeQueryPromise]) => {
                const store = await storeQueryPromise;
                let totalSalePrice = 0;
                let totalOriginalPrice = 0;
                await store.forEach((item) => {
                    const _id = item._id;
                    let status;
                    const quantity = cartStore[_id].quantity;
                    const maxQuantity = item.quantity;
                    if (maxQuantity <= 0) {
                        cartStore[_id].quantity = maxQuantity;
                        status = 'out-stock';
                    } else {
                        if (quantity > maxQuantity)
                            cartStore[_id].quantity = maxQuantity;
                        status = 'in-stock';
                    }
                    totalOriginalPrice += item.prices.isDiscount
                        ? item.prices.originalPrice
                        : item.prices.salePrice;
                    totalSalePrice += item.prices.salePrice;
                    // add to cart store
                    cartStore[_id] = {
                        ...item,
                        ...cartStore[_id],
                        status,
                    };
                });
                return resolve({
                    ...storeInfo,
                    totalOriginalPrice,
                    totalSalePrice,
                    store: cartStore,
                    store_default: storeInfo.store,
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};
const addItemToCart = (userId, updatedItems) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = await UserModel.findOne({ _id: userId });
            const cart = {
                store: userData.store_details.cart_store,
            };
            if (_.isUndefined(cart.store)) {
                cart._id = userId;
                cart.store = [];
            }
            await Promise.all(
                updatedItems.map(async (updateItem) => {
                    const item_id = updateItem._id;
                    const quantity = updateItem.quantity;
                    if (!item_id) return false;
                    // check quantity is enough
                    const [checkInStock] = await ItemModel.aggregate([
                        {
                            $match: {
                                _id: item_id,
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                totalQuantity: '$quantity',
                            },
                        },
                    ]);
                    const add_time = new Date().getTime();
                    // await Promise.all(
                    //     cart.store.map(async (item) => {
                    //         if (item.item_id !== item_id) return false;
                    //         if (
                    //             checkInStock.totalQuantity === 0 ||
                    //             checkInStock.totalQuantity <
                    //                 item.quantity + quantity
                    //         )
                    //             item.quantity = checkInStock.totalQuantity;
                    //         else item.quantity += quantity;
                    //         item.add_time = add_time;
                    //         existItem = true;
                    //     })
                    // );
                    // Loop check if already have item in cart
                    let existItem = false;
                    for (let index = 0; index < cart.store.length; index++) {
                        const item = cart.store[index];
                        if (item.item_id === item_id) {
                            if (
                                checkInStock.totalQuantity === 0 ||
                                checkInStock.totalQuantity <
                                    item.quantity + quantity
                            )
                                item.quantity = checkInStock.totalQuantity;
                            else item.quantity += quantity;
                            item.add_time = add_time;
                            existItem = true;
                            break;
                        }
                    }
                    // Push item to cart if dont found equal item in cart
                    if (!existItem)
                        cart.store.push({
                            item_id,
                            quantity: checkInStock.totalQuantity
                                ? checkInStock.totalQuantity === 0 ||
                                  quantity > checkInStock.totalQuantity
                                : quantity,
                            add_time,
                        });
                }),
            );
            // update cart
            userData.store_details.cart_store = cart.store;
            await userData.save();

            return resolve(cart);
        } catch (error) {
            console.log(error);
            return reject(error);
        }
    });
};
module.exports = {
    getCartInfoById,
    addItemToCart,
};
