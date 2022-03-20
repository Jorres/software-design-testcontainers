import express from "express";
import { Request, Response } from "express";
const router = express.Router();

type Corp = {
    name: string;
    currentStockPrice: number;
    stockQuantity: number;
};

const corps: Array<Corp> = [];

const getCorpInfo = async (req: Request, res: Response) => {
    let corpname: string = (req as any).params.corpname;
    const corp = corps.find((corp) => corp.name == corpname);
    if (corp) {
        return res.status(200).json(corp);
    } else {
        return res.status(404);
    }
};

const postCorp = async (req: Request, res: Response) => {
    const newCorp = JSON.parse(req.body) as Corp;
    const curCorp = corps.find((corp) => corp.name == newCorp.name);
    if (curCorp) {
        return res.status(400);
    } else {
        corps.push(newCorp);
        return res.status(201);
    }
};

const buyStocks = async (req: Request, res: Response) => {
    let corpname: string = (req as any).params.corpname;
    let quantity: number = Number.parseFloat((req as any).params.quantity);
    const corp = corps.find((corp) => corp.name == corpname);
    if (corp) {
        if (corp.stockQuantity >= quantity) {
            corp.stockQuantity -= quantity;
            return res.status(200);
        } else {
            return res.status(400);
        }
    } else {
        return res.status(404);
    }
};

const changePrice = async (req: Request, res: Response) => {
    let corpname: string = (req as any).params.corpname;
    let newprice: number = Number.parseFloat((req as any).params.newprice);
    if (newprice <= 0) {
        return res.status(400);
    }

    const corp = corps.find((corp) => corp.name == corpname);
    if (corp) {
        corp.currentStockPrice = newprice;
    } else {
        return res.status(404);
    }
};

const ping = async (req: Request, res: Response) => {
    return res.status(200).json({pong: "pong"});
}

router.get("/stock/:corpname", getCorpInfo);
router.post("/stock/:corpname", postCorp);
router.get("/stock/buy/:corpname/:quantity", buyStocks);
router.post("/price/:corpname/:newprice", changePrice);
router.get("/ping", ping)

export = router;
