// transformIntakeToSchema.js
// Converts raw intake answers → full schema used by templates

module.exports = async function transformIntakeToSchema(intake) {

  // -----------------------------
  // 1. Helper functions
  // -----------------------------

  function sentence(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function generateHeroHeadline(problems) {
    if (!problems || problems.length === 0) {
      return "Support that helps your student move forward.";
    }

    const p = problems[0].toLowerCase();

    if (p.includes("falling behind")) {
      return "Your child is falling behind — I help them catch up with confidence.";
    }

    if (p.includes("confidence")) {
      return "Helping students build confidence, clarity, and momentum.";
    }

    if (p.includes("homeschool")) {
      return "Homeschooling shouldn’t feel overwhelming — let’s make it manageable.";
    }

    if (p.includes("ilc")) {
      return "ILC doesn’t have to be confusing — I help students stay on track.";
    }

    return "Personalized support for students who need clarity and confidence.";
  }

  function generateHeroSubheadline(audience) {
    return `I support ${audience.toLowerCase()} with personalized guidance that meets them where they are.`;
  }

  function generateServiceDescription(service) {
    if (!service.bullets || service.bullets.length === 0) {
      return service.description || "Personalized support tailored to your student’s needs.";
    }

    const first = service.bullets[0];
    const second = service.bullets[1] || "";

    return `${sentence(first)} ${second ? second : ""}`.trim();
  }

  function generateDecisionHelper(problems, services) {
    const cards = [];

    problems.forEach(problem => {
      const lower = problem.toLowerCase();

      if (lower.includes("falling behind")) {
        cards.push({
          title: "If your child is falling behind",
          description: "1:1 tutoring provides consistent support, skill‑building, and confidence.",
          link: "/services"
        });
      }

      if (lower.includes("homeschool")) {
        cards.push({
          title: "If homeschooling feels overwhelming",
          description: "Homeschool support helps you create structure, routines, and clarity.",
          link: "/services"
        });
      }

      if (lower.includes("ilc")) {
        cards.push({
          title: "If ILC feels confusing",
          description: "ILC support helps students stay on track with pacing and expectations.",
          link: "/services"
        });
      }
    });

    // Fallback
    if (cards.length === 0) {
      cards.push({
        title: "Not sure what you need?",
        description: "Here’s a simple guide to help you choose the right service.",
        link: "/services"
      });
    }

    return cards;
  }

  function generateHesitationResponses(hesitations) {
    return hesitations.map(h => {
      const lower = h.toLowerCase();

      if (lower.includes("online")) {
        return {
          title: h,
          response: "Online sessions are structured, interactive, and tailored to your child’s learning style."
        };
      }

      if (lower.includes("cost")) {
        return {
          title: h,
          response: "We focus on meaningful progress, clear goals, and support that fits your student’s needs."
        };
      }

      if (lower.includes("time")) {
        return {
          title: h,
          response: "Sessions are flexible and designed to fit into busy family schedules."
        };
      }

      return {
        title: h,
        response: "I work with families to create a plan that feels supportive, manageable, and effective."
      };
    });
  }

  // -----------------------------
  // 2. Build schema
  // -----------------------------

  const schema = {
    site: {
      name: intake.businessName,
      ownerName: intake.ownerName,
      audience: intake.audience,
      region: intake.region,
      bio: intake.bio,
      subjects: intake.subjects || [],
      yearsExperience: intake.yearsExperience || null,
      contactEmail: intake.contactEmail,
      bookingLink: intake.bookingLink,
      hasBlog: intake.hasBlog || false
    },

    brand: {
      primaryColor: intake.brand.primaryColor,
      secondaryColor: intake.brand.secondaryColor,
      fontHeading: intake.brand.fontHeading,
      fontBody: intake.brand.fontBody,
      logoUrl: intake.brand.logoUrl
    },

    services: intake.services.map(service => ({
      name: service.name,
      audience: service.audience,
      bullets: service.bullets || [],
      price: service.price || null,
      ctaLabel: service.ctaLabel || "Learn More",
      ctaLink: service.ctaLink || "/contact",
      description: generateServiceDescription(service)
    })),

    testimonials: intake.testimonials || [],

    siteProblems: intake.mainProblems || [],

    pages: {
      home: {
        heroHeadline: generateHeroHeadline(intake.mainProblems),
        heroSubheadline: generateHeroSubheadline(intake.audience),
        primaryCTA: "Book a Session",
        secondaryCTA: "Read Testimonials",
        trustBar: intake.trustBar || []
      },

      services: {
        decisionHelper: generateDecisionHelper(intake.mainProblems, intake.services)
      },

      blog: {
        posts: (intake.blogPosts || []).map(post => ({
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          slug: slugify(post.title),
          featureImage: post.featureImage || null,
          content: post.content,
          tags: post.tags || []
        }))
      }
    },

    hesitations: generateHesitationResponses(intake.hesitations || []),

    currentYear: new Date().getFullYear()
  };

  return schema;
};
