// generator/generateSite.js

const fs = require("fs");
const path = require("path");
const render = require("./renderTemplate");
const transform = require("./transformIntakeToSchema");

async function generateSite(intake) {
  const schema = await transform(intake);

  const siteDir = path.join(__dirname, "..", "output", "site");
  fs.rmSync(siteDir, { recursive: true, force: true });
  fs.mkdirSync(siteDir, { recursive: true });

  // Helper to write pages
  function writePage(subpath, templateName, data = schema) {
    const fullDir = path.join(siteDir, subpath);
    fs.mkdirSync(fullDir, { recursive: true });

    const html = render("layout.html", {
      ...schema,
      pageContent: render(templateName, data)
    });

    fs.writeFileSync(path.join(fullDir, "index.html"), html);
  }

  // Core pages
  writePage("", "homepage.html");
  writePage("services", "services.html");
  writePage("testimonials", "testimonials.html");
  writePage("contact", "contact.html");

  // Blog
  if (schema.site.hasBlog) {
    writePage("blog", "blog.html");

    schema.pages.blog.posts.forEach(post => {
      writePage(`blog/posts/${post.slug}`, "post.html", { schema, post });
    });
  }

  // Assets folder
  const assetsDir = path.join(siteDir, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });

  // Copy logo if provided
  if (schema.brand.logoUrl && schema.brand.logoUrl.startsWith("uploads/")) {
    const src = path.join(__dirname, "..", schema.brand.logoUrl);
    const dest = path.join(assetsDir, "logo.png");
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  }

  return siteDir;
}

module.exports = generateSite;
