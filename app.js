const loginPanel = document.querySelector("#loginPanel");
const appPanel = document.querySelector("#appPanel");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const userName = document.querySelector("#userName");
const modeNote = document.querySelector("#modeNote");
const logoutBtn = document.querySelector("#logoutBtn");
const message = document.querySelector("#message");
const coachBtn = document.querySelector("#coachBtn");
const clearBtn = document.querySelector("#clearBtn");
const result = document.querySelector("#result");
const modeBadge = document.querySelector("#modeBadge");
const keyPanel = document.querySelector("#keyPanel");
const deepseekKey = document.querySelector("#deepseekKey");
const saveKeyBtn = document.querySelector("#saveKeyBtn");
const removeKeyBtn = document.querySelector("#removeKeyBtn");
const keyStatus = document.querySelector("#keyStatus");
const searchBox = document.querySelector("#searchBox");
const categoryList = document.querySelector("#categoryList");
const knowledgeList = document.querySelector("#knowledgeList");
const libraryTitle = document.querySelector("#libraryTitle");
const libraryCount = document.querySelector("#libraryCount");
const playbookCards = document.querySelector("#playbookCards");
const sopList = document.querySelector("#sopList");

let activeCategory = "全部";

const knowledgeBase = [
  {
    category: "公司定位",
    title: "销售定位",
    tags: ["SOHO", "展厅", "工厂", "成交"],
    cn: "我们是有工厂和展厅支持的地毯 SOHO 销售。核心优势不是和土耳其拼产地认知，而是大量现货、一件可出、定制灵活、展厅实物体验强。线上目标是把客户推进到视频选品、样品确认、展厅或工厂报价。",
    en: "We are a carpet SOHO seller supported by a factory and showroom. Our core advantage is not competing with Turkish origin recognition, but ready stock, one-piece orders, flexible customization, and strong showroom experience. Online sales should move customers toward video selection, samples, showroom visits, or factory quotation."
  },
  {
    category: "产品知识",
    title: "常见材质",
    tags: ["涤纶", "羊毛", "丙纶", "尼龙", "竹纤维", "天丝"],
    cn: "常见材质包括涤纶、丙纶、羊毛、竹纤维、人棉丝、天丝、尼龙等。现货重点可以先讲机织涤纶，适合快速选品和较高性价比。高端项目可进一步确认羊毛、尼龙混纺或手工定制方案。",
    en: "Common materials include polyester, polypropylene, wool, bamboo fiber, viscose, Tencel, and nylon. For ready-stock recommendations, machine-woven polyester is a practical starting point with good value. Premium projects may require wool, wool-nylon blends, or handmade customization."
  },
  {
    category: "产品知识",
    title: "工艺类型",
    tags: ["机织", "手工", "定制", "阿克明斯特", "威尔顿"],
    cn: "常见工艺包括 machine-woven 机织、hand woven 手工编织、customized 定制、Axminster 阿克明斯特、Wilton 威尔顿、印花地毯等。员工回复时不要只讲工艺名，要结合客户场景解释为什么适合。",
    en: "Common constructions include machine-woven, hand woven, customized, Axminster, Wilton, and printed rugs. Employees should not only mention the construction name, but explain why it fits the customer’s usage scenario."
  },
  {
    category: "交付规则",
    title: "现货和定制周期",
    tags: ["现货", "交期", "定制", "30天"],
    cn: "大量机织涤纶款式有现货，具体库存需按 SKU 确认。手工定制通常约 30 天，一件也可以做。不要承诺最终交期，最终以工厂确认、包装和物流安排为准。",
    en: "Many machine-woven polyester rugs are available in ready stock, but exact stock must be confirmed by SKU. Handmade customization usually takes around 30 days and can start from one piece. Do not promise final lead time before factory confirmation, packaging, and logistics."
  },
  {
    category: "样品规则",
    title: "样品回复",
    tags: ["样品", "sample", "设计师", "快递"],
    cn: "可以提供样品，但建议从现有库存里挑选。样品费可免，快递或物流费用通常由客户承担。设计师客户要优先收项目风格、效果图、色卡和交期。",
    en: "Samples can be provided, preferably selected from current stock. The sample itself can be free, while shipping is usually covered by the client. For designers, collect project style, renderings, color palette, and timeline first."
  },
  {
    category: "客户画像",
    title: "个人业主",
    tags: ["业主", "住宅", "客厅", "卧室", "别墅"],
    cn: "个人业主通常关心好不好看、尺寸合不合适、颜色搭不搭、触感和清洁。回复重点是空间搭配和实物体验，优先要客户发房间照片、尺寸、沙发和地板颜色。",
    en: "Homeowners usually care about look, size, color matching, texture, and cleaning. Focus on space matching and real product experience. Ask for room photos, size, sofa color, and floor tone."
  },
  {
    category: "客户画像",
    title: "室内设计师",
    tags: ["设计师", "moodboard", "样板间", "项目"],
    cn: "设计师客户关心项目风格、样品、交期、定制和配合度。回复要专业、快速、能给方案。下一步是收 moodboard、效果图、色卡、尺寸和项目时间。",
    en: "Interior designers care about project style, samples, timeline, customization, and responsiveness. Replies should be professional, fast, and solution-oriented. Next step: collect moodboard, rendering, color palette, size, and project timeline."
  },
  {
    category: "客户画像",
    title: "高端家居零售店",
    tags: ["零售", "showroom", "MOQ", "陈列", "试单"],
    cn: "零售店关心 SKU、陈列风格、试单门槛、补货和利润空间。你的优势是一件可出、现货多、能先低门槛测试市场。不要一上来谈独家代理。",
    en: "Retail stores care about SKUs, display style, trial threshold, restocking, and margin. Your advantage is one-piece orders, many ready-stock options, and low-risk market testing. Do not start with exclusive agency discussions."
  },
  {
    category: "客户画像",
    title: "酒店和项目方",
    tags: ["酒店", "项目", "大堂", "客房", "走廊"],
    cn: "酒店项目要先确认使用区域、面积、设计图案、材质要求、交期和认证需求。不要直接报价。先收资料，再约视频会议或引导来展厅/工厂。",
    en: "For hotel projects, first confirm area of use, total area, design pattern, material requirements, timeline, and certification needs. Do not quote directly. Collect project documents first, then arrange video meeting or showroom/factory visit."
  },
  {
    category: "异议处理",
    title: "客户嫌贵",
    tags: ["贵", "降价", "price", "expensive"],
    cn: "客户说贵，不要立刻降价。先解释价格差异来自材质、工艺、厚度、密度、尺寸、是否现货和是否定制。再给 2-3 个选择：性价比现货款、质感升级款、项目定制款。",
    en: "When the client says it is expensive, do not discount immediately. Explain that price differences come from material, construction, pile height, density, size, stock availability, and customization. Offer 2-3 options: cost-effective ready stock, upgraded texture, and customized project option."
  },
  {
    category: "异议处理",
    title: "土耳其地毯对比",
    tags: ["土耳其", "Turkey", "Turkish", "竞品"],
    cn: "不要贬低土耳其地毯。可以承认土耳其有历史和市场认知，再转向客户真正需求：空间效果、款式选择、现货速度、定制灵活度、一件起订和展厅实物体验。",
    en: "Do not criticize Turkish rugs. Acknowledge their history and market recognition, then redirect to the customer’s real needs: space effect, style options, ready-stock speed, customization flexibility, one-piece orders, and showroom experience."
  },
  {
    category: "报价原则",
    title: "范围价格",
    tags: ["报价", "价格", "price range", "工厂确认"],
    cn: "可以给范围价格，但只能作为初步参考，不能作为最终报价。范围必须绑定尺寸、材质、工艺、数量和是否现货。最终价格由工厂按具体 SKU、库存、包装、物流和交期确认。",
    en: "Price ranges can be used only as preliminary references, not final quotations. A range must be tied to size, material, construction, quantity, and stock availability. Final price must be confirmed by factory based on SKU, stock, packaging, logistics, and timeline."
  }
];

const playbooks = [
  {
    title: "客户要目录和最低出口价",
    type: "B2B询盘筛选",
    cn: "谢谢您的询问。我可以先发您一份产品方向资料，但地毯价格会受尺寸、材质、工艺、数量和是否现货影响较大。为了避免给您不准确的价格，方便先告诉我您主要采购用途是零售、设计项目还是酒店项目吗？如果您有目标尺寸和预算，我可以先筛一组更匹配的款式。",
    en: "Thank you for your inquiry. I can share a product direction first, but rug pricing depends heavily on size, material, construction, quantity, and stock availability. To avoid giving inaccurate prices, may I know if this is for retail, an interior design project, or a hotel project? If you have target sizes and budget, I can select more suitable options first."
  },
  {
    title: "设计师要样品",
    type: "样品推进",
    cn: "可以的。我们可以从现有库存里帮您挑选样品，样品费可免，快递/物流费用需要自付。您方便发一下项目效果图、色卡或 moodboard 吗？我会按风格、材质和交期先筛几款更适合项目的样品。",
    en: "Yes. We can help select samples from our current stock. The sample itself can be free, while shipping cost is usually covered by the client. Could you share the project rendering, color palette, or moodboard? I will select suitable samples based on style, material, and timeline."
  },
  {
    title: "酒店客户问能不能定制",
    type: "项目推进",
    cn: "酒店项目可以支持定制。我们需要先确认使用区域，比如大堂、客房、走廊或宴会厅，因为不同区域对耐用性、厚度、图案和交期要求不同。您可以先发平面图、效果图、面积和目标交期，我先整理产品方向，再交给工厂确认详细方案和报价。",
    en: "Yes, we can support customization for hotel projects. We need to confirm the application area first, such as lobby, guest room, corridor, or ballroom, because each area has different requirements for durability, thickness, pattern, and timeline. Please share floor plan, rendering, area, and target delivery date. I will prepare product directions first, then the factory can confirm the detailed solution and quotation."
  },
  {
    title: "客户已读不回",
    type: "跟进",
    cn: "您好，我想确认一下您是否已经看到我上次发的地毯方向。如果款式不够匹配，我可以按您的空间风格重新筛一组。您也可以直接告诉我预算、尺寸或喜欢的颜色，我会帮您缩小选择范围。",
    en: "Hi, I just wanted to check if you had a chance to review the rug directions I sent. If the styles are not the best match, I can select another group based on your space. You can also tell me your budget, size, or preferred colors, and I will narrow down the options for you."
  }
];

const sopSteps = [
  {
    title: "首次询盘处理",
    steps: ["判断客户类型", "提取需求关键词", "确认用途、尺寸、风格、交期", "不要立即最终报价", "给下一步动作"]
  },
  {
    title: "报价前确认",
    steps: ["确认尺寸", "确认材质和工艺", "确认数量", "确认现货还是定制", "交给工厂确认最终价格"]
  },
  {
    title: "线上推进到线下",
    steps: ["先给 3-5 个方向", "让客户发空间图或项目图", "邀请视频选品", "本地客户优先约展厅", "到场后重点让客户看实物颜色和触感"]
  },
  {
    title: "客户来访接待",
    steps: ["提前确认客户身份和需求", "准备匹配样品和现货款", "准备项目案例或风格方向", "现场少讲空话多看实物", "结束前确认下一步：报价、样品、合同或二次跟进"]
  }
];

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

function hasDeepSeekKey() {
  return Boolean(localStorage.getItem("deepseek_api_key"));
}

function setModeText(user = {}) {
  if (hasDeepSeekKey() || user.aiMode === "deepseek") {
    modeNote.textContent = "当前模式：DeepSeek AI 模式，可以自由提问销售问题，也可以结合资料库查话术。";
    modeNote.style.color = "#125a74";
    modeBadge.textContent = "DeepSeek";
  } else if (user.aiMode === "openai") {
    modeNote.textContent = "当前模式：真正 AI 模式，可以自由提问复杂销售问题。";
    modeNote.style.color = "#125a74";
    modeBadge.textContent = "OpenAI";
  } else {
    modeNote.textContent = "当前模式：演示模式。接入 DeepSeek API Key 后，AI 问答会变成真正智能模式。";
    modeNote.style.color = "#7a5a00";
    modeBadge.textContent = "Local demo";
  }
}

function showApp(user) {
  loginPanel.classList.add("hidden");
  appPanel.classList.remove("hidden");
  userName.textContent = user.name || user.username || "Admin";
  setModeText(user);
}

function showLogin() {
  appPanel.classList.add("hidden");
  loginPanel.classList.remove("hidden");
}

async function checkSession() {
  try {
    const user = await api("/api/me");
    showApp(user);
  } catch {
    showLogin();
  }
}

function systemPrompt() {
  const kb = knowledgeBase.map(item => `${item.title}: ${item.cn} / ${item.en}`).join("\n");
  return `You are a bilingual AI sales knowledge base and sales coach for a carpet SOHO business.

Business context:
- The seller has carpet factory and showroom support.
- Target customers: homeowners, interior designers, high-end home retail stores, and hotel/project buyers.
- Main advantage: ready stock, one-piece orders, flexible customization, showroom conversion, and fast product selection.
- Machine-woven polyester rugs are available in many ready-stock styles. Handmade customization usually takes around 30 days and can start from one piece.
- Do not compete by saying Chinese rugs are better than Turkish rugs. Focus on fit, flexibility, service, ready stock, customization, and real product experience.

Knowledge base:
${kb}

When employees ask a question or paste a customer message, answer in this structure:
1. 客户类型判断 / Customer Type
2. 客户真实意图 / Real Intent
3. 可直接发送的回复 / Copy-ready Reply: Chinese + English
4. 推荐资料或产品方向 / Recommended Knowledge or Product Direction
5. 建议追问 / Follow-up Questions
6. 下一步动作 / Next Action
7. 注意事项 / Cautions

Rules:
- Do not invent stock, final prices, certifications, exact lead times, or cases.
- Price ranges are only preliminary references. Final price must be confirmed by factory.
- Keep the tone professional, warm, concise, and practical.`;
}

async function deepseekDirect(messageText) {
  const key = localStorage.getItem("deepseek_api_key");
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: messageText }
      ],
      temperature: 0.35
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "DeepSeek 调用失败");
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function localLibraryReply(text) {
  const query = text.toLowerCase();
  const hits = knowledgeBase.filter(item => {
    const haystack = `${item.title} ${item.category} ${item.tags.join(" ")} ${item.cn} ${item.en}`.toLowerCase();
    return query.split(/\s+/).some(word => word && haystack.includes(word));
  }).slice(0, 3);
  const refs = hits.length ? hits : knowledgeBase.slice(0, 3);
  return `当前是演示模式，以下是根据资料库匹配到的建议。接入 DeepSeek Key 后可以自由分析复杂问题。\n\n${refs.map((item, index) => `${index + 1}. ${item.title}\n中文：${item.cn}\nEnglish: ${item.en}`).join("\n\n")}`;
}

function renderCategories() {
  const categories = ["全部", ...new Set(knowledgeBase.map(item => item.category))];
  categoryList.innerHTML = "";
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.className = category === activeCategory ? "active" : "";
    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderKnowledge();
    });
    categoryList.appendChild(button);
  });
}

function renderKnowledge() {
  const query = searchBox.value.trim().toLowerCase();
  const filtered = knowledgeBase.filter(item => {
    const inCategory = activeCategory === "全部" || item.category === activeCategory;
    const haystack = `${item.category} ${item.title} ${item.tags.join(" ")} ${item.cn} ${item.en}`.toLowerCase();
    return inCategory && (!query || haystack.includes(query));
  });
  libraryTitle.textContent = activeCategory === "全部" ? "销售资料库" : activeCategory;
  libraryCount.textContent = `${filtered.length} 条`;
  knowledgeList.innerHTML = "";
  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "knowledge-card";
    card.innerHTML = `
      <div class="card-top">
        <span>${item.category}</span>
        <button type="button">问AI</button>
      </div>
      <h3>${item.title}</h3>
      <p>${item.cn}</p>
      <p class="english">${item.en}</p>
      <div class="tags">${item.tags.map(tag => `<b>${tag}</b>`).join("")}</div>
    `;
    card.querySelector("button").addEventListener("click", () => {
      switchView("ask");
      message.value = `请根据资料库「${item.title}」帮我生成一段客户回复话术。客户问题是：`;
      message.focus();
    });
    knowledgeList.appendChild(card);
  });
}

function renderPlaybooks() {
  playbookCards.innerHTML = "";
  playbooks.forEach(item => {
    const card = document.createElement("article");
    card.className = "playbook-card";
    card.innerHTML = `
      <span>${item.type}</span>
      <h3>${item.title}</h3>
      <h4>中文</h4>
      <p>${item.cn}</p>
      <h4>English</h4>
      <p>${item.en}</p>
      <button type="button">复制到问答</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      switchView("ask");
      message.value = `${item.cn}\n\n${item.en}`;
      message.focus();
    });
    playbookCards.appendChild(card);
  });
}

function renderSop() {
  sopList.innerHTML = "";
  sopSteps.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "sop-card";
    card.innerHTML = `
      <div class="sop-number">${index + 1}</div>
      <div>
        <h3>${item.title}</h3>
        <ol>${item.steps.map(step => `<li>${step}</li>`).join("")}</ol>
      </div>
    `;
    sopList.appendChild(card);
  });
}

function switchView(view) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach(panel => {
    panel.classList.toggle("hidden", panel.id !== `view-${view}`);
  });
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  loginError.textContent = "";
  try {
    const user = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: document.querySelector("#username").value.trim(),
        password: document.querySelector("#password").value
      })
    });
    showApp(user);
  } catch (error) {
    loginError.textContent = error.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  await api("/api/logout", { method: "POST", body: "{}" });
  showLogin();
});

saveKeyBtn.addEventListener("click", () => {
  const key = deepseekKey.value.trim();
  if (!key) {
    keyStatus.textContent = "请先粘贴 DeepSeek API Key。";
    keyStatus.style.color = "#b42318";
    return;
  }
  localStorage.setItem("deepseek_api_key", key);
  deepseekKey.value = "";
  keyStatus.textContent = "已接入 DeepSeek。现在可以自由提问。";
  keyStatus.style.color = "#125a74";
  setModeText({ aiMode: "deepseek" });
});

removeKeyBtn.addEventListener("click", () => {
  localStorage.removeItem("deepseek_api_key");
  keyStatus.textContent = "已移除 DeepSeek Key，当前回到演示模式。";
  keyStatus.style.color = "#7a5a00";
  setModeText({ aiMode: "demo" });
});

document.querySelectorAll("[data-example]").forEach(button => {
  button.addEventListener("click", () => {
    message.value = button.dataset.example;
    message.focus();
  });
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => switchView(tab.dataset.view));
});

searchBox.addEventListener("input", renderKnowledge);

clearBtn.addEventListener("click", () => {
  message.value = "";
  result.textContent = "等待输入客户问题。";
  modeBadge.textContent = hasDeepSeekKey() ? "DeepSeek" : "Ready";
});

coachBtn.addEventListener("click", async () => {
  const text = message.value.trim();
  if (!text) {
    result.textContent = "请先输入客户问题。";
    return;
  }
  coachBtn.disabled = true;
  coachBtn.textContent = "生成中...";
  result.textContent = "AI 正在结合销售资料库分析...";
  modeBadge.textContent = "Thinking";
  try {
    if (hasDeepSeekKey()) {
      result.textContent = await deepseekDirect(text);
      modeBadge.textContent = "DeepSeek";
    } else {
      result.textContent = localLibraryReply(text);
      modeBadge.textContent = "Local demo";
    }
  } catch (error) {
    result.textContent = `生成失败：${error.message}`;
    modeBadge.textContent = "Error";
  } finally {
    coachBtn.disabled = false;
    coachBtn.textContent = "生成销售回复 / Generate";
  }
});

renderCategories();
renderKnowledge();
renderPlaybooks();
renderSop();
checkSession();
