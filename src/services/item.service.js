const { ItemModel } = require('../models/item.model');
const { urlAlphabet, customAlphabet } = require('nanoid');
const genUuid = customAlphabet(urlAlphabet, 15);

const findItemById = (id) => {
    return new Promise((resolve, reject) => {
        ItemModel.findById(id)
            .then((item) => {
                return resolve(item);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const findItemByTag = async (tagsArray) => {
    const tagsArrayRegex = tagsArray.map((tag) => new RegExp(tag, 'miu'));
    return new Promise((resolve, reject) => {
        //{ tags: { $in: tagsArrayRegex } }
        ItemModel.distinct('itemName', {
            tags: { $in: tagsArrayRegex },
            itemName: { $in: tagsArrayRegex },
            nameHistory: { $in: tagsArrayRegex },
            'typeOfItem.display': { $in: tagsArrayRegex },
        })
            .then((items) => {
                return resolve({ found: items.length, items });
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const findItemByDeepSearching = async (tagsArray) => {
    const tagsArrayRegex = new RegExp(tagsArray.join('|'), 'mui');
    console.log(tagsArrayRegex);
    return new Promise((resolve, reject) => {
        ItemModel.find(
            // prettier-ignore
            { $text: { $search: /s/ } },
            { score: { $meta: 'textScore' } },
        )
            .sort({ score: { $meta: 'textScore' } })
            .then((items) => {
                return resolve({ found: items.length, items });
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const createItem = ({
    itemName,
    quantity,
    isDiscount,
    originalPrice,
    salePrice,
    public,
    typeId,
    typeDisplay,
    tagsArray,
}) => {
    const id = genUuid();
    console.log(id);
    const newItem = new ItemModel({
        _id: id,
        public,
        itemName,
        quantity,
        prices: {
            isDiscount,
            originalPrice,
            salePrice,
        },
        typeOfItem: {
            id: typeId,
            display: typeDisplay,
        },
        tags: tagsArray,
    });
    return newItem.save();
};

const detailStore = () => {
    const allItems = ItemModel.find().count();
    const privateItems = ItemModel.find({ public: false }).count();
    const publicItems = ItemModel.find({ public: true }).count();
    return new Promise((resolve, reject) => {
        Promise.all([allItems, privateItems, publicItems])
            .then((result) => {
                return resolve({
                    totalCount: result[0],
                    privateCount: result[1],
                    publicCount: result[2],
                });
            })
            .catch((err) => {
                return reject(err);
            });
    });
};
module.exports = {
    createItem,
    detailStore,
    findItemById,
    findItemByTag,
    findItemByDeepSearching,
};
