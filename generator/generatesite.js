const fs = require("fs");
const path = require("path");
const render = require("./renderTemplate");
const transform = require("./transformIntakeToSchema");

async function generateSite(intake) {
  const schema = await transform(intake);

  const siteDir = "./output/site";
  fs.mkdirSync(siteDir, { recursive: true });

  // Homepage
  fs.writeFileSync(
    `${siteDir}/index.html`,
    render("layout.html", {
      ...schema,
      pageContent: render("homepage.html", schema)
    })
  );

  // Services
  fs.mkdirSync(`${siteDir}/services`, { recursive: true });
  fs.writeFileSync(
    `${siteDir}/services/index.html`,
    render("layout.html", {
      ...schema,
      pageContent: render("services.html", schema)
    })
  );

  // Testimonials
  fs.mkdirSync(`${siteDir}/testimonials`, { recursive: true });
  fs.writeFileSync(
    `${siteDir}/testimonials/index.html`,
    render("layout.html", {
      ...schema,
      pageContent: render("testimonials.html", schema)
    })
  );

  // Contact
  fs.mkdirSync(`${siteDir}/contact`, { recursive: true });
  fs.writeFileSync(
    `${siteDir}/contact/index.html`,
    render("layout.html", {
      ...schema,
      pageContent: render("contact.html", schema)
    })
  );

  // Blog
  if (schema.site.hasBlog) {
    fs.mkdirSync(`${siteDir}/blog`, { recursive: true });
    fs.writeFileSync(
      `${siteDir}/blog/index.html`,
      render("layout.html", {
        ...schema,
        pageContent: render("blog.html", schema)
      })
    );

    // Blog posts
    schema.pages.blog.posts.forEach(post => {
      const postDir = `${siteDir}/blog/posts/${post.slug}`;
      fs.mkdirSync(postDir, { recursive: true });

      fs.writeFileSync(
        `${postDir}/index.html`,
        render("layout.html", {
          ...schema,
          pageContent: render("post.html", { schema, post })
        })
      );
    });
  }

  return siteDir;
}

module.exports = generateSite;
