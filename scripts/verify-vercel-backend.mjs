import handler from "../api/_backend.mjs";

if (typeof handler !== "function") {
  throw new Error("The generated Vercel backend artifact did not export an Express handler.");
}

console.log("Vercel backend artifact imports and exports an Express handler.");
