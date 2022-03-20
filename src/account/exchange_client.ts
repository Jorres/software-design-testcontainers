import axios from "axios";

const exchange_address = "http://localhost:30001";

const instance = axios.create({
  baseURL: exchange_address,
  timeout: 1000,
});

const getStockPrice = async (corpname: string) => {
    return JSON.parse(await instance.get(`/stock/${corpname}`));
}

export = {getStockPrice};
