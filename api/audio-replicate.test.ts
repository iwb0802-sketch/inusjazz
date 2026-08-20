import { describe, expect, it } from "vitest";
import { extractStemUrls } from "./_audioReplicate";

describe("Demucs stem results", () => {
  it("uses Demucs other output as the MR accompaniment stem", () => {
    expect(extractStemUrls({ vocals: "https://files.example/vocals.mp3", other: "https://files.example/other.mp3" })).toEqual({ vocalsUrl: "https://files.example/vocals.mp3", instrumentalUrl: "https://files.example/other.mp3" });
  });
});
