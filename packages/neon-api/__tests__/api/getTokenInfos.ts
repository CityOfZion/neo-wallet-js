import { rpc } from "@cityofzion/neon-core";
import { getTokenInfos } from "../../src/api/getTokenInfos";

describe("getTokenInfos", () => {
  test("success", async () => {
    const mockClient = ({
      invokeScript: jest.fn(async () => {
        return {
          script: "",
          state: "HALT",
          gasconsumed: "4000000",
          exception: null,
          stack: [
            {
              type: "ByteString",
              value: "R0FT",
            },
            {
              type: "ByteString",
              value: "Z2Fz",
            },
            {
              type: "Integer",
              value: "8",
            },
            {
              type: "Integer",
              value: "3000006384920100",
            },
            {
              type: "ByteString",
              value: "TkVP",
            },
            {
              type: "ByteString",
              value: "bmVv",
            },
            {
              type: "Integer",
              value: "0",
            },
            {
              type: "Integer",
              value: "100000000",
            },
          ],
        };
      }),
    } as unknown) as rpc.NeoServerRpcClient;

    const result = await getTokenInfos(
      [
        "668e0c1f9d7b70a99dd9e06eadd4c784d641afbc",
        "de5f57d430d3dece511cf975a8d37848cb9e0525",
      ],
      mockClient
    );

    expect(result).toStrictEqual([
      {
        name: "GAS",
        symbol: "gas",
        decimals: 8,
        totalSupply: "30000063.84920100",
      },
      {
        name: "NEO",
        symbol: "neo",
        decimals: 0,
        totalSupply: "100000000",
      },
    ]);
  });

  test("VM fault", async () => {
    const mockClient = ({
      invokeScript: jest.fn(async () => {
        return {
          script: "",
          state: "FAULT",
          gasconsumed: "4000000",
          exception: "expected exception message",
          stack: [],
        };
      }),
    } as unknown) as rpc.NeoServerRpcClient;

    expect(
      async () =>
        await getTokenInfos(
          ["668e0c1f9d7b70a99dd9e06eadd4c784d641afbc"],
          mockClient
        )
    ).rejects.toThrow("expected exception message");
  });

  test("VM fault without exception message", async () => {
    const mockClient = ({
      invokeScript: jest.fn(async () => {
        return {
          script: "",
          state: "FAULT",
          gasconsumed: "4000000",
          stack: [],
        };
      }),
    } as unknown) as rpc.NeoServerRpcClient;

    expect(
      async () =>
        await getTokenInfos(
          ["668e0c1f9d7b70a99dd9e06eadd4c784d641afbc"],
          mockClient
        )
    ).rejects.toThrow("No exception returned");
  });
});
