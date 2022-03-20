import axios from "axios";
import { GenericContainer } from "testcontainers";

test("exchange container answers for ping", async () => {
    const container = await new GenericContainer("tmp")
        .withExposedPorts({
            container: 30001,
            host: 30001,
        })
        .start();

    const instance = axios.create({
        baseURL: "http://localhost:30001",
    });

    const rsp = await instance.get("/ping");
    expect(rsp.data).toContain("pong");
    container.stop();
});
