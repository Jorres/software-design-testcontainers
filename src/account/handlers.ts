import express from "express";
import { Request, Response } from "express";
import { Accounts, User } from "./accounts";

const router = express.Router();

const accounts = new Accounts();

const createUser = async (req: Request, res: Response) => {
    const id: number = Number.parseInt((req as any).params.id);
    const newUser = req.body;
    const status = await accounts.createUser(id, newUser)
    return res.status(status);
};

const changeBalance = async (req: Request, res: Response) => {
    const id: number = Number.parseInt((req as any).params.id);
    const delta: number = Number.parseInt((req as any).params.delta);

    const status = await accounts.changeBalance(id, delta);
    return res.status(status);
};

const getBalance = async (req: Request, res: Response) => {
    const id: number = Number.parseInt((req as any).params.id);
    const [status, balance] = await accounts.getBalance(id);
    if (status == 200) {
        return res.status(200).json(balance);
    } else {
        return res.status(404);
    }
};

const getUserStocks = async (req: Request, res: Response) => {
    const id: number = Number.parseInt((req as any).params.id);

    const [status, stocksData] = await accounts.getUserStocks(id);

    if (status == 200) {
        return res.status(200).json(stocksData);
    } else {
        return res.status(404);
    }
};

const makeTransaction = async (req: Request, res: Response) => {
    const id: number = Number.parseInt((req as any).params.id);
    const corpname: string = (req as any).params.corpname;
    const quantity: number = Number.parseInt((req as any).params.quantity);

    const status = await accounts.makeTransaction(id, corpname, quantity);
    return res.status(status);
}

router.post("/user/:id/", createUser);
router.post("/user/:id/:delta", changeBalance);
router.post("/user/:id/stocks", getUserStocks);
router.post("/user/:id/balance", getBalance);
router.post("/user/:id/:corpname/:quantity", makeTransaction);

export = router;
