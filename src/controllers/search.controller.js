const { findItemById } = require('../services/item.service');
const main = (req, res) => {
    // check
    const { v } = req.query;
    if (!v)
        return res.status(400).json({
            code: 400,
            message: 'Not found!',
        });
    findItemById(v)
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
            return res.status(200).json({
                code: 200,
                message: 'Found item!',
                payload: item,
            });
        });
};
module.exports = { main };
