const fs = require('fs');
const OpenAI = require("openai");
const path = require('path');

const openai = new OpenAI();

// Load JSON file
// const data = JSON.parse(fs.readFileSync('../app/api/tools/data.json', 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/api/tools/data.json'), 'utf8'));

const TAGS = [
  "ai",
  "algorithm",
  "analytics",
  "api",
  "application",
  "app builder",
  "app configuration",
  "app development",
  "app tracker",
  "asset",
  "authentication",
  "awesome links",
  "awesome organization",
  "backend",
  "baas",
  "backup",
  "bio",
  "blockchain",
  "blog",
  "bookmark",
  "browser",
  "browser automation",
  "browser screenshot",
  "browser test",
  "bug",
  "cdm",
  "cdn",
  "captcha",
  "career",
  "changelog",
  "chat",
  "ci cd",
  "clean code",
  "cli",
  "cloud",
  "cloud infrastructure",
  "cloud platform",
  "cloud storage",
  "code",
  "code analysis",
  "code intelligence",
  "code practice",
  "code preview",
  "code review",
  "code screenshot",
  "code snippet",
  "coding assistant",
  "collaboration",
  "color picker",
  "colors",
  "comment",
  "communication",
  "community",
  "components",
  "container",
  "container orchestration",
  "container registry",
  "containerization",
  "converters",
  "converter online",
  "crawling",
  "crypto api",
  "cryptocurrency",
  "css",
  "css for react",
  "css-in-js",
  "cspm",
  "cv builder",
  "cybersecurity",
  "data",
  "data collection",
  "data extraction",
  "data science",
  "data security",
  "data transformation",
  "data visualization",
  "dataset",
  "database",
  "database gui",
  "database management",
  "debugging",
  "deployment",
  "deployment pipeline",
  "design",
  "design systems",
  "developer tools",
  "development",
  "devops",
  "devtool",
  "diagram",
  "discourse",
  "discussion",
  "documentation",
  "documentation generator",
  "document management system",
  "docs",
  "domain",
  "domain name",
  "drawing",
  "e-commerce",
  "education",
  "email testing",
  "email",
  "emulator",
  "encryption",
  "environment",
  "ethical",
  "event tracking",
  "explore",
  "extensions",
  "favicon",
  "feature",
  "feature flags",
  "feature testing",
  "feeds",
  "file sharing",
  "file uploader",
  "firewall",
  "flat cms",
  "flowchart",
  "form",
  "forms backend",
  "framework",
  "fraud detection",
  "fraud prevention",
  "frontend",
  "ftp",
  "fundraising",
  "gdpr",
  "generator",
  "get started",
  "git",
  "git gui",
  "git hosting",
  "github",
  "gitlab",
  "graphs",
  "graphql",
  "gui",
  "hackathon",
  "hardware",
  "hiring",
  "home cloud system",
  "hosting",
  "hosting backend",
  "hosting dynamic",
  "hosting static",
  "html",
  "html forms",
  "html templates",
  "https",
  "icon",
  "ide",
  "image",
  "image api",
  "image editor",
  "image generator",
  "image hosting",
  "image optimizer",
  "illustrations",
  "infrastructure",
  "inspiration",
  "instant messaging",
  "integration",
  "internet of things",
  "iot",
  "ip address",
  "ip api",
  "issue tracking",
  "jamstack",
  "job listing",
  "jobs",
  "json",
  "kanban",
  "kubernetes",
  "landing page",
  "learn javascript",
  "learn ruby",
  "learning resource",
  "legal",
  "lemp stack",
  "lifestyle",
  "linux",
  "load testing",
  "logging",
  "low code",
  "low code platform",
  "mac",
  "machine learning",
  "machine learning api",
  "mail",
  "mail provider",
  "mail server",
  "meetup",
  "media cdn",
  "meetings",
  "mental health",
  "meta",
  "microcontent",
  "mind map",
  "minifier",
  "mock api",
  "mock data",
  "monitoring",
  "multiplayer",
  "mysql",
  "networking",
  "newsletter",
  "nextjs",
  "nft",
  "nocode",
  "nodejs",
  "nosql",
  "note taking",
  "oauth",
  "oauth2",
  "onboarding",
  "online learning",
  "openapi",
  "open source",
  "optimization",
  "organization",
  "other list",
  "other resources",
  "outsourcing",
  "paas",
  "pair programming",
  "password manager",
  "passwordless authentication",
  "payment",
  "payment gateway",
  "payment processing",
  "paypal",
  "pdf",
  "performance",
  "personal finance",
  "personal information manager",
  "personal website",
  "pet",
  "photo editor",
  "photography",
  "php",
  "pomodoro",
  "portfolio",
  "portal",
  "portal cms",
  "portfolio cms",
  "postgres service",
  "postgresql",
  "practice",
  "preprocessing",
  "preprocessing tool",
  "preparation",
  "productivity",
  "profile",
  "profiling",
  "project management",
  "prototype",
  "prototyping",
  "proxy",
  "qa",
  "questionnaire",
  "queue",
  "real time",
  "redirect",
  "redis",
  "recruitment",
  "remote",
  "remote jobs",
  "remote work",
  "repository",
  "research",
  "resource",
  "reviews",
  "rss",
  "saas",
  "saas boilerplate",
  "scraper",
  "scraping",
  "screen capture",
  "screen sharing",
  "screenshots",
  "script",
  "search",
  "search engine",
  "security",
  "security testing",
  "self hosted",
  "self hosted cms",
  "selfhosted",
  "semantic html",
  "seo",
  "server",
  "serverless",
  "serverless computing",
  "serverless framework",
  "serverless functions",
  "service",
  "serp",
  "service worker",
  "session",
  "session management",
  "share",
  "shortener",
  "sign up",
  "site reaction",
  "skill test",
  "slack",
  "sms",
  "social image",
  "social media",
  "software",
  "software development",
  "software engineering",
  "software testing",
  "source code",
  "source control",
  "source versioning",
  "ssh",
  "ssh tunnel",
  "ssl",
  "static site generator",
  "status",
  "stress test",
  "style guide",
  "survey",
  "svg",
  "swift",
  "syntax highlighting",
  "task",
  "task manager",
  "taskbar",
  "tax",
  "tax calculator",
  "team",
  "team collaboration",
  "team communication",
  "team management",
  "team productivity",
  "tech stack",
  "technology",
  "terminal",
  "testing",
  "theme",
  "time management",
  "timeline",
  "todo",
  "tool",
  "tracing",
  "traffic",
  "transaction",
  "training",
  "tunnel",
  "ui",
  "ui design",
  "ui testing",
  "unicode",
  "url",
  "url shortener",
  "url encoder",
  "usability",
  "usability testing",
  "user",
  "user experience",
  "user interface",
  "user management",
  "user research",
  "user testing",
  "ux",
  "ux design",
  "vector",
  "version",
  "version control",
  "vcs",
  "video",
  "video conference",
  "video editing",
  "video hosting",
  "video sharing",
  "video streaming",
  "video call",
  "virtual machine",
  "virtual private network",
  "virtual private server",
  "visualization",
  "visual programming",
  "vpn",
  "vps",
  "vue",
  "wallpaper",
  "web",
  "web app",
  "web automation",
  "webcomponents",
  "web design",
  "web development",
  "web hosting",
  "webmention",
  "web server",
  "web template",
  "website",
  "website builder",
  "website hosting",
  "website management",
  "website template",
  "website wireframing",
  "webhook",
  "website screenshot",
  "websocket",
  "wiki",
  "wireframe",
  "wireframing",
  "workflow",
  "workflow automation",
  "workflow management",
  "workflow software",
  "workflow tool",
  "wordpress",
  "wordpress theme",
  "workspace",
  "writing",
  "xml",
  "yaml",
  "youtube",
  "zsh",
  "vscode",
  "visual studio code",
  "windows",
  "windows server"
];

const logStream = fs.createWriteStream(path.join(__dirname, 'logfile.log'), { flags: 'a' });

// Function to log to both console and file
function log(message, color = '\x1b[0m') {
  console.log(color + message + '\x1b[0m');
  logStream.write(message + '\n');
}

// Helper function to enforce a timeout on a promise
function promiseWithTimeout(promise, ms) {
  let timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
  return Promise.race([promise, timeout]);
}

// Function to perform the OpenAI API request with retry logic
async function openAICompletionWithRetry(messages, maxAttempts = 3, attempt = 1) {
  try {
    // Wrap the OpenAI API call inside a promise
    const completionPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-0125',
          messages: messages,
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

    // Apply a timeout to the promise
    return await promiseWithTimeout(completionPromise, 30000); // 30-second timeout
  } catch (error) {
    console.error(`Attempt ${attempt}: ${error.message}`);
    if (attempt < maxAttempts) {
      // Recursive call for retrying
      return openAICompletionWithRetry(messages, maxAttempts, attempt + 1);
    } else {
      throw new Error('All attempts failed');
    }
  }
}

// Function to improve description using OpenAI's completion API
async function improveTool({ name, visitLink, description, tags }) {
  if (!name || typeof name !== 'string') {
    return { name: name || "Unknown", error: "invalid_input", description: "Tool name is missing or invalid." };
  }

  // Clean visitLink to remove utm_source parameters
  const url = new URL(visitLink);
  url.searchParams.delete('utm_source');
  const cleanedVisitLink = url.toString();

  try {
    const content = `
    Consider the following tool:
    Name: ${name}
    Description: ${description}
    Tags: ${tags}
    URL: ${visitLink}

    Here are your tasks:
    1. Improve the description of the tool to be more concise and informative.
    1.1. The description should have at least 20 words, and up to 50 words.
    1.2. Do not include any URLs in the description
    1.3. Avoid mentioning the tool's name in the description, as it will be shown for the user right below it's title.
    2. Review the tool's tags add any missing tags.
    2.1. These are all the tags that the tool may have: ${TAGS.join('; ')}
    3. Review the tool URL. If it is obsolete, please use the up-to-date URL.
    3.1. Remove any utm_source parmas from the urls.

    If you don't know what is that tool about or need more information, please search on the web.
    You must use the following format:
    \`\`\`json
    {
      "name": "Tool name",
      "description": {
        "en-us": "Your improved description here - in English",
        "pt-br": "Your improved description here - in Brazilian Portuguese",
      },
      "tags": [
        "tag1",
        "tag2",
        // Include as many tags as you want, but limit the number to 5
      ],
      "url": "https://example.com" // Use the up-to-date URL if the tool is obsolete
    }
    \`\`\`

    In case the tool doesn't exist anymore, or you don't know it and can't find anything about it on the web, output the following response:
    \`\`\`json
    {
      "name": "Tool name",
      "error": "unexistent_tool",
      "description": "Optionally, describe the error here"
    }
    \`\`\`

    For any other error cases, use the following response:
    \`\`\`json
    {
      "name": "Tool name",
      "error": "assistant_error",
      "description": "Describe the error here"
    }
    \`\`\`
    `;

    const messages = [{ role: "user", content }];
    const response = await openAICompletionWithRetry(messages, 3); // 3 attempts
    const improvedTool = JSON.parse(response.choices[0].message.content.trim());
    improvedTool.usage = response.usage;

    log(`Old name: ${name}`, '\x1b[33m'); // Yellow
    log(`New name: ${improvedTool?.name}`, '\x1b[32m'); // Green
    log(`Old description: ${description}`, '\x1b[33m'); // Yellow
    log(`New description (en-us): ${improvedTool?.description?.['en-us']}`, '\x1b[32m'); // Green
    log(`New description (pt-br): ${improvedTool?.description?.['pt-br']}`, '\x1b[32m'); // Green
    log(`Old tags: ${tags}`, '\x1b[33m'); // Yellow
    log(`New tags: ${improvedTool?.tags?.join?.(', ')}`, '\x1b[32m'); // Green
    log(`Old URL: ${visitLink}`, '\x1b[33m'); // Yellow
    log(`New URL: ${improvedTool?.url}`, '\x1b[32m'); // Green
    log(`Used tokens: ${improvedTool?.usage?.total_tokens}`, '\x1b[35m'); // Magenta
    log('-------------------------------------------------\n\n', '\x1b[34m'); // Blue

    return improvedTool;
  } catch (error) {
    log('Error improving tool:', error?.message || error, '\x1b[31m'); // Red
    return { name, error: "assistant_error", description: error.message };
  }
}

// Process each item in the JSON array
async function processItems() {
  const improvedItems = [];

  // Function to improve a single item
  async function improveSingleItem(item) {
    try {
      const improvedItem = await improveTool(item);
      return improvedItem;
    } catch (error) {
      console.error('Error improving item:', error);
      return null; // Return null instead of throwing an error to continue processing other items
    }
  }

  // Batch processing
  const batchSize = 8;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const promises = batch.map(improveSingleItem);
    const batchResults = await Promise.all(promises);
    improvedItems.push(...batchResults);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  fs.writeFileSync(path.join(__dirname, '../app/api/tools/output.json'), JSON.stringify(improvedItems.filter(Boolean), null, 2));
}

processItems();
