// run.js

const fs = require("fs");
const generateSite = require("./generator/generateSite");

async function run() {
  const intake = JSON.parse(fs.readFileSync("./test-intake.json", "utf8"));
  const outputPath = await generateSite(intake);
  console.log("Site generated at:", outputPath);
}

run();
