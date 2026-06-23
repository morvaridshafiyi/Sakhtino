import fs from "fs";

let schema = fs.readFileSync("prisma/schema.prisma", "utf8");
schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
schema = schema.replace(/\s+@db\.[^\n]+/g, "");
fs.writeFileSync("prisma/schema.prisma", schema);
console.log("Schema migrated to SQLite");
