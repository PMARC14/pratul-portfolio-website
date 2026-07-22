import { describe, expect, it } from "vitest";

import { accent, accentStyle } from "@/lib/accents";

describe("accentStyle", () => {
	it("cycles red, green, blue in order", () => {
		expect(accentStyle(0)).toEqual({ "--accent": "var(--accent-red)" });
		expect(accentStyle(1)).toEqual({ "--accent": "var(--accent-green)" });
		expect(accentStyle(2)).toEqual({ "--accent": "var(--accent-blue)" });
	});

	it("wraps back to red after blue", () => {
		expect(accentStyle(3)).toEqual(accentStyle(0));
		expect(accentStyle(4)).toEqual(accentStyle(1));
	});
});

describe("accent", () => {
	it("exposes the same three colors as fixed variants", () => {
		expect(accent.red).toEqual(accentStyle(0));
		expect(accent.green).toEqual(accentStyle(1));
		expect(accent.blue).toEqual(accentStyle(2));
	});
});
