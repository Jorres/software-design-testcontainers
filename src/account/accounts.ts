import client from "./exchange_client";

export type Stock = {
    corpname: string;
    quantity: number;
};

export type User = {
    id: number;
    name: string;
    stocksOwned: Array<Stock>;
    balance: number;
};

export class Accounts {
    users: Array<User>;

    constructor() {
        this.users = [];
    }

    createUser = async (id: number, newUser: User) => {
        const user = this.users.find((user) => user.id == id);
        if (user) {
            return 400;
        } else {
            this.users.push(newUser);
            return 201;
        }
    };

    changeBalance = async (id: number, delta: number) => {
        const user = this.users.find((user) => user.id == id);
        if (user) {
            if (user.balance + delta > 0) {
                user.balance += delta;
                return 200;
            } else {
                return 400;
            }
        } else {
            return 404;
        }
    };

    getUserStocks = async (id: number) => {
        const user = this.users.find((user) => user.id == id);
        if (user) {
            const stocksData = await Promise.all (user.stocksOwned.map(async (stock) => ({
                ...stock,
                stockPrice: await client.getStockPrice(stock.corpname),
            })));
            return [200, stocksData];
        } else {
            return [404, null];
        }
    };

    getBalance = async (id: number) => {
        const user = this.users.find((user) => user.id == id);
        if (!user) {
            return [404, null];
        }

        let totalStocksValue = (
            await Promise.all(
                user.stocksOwned.map(async (stock) => {
                    return (
                        (await client.getStockPrice(stock.corpname)) *
                        stock.quantity
                    );
                })
            )
        ).reduce((a, b) => a + b, 0);

        return [200, totalStocksValue + user.balance];
    };

    makeTransaction = async (
        id: number,
        corpname: string,
        quantity: number
    ) => {
        const user = this.users.find((user) => user.id == id);

        if (!user) {
            return 404;
        }

        let userStocksOnRequest = user.stocksOwned.filter(
            (stock) => stock.corpname == corpname
        );

        let currentStockInfo: Stock | null = null;

        if (userStocksOnRequest.length == 0) {
            let newStockRecord: Stock = {
                corpname,
                quantity: 0,
            };
            user.stocksOwned.push(newStockRecord);
            currentStockInfo = newStockRecord;
        } else {
            currentStockInfo = userStocksOnRequest[0];
        }

        if (currentStockInfo.quantity + quantity < 0) {
            return 400;
        }

        const transactionCost =
            (await client.getStockPrice(corpname)) * quantity;

        if (user.balance - transactionCost < 0) {
            return 400;
        }

        user.balance -= transactionCost;
        currentStockInfo.quantity += quantity;

        return 200;
    };
}
