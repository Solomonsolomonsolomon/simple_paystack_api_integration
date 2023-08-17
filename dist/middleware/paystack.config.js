"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const paystack = (() => {
    function initializetransaction(res, body) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post("https://api.paystack.co/transaction/initialize", body, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.SECRET_KEY}`,
                },
            })
                .then((response) => {
                resolve(response.data);
            })
                .catch((err) => {
                reject(err.message);
            });
        });
    }
    function verifyPayment(res, ref) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.SECRET_KEY}`,
                },
            })
                .then((response) => {
                resolve(response.data);
            })
                .catch((err) => {
                reject(err.message);
            });
        });
    }
    return {
        initializetransaction,
        verifyPayment,
    };
})();
exports.default = paystack;
