require("dotenv").config();
import express, { Application, Request, Response } from "express";
const app: Application = express();
const port: number | string = process.env.PORT || 1999;
import cors from "cors";
import paystack from "./middleware/paystack.config";

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/paystack/pay", (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    if (!email || !amount) {
      throw new Error("enter email and amount");
    }
    const body = JSON.stringify({
      email,
      amount: amount * 100,
    });
    paystack
      .initializetransaction(res, body)
      .then(({ data }: any) => {
        res.status(200).json({
          url: data.authorization_url,
          msg: "redirect your application to the url provided in the url method",
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`paystack api integration on port ${port}`);
});
