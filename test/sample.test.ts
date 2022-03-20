import axios from "axios";
import { GenericContainer } from "testcontainers";

jest.setTimeout(60000);


test("docker-hello container runs", async () => {
    let lines: string[] = [];
    const container = await new GenericContainer("hello-world").start();

    const stream = await container.logs();
    stream
        .on("data", (line) => lines.push(line))
        .on("end", () => {});

    setTimeout(() => {
        expect(lines.toString()).toContain("Docker");
    }, 1000);
});

