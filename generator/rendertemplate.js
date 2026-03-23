const fs = require("fs");
const Handlebars = require("handlebars");

function renderTemplate(templateName, data) {
  const template = fs.readFileSync(`./templates/${templateName}`, "utf8");
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

module.exports = renderTemplate;
