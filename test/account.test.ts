import axios from "axios";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { Accounts, User } from "../src/account/accounts";

let container: StartedTestContainer;

beforeEach(async () => {
    container = await new GenericContainer("exchange-emulator")
        .withExposedPorts({
            container: 30001,
            host: 30001,
        })
        .start();
});

afterEach(async () => {
    await container.stop();
});

test("account gets created", async () => {
    let accounts = new Accounts();

    const user: User = {
        id: 1,
        name: "Egor",
        stocksOwned: [],
        balance: 0,
    };

    let res = await accounts.createUser(1, user);

    expect(res).toBe(201);

    let [status1, stocks] = await accounts.getUserStocks(1);
    expect(status1).toBe(200);
    expect(stocks).toStrictEqual([]);

    let [status2, balance] = await accounts.getBalance(1);
    expect(status2).toBe(200);
    expect(balance).toBe(0);
});

test("change account balance", async () => {
    let accounts = new Accounts();

    const user: User = {
        id: 1,
        name: "Egor",
        stocksOwned: [],
        balance: 0,
    };

    await accounts.createUser(1, user);

    let fillBy = 100;

    let status1 = await accounts.changeBalance(1, fillBy);
    expect(status1).toBe(200);

    let [status2, balance] = await accounts.getBalance(1);
    expect(status2).toBe(200);
    expect(balance).toBe(fillBy);
});

test("can buy one stock unit", async () => {
    let accounts = new Accounts();

    const user: User = {
        id: 1,
        name: "Egor",
        stocksOwned: [],
        balance: 100,
    };

    await accounts.createUser(1, user);

    let status1 = await accounts.makeTransaction(1, "Apple", 1);
    expect(status1).toBe(200);

    let [status2, stocks] = await accounts.getUserStocks(1);
    expect(status2).toBe(200);
    expect(stocks).toStrictEqual([{corpname: "Apple", stockPrice: 100, quantity: 1}])
});

test("balance changes after stock price changes", async () => {
    let accounts = new Accounts();

    const user: User = {
        id: 1,
        name: "Egor",
        stocksOwned: [],
        balance: 100,
    };

    let res = await accounts.createUser(1, user);
    expect(res).toBe(201);

    let startingPrice = 100;

    let status1 = await accounts.makeTransaction(1, "Apple", 1);
    expect(status1).toBe(200);

    let [status2, stocks2] = await accounts.getUserStocks(1);
    expect(status2).toBe(200);
    expect(stocks2).toStrictEqual([{corpname: "Apple", stockPrice: startingPrice, quantity: 1}])

    let newPrice = 50;
    await axios.get(`http://localhost:30001/price/Apple/${newPrice}`)

    let [status3, stocks3] = await accounts.getUserStocks(1);

    expect(status3).toBe(200);
    expect(stocks3).toStrictEqual([{corpname: "Apple", stockPrice: newPrice, quantity: 1}])
});


