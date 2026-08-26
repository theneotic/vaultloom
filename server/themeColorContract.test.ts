import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (path: string) => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");

describe("Cipher Atelier theme color contract", () => {
  it("recolors every primary workbench surface in light mode without requiring markup variants", () => {
    const css = projectFile("client/src/index.css");

    expect(css).toContain("html:not(.dark) .cipher-header, html:not(.dark) .cipher-public-hero");
    expect(css).toContain("html:not(.dark) .cipher-workspace, html:not(.dark) .cipher-public-workspace");
    expect(css).toContain("html:not(.dark) .cipher-ink-panel, html:not(.dark) .cipher-analysis-meter, html:not(.dark) .cipher-generator-panel");
    expect(css).toContain("html:not(.dark) .cipher-footer, html:not(.dark) .cipher-sidebar");
    expect(css).toContain("html.dark .cipher-workspace, html.dark .cipher-public-workspace");
    expect(css).toContain("html.dark .cipher-footer, html.dark .cipher-sidebar");
  });

  it("uses color hooks on the existing home structure instead of altering its layout", () => {
    const css = projectFile("client/src/index.css");
    const home = projectFile("client/src/pages/Home.tsx");
    const about = projectFile("client/src/pages/About.tsx");
    const contact = projectFile("client/src/pages/Contact.tsx");
    const reportForm = projectFile("client/src/components/VulnerabilityReportForm.tsx");

    expect(home).toContain("cipher-header-art");
    expect(home).toContain("cipher-sequence");
    expect(home).toContain("cipher-analysis-meter");
    expect(home).toContain("cipher-generator-panel");
    expect(about).toContain("cipher-public-callout");
    expect(contact).toContain("cipher-contrast-action");
    expect(reportForm).toContain("cipher-contrast-action");
    expect(reportForm).toContain("cipher-report-field");
    expect(reportForm).toContain("cipher-report-evidence");
    expect(reportForm).toContain("cipher-report-outline-action");
    expect(css).toContain(".cipher-report-form [class*=\"text-black\"]");
    expect(css).toContain(".cipher-report-form [class*=\"text-[#1747ca]\"]");
  });
});
