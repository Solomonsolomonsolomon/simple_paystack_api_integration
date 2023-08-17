"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 1999;
const cors_1 = __importDefault(require("cors"));
const paystack_config_1 = __importDefault(require("./middleware/paystack.config"));
const corsOptions = {
    origin: "*",
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
//# initialize transaction
app.post("/paystack/pay", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, amount } = req.body;
        if (!email || !amount) {
            throw new Error("enter email and amount");
        }
        const body = JSON.stringify({
            email,
            amount: amount * 100,
        });
        yield paystack_config_1.default
            .initializetransaction(res, body)
            .then(({ data }) => {
            res.status(200).json({
                url: data.authorization_url,
                msg: "redirect your application to the url provided in the url method then hit /paystack/verify route in this api to verify payment",
                ref: data.reference,
            });
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message, error });
    }
}));
//# verify payment
app.get("/paystack/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { ref } = req.query;
        yield paystack_config_1.default
            .verifyPayment(res, ref)
            .then((data) => {
            res.status(200).json({ transaction_status: data.data.status });
        })
            .catch((err) => {
            throw err;
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message, error });
    }
}));
// #listener function
app.listen(port, () => {
    console.log(`paystack api integration on port ${port}`);
});
