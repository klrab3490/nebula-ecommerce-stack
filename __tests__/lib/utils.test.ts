import { cn } from "@/lib/utils";

describe("cn utility function", () => {
  it("should merge classes correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("should handle conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("px-2", true && "py-1", false && "mx-4")).toBe("px-2 py-1");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["px-2", "py-1"], "mx-4")).toBe("px-2 py-1 mx-4");
  });

  it("should handle objects with boolean values", () => {
    expect(
      cn({
        "px-2": true,
        "py-1": false,
        "mx-4": true,
      })
    ).toBe("px-2 mx-4");
  });

  it("should handle undefined and null values", () => {
    expect(cn("px-2", undefined, null, "py-1")).toBe("px-2 py-1");
  });

  it("should handle empty strings", () => {
    expect(cn("", "px-2", "", "py-1")).toBe("px-2 py-1");
  });

  it("should handle complex Tailwind class conflicts", () => {
    expect(cn("text-red-500", "text-blue-600")).toBe("text-blue-600");
    expect(cn("bg-red-100", "bg-blue-200")).toBe("bg-blue-200");
  });

  it("should work with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("should handle multiple class types together", () => {
    const result = cn(
      "base-class",
      ["array-class-1", "array-class-2"],
      { "conditional-class": true, "false-class": false },
      true && "conditional-string",
      "final-class"
    );
    expect(result).toBe(
      "base-class array-class-1 array-class-2 conditional-class conditional-string final-class"
    );
  });
});
