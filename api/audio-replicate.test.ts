import { describe, expect, it } from "vitest";
import { stemsFrom } from "./_audioReplicate";

describe("Demucs result mapping", () => {
  it("uses the other output as the complementary MR stem", () => {
    expect(stemsFrom({
      vocals: "https://files.example/vocals.mp3",
      other: "https://files.example/mr.mp3",
    })).toEqual({
      vocalsUrl: "https://files.example/vocals.mp3",
      instrumentalUrl: "https://files.example/mr.mp3",
    });
  });
});
