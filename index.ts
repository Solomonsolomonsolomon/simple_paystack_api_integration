require("dotenv").config();
import express, {
  Application,
  Request,
  Response,
  RequestHandler,
} from "express";
const app: Application = express();
const port: number | string = process.env.PORT || 1999;
import cors, { CorsOptions } from "cors";
import paystack from "./middleware/paystack.config";
const corsOptions: CorsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//# initialize transaction
app.post("/paystack/pay", async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    if (!email || !amount) {
      throw new Error("enter email and amount");
    }
    const body = JSON.stringify({
      email,
      amount: amount * 100,
    });
    
    await paystack
      .initializetransaction(res, body)
      .then(({ data }: any) => {
        res.status(200).json({
          url: data.authorization_url,
          msg: "redirect your application to the url provided in the url method then hit /paystack/verify route in this api to verify payment",
          ref: data.reference,
        });
      })
      .catch((err) => {
        throw err;
      });   
  } catch (error: any) {
    return res.status(400).json({ message: error.message, error });
  }
});
//# verify payment
app.get("/paystack/verify", async (req: Request, res: Response) => {
  try {
    let { ref }: any = req.query;
    await paystack
      .verifyPayment(res, ref)
      .then((data: any) => {
        res.status(200).json({ transaction_status: data.data.status });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, error });
  }
});
// #listener function
app.listen(port, () => {
  console.log(`paystack api integration on port ${port}`);
});
