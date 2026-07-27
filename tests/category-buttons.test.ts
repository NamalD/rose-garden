import { describe, test, expect } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

const distDir = join(import.meta.dir, "..", "dist");
const distIndex = join(distDir, "index.html");
const html = readFileSync(distIndex, "utf-8");

// Astro extracts scoped CSS to a separate file in dist/_astro/
const { readdirSync } = await import("fs");
const astroCss = readdirSync(join(distDir, "_astro"))
  .filter((f) => f.startsWith("index.") && f.endsWith(".css"))
  .map((f) => join(distDir, "_astro", f))
  .map((f) => readFileSync(f, "utf-8"))
  .join("\n");

describe("category button fix", () => {
  test("category buttons have data-category attributes", () => {
    expect(html).toContain('data-category=""');
    expect(html).toContain("data-category=\"fun\"");
    expect(html).toContain("data-category=\"learning\"");
    expect(html).toContain("data-category=\"useful\"");
  });

  test("category buttons use category-specific active classes", () => {
    // The "All" button should start with the all-active class
    expect(html).toContain("filter-pill-active-all");

    // Other category buttons should not have a hardcoded active class
    const categoryButtons = html.match(/<button[^>]*data-category="(fun|learning|useful)"[^>]*>/g);
    expect(categoryButtons?.length).toBeGreaterThan(0);
    for (const btn of categoryButtons ?? []) {
      expect(btn).not.toContain("filter-pill-active-all");
      expect(btn).not.toContain("filter-pill-active-fun");
      expect(btn).not.toContain("filter-pill-active-learning");
      expect(btn).not.toContain("filter-pill-active-useful");
    }
  });

  test("CSS defines category-specific active pill styles", () => {
    expect(astroCss).toContain(".filter-pill-active-all");
    expect(astroCss).toContain(".filter-pill-active-fun");
    expect(astroCss).toContain(".filter-pill-active-learning");
    expect(astroCss).toContain(".filter-pill-active-useful");
  });

  test("JavaScript syncCategoryPills uses category-specific classes", () => {
    expect(html).toContain("filter-pill-active-all");
    expect(html).toContain("filter-pill-active-fun");
    expect(html).toContain("filter-pill-active-learning");
    expect(html).toContain("filter-pill-active-useful");
    expect(html).toContain("classList.remove(`filter-pill-active`");
  });
});
