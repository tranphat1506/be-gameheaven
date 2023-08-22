const DB = require('mongoose');
const UserSchema = new DB.Schema({
    _id: String,
    account_details: {
        user_name: String,
        password: String,
        role: {
            info: { type: String, default: 'client' }, // Only client or admin
            display: { type: String, default: false }, // Display a role to web
        },
        email: {
            is_verify: { type: Boolean, default: false },
            details: { type: String, default: false },
            verify_code: { type: String, default: false },
        },
        phone: {
            is_verify: { type: Boolean, default: false },
            details: { type: String, default: false },
        },
        created_at: { type: String, default: new Date().toISOString() },
    },
    info_details: {
        display_name: { type: String, default: false },
        birth: {
            day: Number,
            month: Number,
            year: Number,
        },
        sex: {
            display: { type: String, default: false },
            info: Number,
        },
        avatar_url: {
            type: String,
            default: 'https://cdn141.picsart.com/357697367045201.jpg',
        },
    },
    store_details: {
        purchase_history: [],
        purchase_queue: [],
        vouchers_save: [],
        vouchers_apply: [],
        cart_store: [
            {
                _id: false,
                item_id: String,
                quantity: Number,
                add_time: Number,
            },
        ],
    },
});
const UserModel = DB.model('Users', UserSchema);
module.exports = {
    UserModel,
};
