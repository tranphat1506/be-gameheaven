const DB = require('mongoose');
const ItemSchema = new DB.Schema({
    _id: String,
    public: { type: Boolean, default: false },
    typeOfItem: {
        id: { type: Number, default: 0 },
        display: { type: String, default: 'Sản phẩm chưa được cập nhật' },
    },
    quantity: { type: Number, default: 0 }, // quantity left
    itemName: {
        type: String,
        default: 'Sản phẩm chưa được cập nhật',
    },
    itemImages: [
        {
            imgSrc: String,
            imgAlt: String,
        },
    ],
    prices: {
        isDiscount: { type: Boolean, default: false },
        originalPrice: Number,
        salePrice: Number, // this price is for sale
    },
    nameHistory: [],
    tags: [],
});
// ItemSchema.index(
//     {
//         itemName: 'text',
//         nameHistory: 'text',
//         tags: 'text',
//         'typeOfItem.display': 'text',
//     },
//     { sparse: true },
// );
const ItemModel = DB.model('items', ItemSchema);
module.exports = {
    ItemModel,
};
