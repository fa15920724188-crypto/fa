const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8787);
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
let runtimeDeepSeekApiKey = process.env.DEEPSEEK_API_KEY || "";
const AI_PROVIDER = process.env.AI_PROVIDER || (runtimeDeepSeekApiKey ? "deepseek" : (OPENAI_API_KEY ? "openai" : "demo"));
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const PUBLIC_DIR = path.join(__dirname, "public");

const defaultUsers = [
  {
    username: "admin",
    password: "admin123",
    name: "Admin"
  },
  {
    username: "sales",
    password: "sales123",
    name: "Sales"
  }
];

const users = loadUsers();

function loadUsers() {
  if (process.env.USERS_JSON) {
    try {
      return JSON.parse(process.env.USERS_JSON);
    } catch {
      return defaultUsers;
    }
  }
  return defaultUsers;
}

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function makeToken(username) {
  const payload = Buffer.from(JSON.stringify({
    username,
    exp: Date.now() + 1000 * 60 * 60 * 12
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readToken(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!match) return null;
  const [payload, sig] = decodeURIComponent(match[1]).split(".");
  if (!payload || !sig || sign(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data));
}

function currentAiMode() {
  if (runtimeDeepSeekApiKey) return "deepseek";
  if (AI_PROVIDER === "openai" && OPENAI_API_KEY) return "openai";
  return "demo";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) reject(new Error("Body too large"));
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const fileName = urlPath === "/" ? "index.html" : urlPath.slice(1);
  const filePath = path.normalize(path.join(PUBLIC_DIR, fileName));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(data);
  });
}

function classifyLead(text) {
  const lower = text.toLowerCase();
  if (/designer|design|moodboard|rendering|client|interior|sample|villa project|设计师|效果图|软装|方案|样品|别墅项目/.test(lower)) {
    return "室内设计师 | Interior Designer";
  }
  if (/hotel|lobby|guest room|corridor|ballroom|hospitality|酒店|大堂|客房|走廊|宴会厅|工程/.test(lower)) {
    return "酒店/项目方 | Hotel / Project Buyer";
  }
  if (/store|showroom|retail|collection|supplier|resell|shop|零售|店铺|陈列|经销|代理/.test(lower)) {
    return "高端家居零售店 | High-end Retail Store";
  }
  return "个人业主 | Homeowner";
}

function localCoachReply(input) {
  const type = classifyLead(input);
  return {
    mode: "local",
    answer: `1. 客户类型判断 / Customer Type\n${type}\n\n2. 客户真实意图 / Real Intent\n客户正在寻找合适地毯方向，需要先确认空间、尺寸、风格、交期和预算，再决定推荐现货还是定制。\nThe customer is looking for the right rug direction. Confirm space, size, style, timeline, and budget before recommending ready stock or customization.\n\n3. 推荐回复话术 / Suggested Reply\n中文：\n谢谢您的咨询。为了给您推荐更合适的地毯，我想先确认一下：这张地毯是用于住宅、设计项目、零售店陈列，还是酒店/商业空间？方便的话，也请告诉我大概尺寸、喜欢的风格颜色，以及是否需要现货快速发货。\n\n我们有大量机织涤纶现货，也支持手工定制，一件也可以做。您可以发空间照片或效果图，我先帮您筛一组更匹配的款式。\n\nEnglish:\nThank you for your inquiry. To recommend the right rug, may I know if this is for a home, an interior design project, a retail store, or a hotel/commercial space? It would also help if you could share the approximate size, preferred style or color, and whether you need ready stock for faster delivery.\n\nWe have many machine-woven polyester rugs in stock, and we also support handmade customization from one piece. You can send a room photo or rendering, and I will help select suitable options for you.\n\n4. 推荐产品方向 / Product Direction\n优先按客户空间推荐：急单选现货机织涤纶；高端项目或特殊尺寸选手工定制；设计师和酒店客户重点收效果图、面积和交期。\nRecommend by space: ready-stock machine-woven polyester for urgent needs; handmade customization for premium projects or special sizes; collect renderings, area, and timeline for designers and hotels.\n\n5. 建议追问 / Follow-up Questions\n- 使用空间在哪里？/ Where will it be used?\n- 大概尺寸是多少？/ What size do you need?\n- 喜欢什么风格和颜色？/ What style and color do you prefer?\n- 需要现货还是可以定制？/ Do you need ready stock or customization?\n- 目标交期是什么时候？/ What is your target delivery time?\n\n6. 下一步推进 / Next Action\n让客户发空间照片、尺寸或效果图；如果客户在本地，优先邀约展厅；如果不方便到场，引导视频选品。\nAsk for room photos, size, or renderings. If local, invite them to the showroom; if not, guide them to video selection.\n\n7. 注意事项 / Cautions\n不要给最终价格。可以说“我先按预算筛选，最终价格由工厂按具体款式、尺寸、库存和物流确认”。\nDo not give a final price. Say: “I can select options based on your budget first, and the final price will be confirmed by the factory according to the exact item, size, stock, and logistics.”`
  };
}

function systemPrompt() {
  return `You are a bilingual carpet SOHO sales coach for employees.
The seller works with a carpet factory and showroom. Leads come mainly from social media.
Target customers: homeowners, interior designers, high-end home retail stores, and hotel/project buyers.
The factory has many machine-woven polyester rugs in stock and supports handmade customization, usually around 30 days, from one piece.
The biggest conversion advantage is inviting customers to the showroom/factory or video selection.

When the employee enters a customer message, output in Chinese and English:
1. 客户类型判断 / Customer Type
2. 客户真实意图 / Real Intent
3. 推荐回复话术 / Suggested Reply, Chinese and English
4. 推荐产品方向 / Product Direction
5. 建议追问问题 / Follow-up Questions
6. 下一步推进动作 / Next Action
7. 注意事项 / Cautions

Rules:
- Do not invent stock, final prices, certifications, exact lead times, or cases.
- Use price ranges only as preliminary references if the employee provides ranges.
- Final price must be confirmed by the factory according to SKU, size, stock, packaging, logistics, and timeline.
- Do not criticize Turkish rugs. Acknowledge their history, then redirect to style, flexibility, ready stock, customization, and low starting quantity.
- Tone should be professional, warm, direct, and ready to copy to WhatsApp/Instagram/email.`;
}

async function openAiCoachReply(input) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: input }
      ],
      temperature: 0.4
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  const data = await response.json();
  return {
    mode: "openai",
    answer: data.choices?.[0]?.message?.content || ""
  };
}

async function deepSeekCoachReply(input) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${runtimeDeepSeekApiKey}`
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: input }
      ],
      temperature: 0.4
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  const data = await response.json();
  return {
    mode: "deepseek",
    answer: data.choices?.[0]?.message?.content || ""
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "POST" && url.pathname === "/api/login") {
      const body = await readBody(req);
      const user = users.find(u => u.username === body.username && u.password === body.password);
      if (!user) return sendJson(res, 401, { error: "账号或密码错误" });
      const token = makeToken(user.username);
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": `session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`
      });
      res.end(JSON.stringify({ name: user.name || user.username, username: user.username }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/logout") {
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": "session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
      });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/me") {
      const session = readToken(req);
      if (!session) return sendJson(res, 401, { error: "未登录" });
      const user = users.find(u => u.username === session.username);
      return sendJson(res, 200, {
        username: session.username,
        name: user?.name || session.username,
        aiMode: currentAiMode()
      });
    }

    if (req.method === "POST" && url.pathname === "/api/deepseek-key") {
      const session = readToken(req);
      if (!session) return sendJson(res, 401, { error: "未登录" });
      const body = await readBody(req);
      const key = String(body.key || "").trim();
      if (!key) return sendJson(res, 400, { error: "请输入 DeepSeek API Key" });
      runtimeDeepSeekApiKey = key;
      return sendJson(res, 200, { ok: true, aiMode: "deepseek" });
    }

    if (req.method === "POST" && url.pathname === "/api/coach") {
      const session = readToken(req);
      if (!session) return sendJson(res, 401, { error: "未登录" });
      const body = await readBody(req);
      const input = String(body.message || "").trim();
      if (!input) return sendJson(res, 400, { error: "请输入客户问题" });
      const mode = currentAiMode();
      const result = mode === "deepseek"
        ? await deepSeekCoachReply(input)
        : (mode === "openai" ? await openAiCoachReply(input) : localCoachReply(input));
      return sendJson(res, 200, result);
    }

    if (req.method === "GET") return serveStatic(req, res);
    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: "服务器错误", detail: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Carpet AI Coach running at http://localhost:${PORT}`);
});
