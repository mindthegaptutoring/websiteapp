// generator/renderTemplate.js

const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// Register basic helpers
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("gt", (a, b) => a > b);
Handlebars.registerHelper("join", (arr, sep) => arr.join(sep));

function renderTemplate(templateName, data) {
  const filePath = path.join(__dirname, "..", "templates", templateName);
  const template = fs.readFileSync(filePath, "utf8");
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

module.exports = renderTemplate;
