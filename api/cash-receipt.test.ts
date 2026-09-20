import { describe, expect, it } from "vitest";
import {
  basicAuthorization,
  maskRecipient,
  sameSecret,
  validateIssueInput,
} from "./_cashReceipt.js";

describe("cash receipt validation", () => {
  it("accepts a valid phone receipt request", () => {
    const parsed = validateIssueInput({
      mstSeq: "101",
      dtlSeq: "202",
      custSeq: "303",
      requestedBy: "admin",
      itemName: "웨딩 행사 진행비",
      recipient: { type: "PHONE", value: "010-1234-5678" },
      amount: { supplyAmount: 100000, vatAmount: 10000, taxFreeAmount: 0 },
    });

    expect(parsed.recipient).toEqual({ type: "PHONE", value: "010-1234-5678" });
    expect(parsed.amount.supplyAmount + parsed.amount.vatAmount).toBe(110000);
  });

  it("rejects malformed recipient identifiers and zero totals", () => {
    expect(() => validateIssueInput({
      mstSeq: "101", dtlSeq: "202", custSeq: "303", itemName: "테스트",
      recipient: { type: "PHONE", value: "01012345678" },
      amount: { supplyAmount: 100, vatAmount: 10, taxFreeAmount: 0 },
    })).toThrow("휴대폰번호");

    expect(() => validateIssueInput({
      mstSeq: "101", dtlSeq: "202", custSeq: "303", itemName: "테스트",
      recipient: { type: "SELF" },
      amount: { supplyAmount: 0, vatAmount: 0, taxFreeAmount: 0 },
    })).toThrow("총액");
  });

  it("masks recipient values before persistence", () => {
    expect(maskRecipient("PHONE", "010-1234-5678")).toBe("010-1234****");
    expect(maskRecipient("BUSINESS_REGISTRATION_NUMBER", "1234567890")).toBe("123-**-*****");
    expect(maskRecipient("SELF")).toBe("자진발급");
  });

  it("creates Basic authentication from an API key with a trailing colon", () => {
    expect(basicAuthorization("test_abc")).toBe("Basic dGVzdF9hYmM6");
  });

  it("compares secrets without accepting different values", () => {
    expect(sameSecret("same-value", "same-value")).toBe(true);
    expect(sameSecret("same-value", "different-value")).toBe(false);
    expect(sameSecret("", "different-value")).toBe(false);
  });
});
