// @vitest-environment node
import { describe, it, expect } from "vitest";

const {
  processIntoString,
  processIntoYearMonth,
  processIntoYearMonthToNextMonth,
  processIntoYearMonthToPrevMonth,
} = useProcessDate();

describe("processIntoString()のテスト", () => {
  it("2024/01/01", () => {
    const date = new Date(2024, 0, 1, 0, 0, 0, 0);
    expect(processIntoString(date)).toEqual("2024-01-01");
  });

  it("閏年チェック", () => {
    // 閏年ではない
    const normalYear = new Date(2023, 1, 29, 0, 0, 0, 0);
    expect(processIntoString(normalYear)).toEqual("2023-03-01");
    // 閏年
    const leapYear = new Date(2024, 1, 29, 0, 0, 0, 0);
    expect(processIntoString(leapYear)).toEqual("2024-02-29");
  });
});

describe("processIntoYearMonth()のテスト", () => {
  it("2024/01/01", () => {
    const date = new Date(2024, 0, 1, 0, 0, 0, 0);
    expect(processIntoYearMonth(date)).toEqual("2024-01");
  });

  it("閏年チェック", () => {
    // 閏年ではない
    const normalYear = new Date(2023, 1, 29, 0, 0, 0, 0);
    expect(processIntoYearMonth(normalYear)).toEqual("2023-03");
    // 閏年
    const leapYear = new Date(2024, 1, 29, 0, 0, 0, 0);
    expect(processIntoYearMonth(leapYear)).toEqual("2024-02");
  });
});

describe("processIntoYearMonthToNextMonth()のテスト", () => {
  it("通常の処理", () => {
    expect(processIntoYearMonthToNextMonth(2024, 1)).toEqual({
      year: 2024,
      month: 2,
    });
    expect(processIntoYearMonthToNextMonth(2024, 9)).toEqual({
      year: 2024,
      month: 10,
    });
  });

  it("年跨ぎ", () => {
    expect(processIntoYearMonthToNextMonth(2023, 12)).toEqual({
      year: 2024,
      month: 1,
    });
  });

  it("1~12以外の数字", () => {
    expect(processIntoYearMonthToNextMonth(2024, 0)).toEqual({
      year: 2024,
      month: 1,
    });
    expect(processIntoYearMonthToNextMonth(2024, -1)).toEqual({
      year: 2023,
      month: 12,
    });
    expect(processIntoYearMonthToNextMonth(2024, 13)).toEqual({
      year: 2025,
      month: 2,
    });
  });
});

describe("processIntoYearMonthToPrevMonth()のテスト", () => {
  it("通常の処理", () => {
    expect(processIntoYearMonthToPrevMonth(2024, 2)).toEqual({
      year: 2024,
      month: 1,
    });
    expect(processIntoYearMonthToPrevMonth(2024, 9)).toEqual({
      year: 2024,
      month: 8,
    });
  });

  it("年跨ぎ", () => {
    expect(processIntoYearMonthToPrevMonth(2024, 1)).toEqual({
      year: 2023,
      month: 12,
    });
  });

  it("1~12以外の数字", () => {
    expect(processIntoYearMonthToPrevMonth(2024, 0)).toEqual({
      year: 2023,
      month: 11,
    });
    expect(processIntoYearMonthToPrevMonth(2024, -1)).toEqual({
      year: 2023,
      month: 10,
    });
    expect(processIntoYearMonthToPrevMonth(2024, 13)).toEqual({
      year: 2024,
      month: 12,
    });
  });
});

// TODO: 今度作る
// describe('formatDrinkCounters()のテスト', () => {
// })

// TODO: どうテストしよう
// describe('generateRandomColor()のテスト', () => {
// })
