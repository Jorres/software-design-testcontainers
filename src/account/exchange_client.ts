import axios from "axios";

const exchange_address = "http://localhost:30001";

const instance = axios.create({
  baseURL: exchange_address,
  timeout: 1000,
});

const getStockPrice = async (corpname: string) => {
    const res = await instance.get(`/stock/${corpname}`);
    return (res.data as any).currentStockPrice;
}

export = {getStockPrice};
