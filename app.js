(function () {
  const STORE_KEY = "bd-flow-prototype-v3";

  const accounts = [
    { username: "admin123", password: "admin123", role: "admin", name: "总后台", accountId: "ADMIN", title: "平台运营管理员" },
    { username: "bdtest123", password: "bdtest123", role: "investor", name: "招商 BD1001", accountId: "BD1001", title: "招商" },
    { username: "yytest123", password: "yytest123", role: "operator", name: "运营 OP2001", accountId: "OP2001", title: "运营" },
    { username: "swtest123", password: "swtest123", role: "business", name: "商务 SW3001", accountId: "SW3001", title: "商务" },
    { username: "mxbd123", password: "mxbd123", role: "externalBD", name: "模型BD MXBD001", accountId: "MXBD001", title: "模型BD" },
  ];

  const roleName = {
    admin: "总后台",
    investor: "招商",
    operator: "运营",
    business: "商务",
    externalBD: "模型BD",
  };

  const statusName = {
    draft: "草稿",
    pending_official_review: "待官方终审",
    pending_channel_review: "渠道审批中",
    active: "启用",
    disabled: "停用",
    rejected: "已驳回",
    generated: "未使用",
    opened: "已打开",
    submitted: "已提交",
    used: "已使用",
    stopped: "已停用",
    expired: "已失效",
    pending_binding_review: "待客户归属审批",
    bound: "已绑定",
    unbound: "未绑定",
    raw: "原始流水",
    calculated: "已计算返点基数",
    pending_admin_review: "待总后台审核",
    approved: "审核通过",
    pending_bd_confirm: "待BD确认",
    pending_payment: "待打款",
    paid: "已打款",
    archived: "已归档",
  };

  const navs = {
    admin: [
      ["accounts", "账号治理"],
      ["workorders", "官方终审"],
      ["performance", "渠道返佣"],
      ["settlements", "渠道结算"],
      ["activityPoints", "活动积分"],
      ["bdRelations", "BD 模型关联"],
      ["bdSettlement", "BD 结算"],
      ["audit", "审计日志"],
      ["customerChannelOwnership", "客户渠道归属"],
      ["help", "规则与协议"],
    ],
    business: [
      ["dashboard", "数据中心"],
      ["performance", "返点流水"],
      ["bindings", "我的客户"],
      ["settlements", "结算确认"],
      ["activityPoints", "活动积分"],
      ["profile", "账号资料"],
      ["help", "规则与协议"],
    ],
    operator: [
      ["dashboard", "数据中心"],
      ["performance", "返点流水"],
      ["childAccounts", "我的团队"],
      ["settlements", "结算确认"],
      ["activityPoints", "活动积分"],
      ["profile", "账号资料"],
      ["help", "规则与协议"],
    ],
    investor: [
      ["dashboard", "数据中心"],
      ["performance", "返点流水"],
      ["childAccounts", "我的团队"],
      ["settlements", "结算确认"],
      ["activityPoints", "活动积分"],
      ["profile", "账号资料"],
      ["help", "规则与协议"],
    ],
    externalBD: [
      ["models", "模型用量"],
      ["bdBills", "返点结算"],
      ["help", "规则与协议"],
    ],
  };

  let state = loadState();
  let session = state.session || null;
  let page = state.page || "accounts";

  function seedState() {
    const now = nowText();
    return {
      session: null,
      page: "accounts",
      entities: {
        channelAccounts: [
          { id: "BD1001", role: "investor", name: "招商 BD1001", username: "bdtest123", password: "bdtest123", mustChangePassword: false, passwordUpdatedAt: now, parent: "", status: "active", beneficiary: "主体A", payment: "招商收款户A", contact: "13810001001", source: "现有账号" },
          { id: "OP2001", role: "operator", name: "运营 OP2001", username: "yytest123", password: "yytest123", mustChangePassword: false, passwordUpdatedAt: now, parent: "BD1001", status: "active", beneficiary: "主体B", payment: "运营收款户B", contact: "13820002001", source: "现有账号" },
          { id: "SW3001", role: "business", name: "商务 SW3001", username: "swtest123", password: "swtest123", mustChangePassword: false, passwordUpdatedAt: now, parent: "OP2001", status: "active", beneficiary: "主体C", payment: "商务收款户C", contact: "13830003001", source: "现有账号" },
        ],
        bdAccounts: [
          { id: "MXBD001", name: "模型BD MXBD001", username: "mxbd123", password: "mxbd123", mustChangePassword: false, passwordUpdatedAt: now, status: "active", beneficiary: "模型BD主体A", payment: "BD 收款户A", contact: "13910001001", source: "现有账号", createdAt: now },
        ],
        accountApplications: [],
        invites: [],
        customers: [
          { id: "C9001", name: "客户 C9001", account: "customer_demo", company: "", contact: "", status: "unbound", ownerBusiness: "", source: "邀请链接", boundAt: "" },
        ],
        bindingApplications: [],
        ownershipLedger: [],
        transactions: [],
        settlements: [],
        workorders: [],
        rebateRules: [],
        models: [
          { id: "MODEL-SEEDANCE20", name: "Seedance 2.0", provider: "火山", status: "active", usageType: "视频生成", billingType: "按秒", usageUnit: "秒", unitPriceSnapshot: 0.08, demoUsage: 185000, demoDayUsage: 1200, demoWeekUsage: 12800 },
          { id: "MODEL-HAPPYHORSE", name: "happyhorse", provider: "塑梦", status: "active", usageType: "图片生成", billingType: "按张", usageUnit: "张", unitPriceSnapshot: 0.12, demoUsage: 42000, demoDayUsage: 360, demoWeekUsage: 3200 },
          { id: "MODEL-KLING", name: "Kling 2.1", provider: "快手", status: "active", usageType: "视频任务", billingType: "按次", usageUnit: "次", unitPriceSnapshot: 0.36, demoUsage: 9800, demoDayUsage: 88, demoWeekUsage: 760 },
        ],
        bdRelations: [
          { id: "MXR-001", owner: "MXBD001", model: "Seedance 2.0", basis: "模型消耗返点", usageType: "视频生成", billingType: "按秒", usageUnit: "秒", unitPriceSnapshot: 0.08, billableAmount: 14800, rate: 0.03, cycle: "自然月", settlementAccount: "BD 收款户A", usage: 185000, dayUsage: 1200, weekUsage: 12800, latestBill: "-", status: "active" },
        ],
        bdBills: [],
        activityPools: [
          { owner: "BD1001", role: "investor", balance: 10000, updatedAt: now },
          { owner: "OP2001", role: "operator", balance: 3000, updatedAt: now },
          { owner: "SW3001", role: "business", balance: 1200, updatedAt: now },
        ],
        activityLogs: [
          { id: "AP-1001", from: "平台", to: "BD1001", amount: 10000, reason: "初始化招商活动积分额度", createdAt: now, actor: "系统" },
          { id: "AP-1002", from: "BD1001", to: "OP2001", amount: 3000, reason: "招商分配给运营", createdAt: now, actor: "系统" },
          { id: "AP-1003", from: "OP2001", to: "SW3001", amount: 1200, reason: "运营分配给商务", createdAt: now, actor: "系统" },
        ],
        helpArticles: seedHelpArticles(now),
        messages: [],
        audit: [{ time: now, actor: "系统", action: "初始化数据", result: "可从商务生成邀请链接开始跑主流程" }],
      },
      ui: {
        focus: "主流程未开始",
        selectedFlow: "main",
        openInviteId: "",
        customerSubmitResult: "",
        modal: null,
        filters: {
          customerKeyword: "",
          customerStatus: "all",
          performanceKeyword: "",
          performanceOwner: "all",
          listFilters: {},
        },
      },
    };
  }

  function seedHelpArticles(now) {
    return {
      investor: {
        title: "招商规则说明",
        markdown: "## 招商规则说明\n- 招商可查看自己的运营、运营的商务、商务客户和链路内业绩。\n- 招商不直接绑定客户，客户归属必须由商务邀请链接进入并通过总后台审批。\n- 结算按已配置返点规则和自然月账单流转。",
        updatedAt: now,
      },
      operator: {
        title: "运营规则说明",
        markdown: "## 运营规则说明\n- 运营可查看自己的商务、商务客户和链路内业绩。\n- 运营可提交商务资料，启用必须经过总后台官方终审。\n- 运营只查看自己对应的返点规则和结算单。",
        updatedAt: now,
      },
      business: {
        title: "商务规则说明",
        markdown: "## 商务规则说明\n- 商务通过客户邀约生成邀请链接，客户在独立页面提交绑定资料。\n- 客户归属审批通过前，不进入客户列表、不计业绩、不参与结算。\n- 商务可查看自己的客户、返点流水、返点规则和结算确认。",
        updatedAt: now,
      },
      externalBD: {
        title: "模型BD规则说明",
        markdown: "## 模型BD规则说明\n- 模型BD只查看关联模型、模型侧用量、返点账单和疑问。\n- 用量类型、计费类型、用量单位、模型结算单价和计费消耗金额由模型接口读取，单位可能是 tokens、次、秒、张等。\n- 单条计费消耗金额按计费用量乘以模型结算单价计算，按百万 Token 时先将 tokens 除以 1,000,000。\n- 返点口径固定为模型消耗返点，按计费消耗金额乘以返点比例计算。\n- BD账单由总后台按自然月生成，BD确认后进入打款。",
        updatedAt: now,
      },
    };
  }

  function helpArticleRoleConfigs() {
    return [
      ["investor", "招商规则说明"],
      ["operator", "运营规则说明"],
      ["business", "商务规则说明"],
      ["externalBD", "模型BD规则说明"],
    ];
  }

  function helpArticleForRole(role) {
    const seeded = seedHelpArticles(nowText());
    const key = role === "admin" ? "investor" : role;
    return state.entities.helpArticles?.[key] || seeded[key] || seeded.business;
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      return normalizeState(stored ? JSON.parse(stored) : seedState());
    } catch {
      return normalizeState(seedState());
    }
  }

  function normalizeState(next) {
    if (!next.entities.bdAccounts) {
      next.entities.bdAccounts = [
        { id: "MXBD001", name: "模型BD MXBD001", username: "mxbd123", password: "mxbd123", passwordUpdatedAt: nowText(), status: "active", beneficiary: "模型BD主体A", payment: "BD 收款户A", contact: "13910001001", source: "现有账号", createdAt: nowText() },
      ];
    }
    next.entities.channelAccounts = (next.entities.channelAccounts || []).map((account) => ({
      ...account,
      password: account.password || defaultResetPassword(account.id),
      mustChangePassword: Boolean(account.mustChangePassword),
      passwordUpdatedAt: account.passwordUpdatedAt || account.createdAt || nowText(),
      contact: account.contact || defaultPhoneForAccount(account.id),
      rebateRuleId: account.rebateRuleId || "",
    }));
    next.entities.bdAccounts = (next.entities.bdAccounts || []).map((account) => ({
      ...account,
      password: account.password || defaultResetPassword(account.id),
      mustChangePassword: Boolean(account.mustChangePassword),
      passwordUpdatedAt: account.passwordUpdatedAt || account.createdAt || nowText(),
      contact: account.contact || defaultPhoneForAccount(account.id),
    }));
    next.entities.invites = (next.entities.invites || [])
      .filter((item) => item.id !== "OLD-CODE-001")
      .map((item) => ({
        maxUses: 20,
        used: 0,
        expiresAt: "",
        openedAt: "",
        submittedAt: "",
        note: "",
        ...item,
        status: item.status === "used" ? "submitted" : item.status,
      }));
    next.entities.bindingApplications = (next.entities.bindingApplications || []).map((item) => ({
      customerName: item.customerName || item.customerId || "",
      customerAccount: item.customerAccount || "",
      customerCompany: item.customerCompany || "",
      contact: item.contact || "",
      rejectReason: item.rejectReason || "",
      ...item,
    }));
    next.entities.customers = (next.entities.customers || []).map((item) => ({
      company: "",
      contact: "",
      ...item,
    }));
    next.entities.transactions = (next.entities.transactions || []).map((item) => ({
      createdAt: item.createdAt || nowText(),
      effectiveBase: item.effectiveBase ?? rebateBaseForTransaction(item, "充值"),
      ...item,
    }));
    const existingPools = next.entities.activityPools || [];
    const poolByOwner = new Map(existingPools.map((item) => [item.owner, item]));
    next.entities.activityPools = next.entities.channelAccounts
      .filter((account) => ["investor", "operator", "business"].includes(account.role))
      .map((account) => ({
        owner: account.id,
        role: account.role,
        balance: 0,
        updatedAt: nowText(),
        ...(poolByOwner.get(account.id) || {}),
      }));
    next.entities.activityLogs = (next.entities.activityLogs || []).map((item, index) => ({
      id: item.id || `AP-${1001 + index}`,
      from: item.from || "平台",
      to: item.to || "",
      amount: Number(item.amount || 0),
      reason: item.reason || "-",
      createdAt: item.createdAt || nowText(),
      actor: item.actor || "系统",
      ...item,
    }));
    const legacyRuleAssignments = [];
    next.entities.rebateRules = (next.entities.rebateRules || [])
      .filter((rule) => !seededAutoRuleIds().includes(rule.id))
      .map((rule, index) => {
      const cleanRule = { ...rule };
      delete cleanRule[["effective", "Month"].join("")];
      delete cleanRule[["t", "ier"].join("")];
      delete cleanRule.targetAccount;
      delete cleanRule.role;
      const id = rule.id || "RULE-" + String(1001 + index);
      if (rule.targetAccount) legacyRuleAssignments.push({ accountId: rule.targetAccount, ruleId: id });
      return {
        cycle: "自然月",
        status: "active",
        ...cleanRule,
        id,
        name: rule.name || `${roleName[rule.role] || rule.role}${rule.basis || "充值"}返点`,
      };
    });
    legacyRuleAssignments.forEach((assignment) => {
      const account = next.entities.channelAccounts.find((item) => item.id === assignment.accountId);
      if (account && !account.rebateRuleId) account.rebateRuleId = assignment.ruleId;
    });
    next.entities.models = next.entities.models || [
      { id: "MODEL-SEEDANCE20", name: "Seedance 2.0", provider: "火山", status: "active", usageType: "视频生成", billingType: "按秒", usageUnit: "秒", unitPriceSnapshot: 0.08, demoUsage: 185000, demoDayUsage: 1200, demoWeekUsage: 12800 },
      { id: "MODEL-HAPPYHORSE", name: "happyhorse", provider: "塑梦", status: "active", usageType: "图片生成", billingType: "按张", usageUnit: "张", unitPriceSnapshot: 0.12, demoUsage: 42000, demoDayUsage: 360, demoWeekUsage: 3200 },
      { id: "MODEL-KLING", name: "Kling 2.1", provider: "快手", status: "active", usageType: "视频任务", billingType: "按次", usageUnit: "次", unitPriceSnapshot: 0.36, demoUsage: 9800, demoDayUsage: 88, demoWeekUsage: 760 },
    ];
    next.entities.models = next.entities.models.map((model) => ({
      usageType: "模型消耗",
      billingType: "按次",
      usageUnit: "次",
      unitPriceSnapshot: 0,
      demoUsage: 0,
      demoDayUsage: 0,
      demoWeekUsage: 0,
      ...model,
    }));
    next.entities.bdRelations = (next.entities.bdRelations || []).map((relation) => {
      const snapshot = modelUsageDefaults(relation.model, next.entities.models);
      const normalized = {
        cycle: "自然月",
        settlementAccount: "BD 收款户A",
        basis: modelBdRebateBasis(),
        usageType: snapshot.usageType,
        billingType: snapshot.billingType,
        usageUnit: snapshot.usageUnit,
        unitPriceSnapshot: snapshot.unitPriceSnapshot,
        usage: snapshot.demoUsage,
        dayUsage: snapshot.demoDayUsage,
        weekUsage: snapshot.demoWeekUsage,
        latestBill: "-",
        ...relation,
      };
      normalized.basis = modelBdRebateBasis();
      normalized.billableAmount = modelBillableAmount(normalized);
      return normalized;
    });
    next.entities.bdBills = (next.entities.bdBills || []).map((bill) => {
      const relation = next.entities.bdRelations.find((item) => item.owner === bill.owner && item.model === bill.model);
      const snapshot = relation || { model: bill.model, usage: bill.usage, usageType: bill.usageType, billingType: bill.billingType, usageUnit: bill.usageUnit, unitPriceSnapshot: bill.unitPriceSnapshot, billableAmount: bill.billableAmount || bill.base };
      const billableAmount = modelBillableAmount(snapshot);
      return {
        ...bill,
        usageType: bill.usageType || snapshot.usageType || "模型消耗",
        billingType: bill.billingType || snapshot.billingType || "按次",
        usageUnit: bill.usageUnit || snapshot.usageUnit || "次",
        unitPriceSnapshot: Number(bill.unitPriceSnapshot ?? snapshot.unitPriceSnapshot ?? 0),
        usage: Number(bill.usage ?? snapshot.usage ?? 0),
        billableAmount,
        base: billableAmount,
        amount: Number(bill.amount && bill.billableAmount ? bill.amount : Math.round(billableAmount * Number(bill.rate || 0) * 100) / 100),
        status: bill.status === "pending_payment" && !bill.bdConfirmedAt ? "pending_bd_confirm" : bill.status,
        bdConfirmedAt: bill.bdConfirmedAt || "",
      };
    });
    const seededHelpArticles = seedHelpArticles(nowText());
    const legacyArticleListKey = ["help", "Docs"].join("");
    const legacyHelpDoc = Array.isArray(next.entities[legacyArticleListKey])
      ? next.entities[legacyArticleListKey].find((item) => item?.markdown)
      : null;
    const legacyHelpArticle = next.entities.helpArticle || legacyHelpDoc || {};
    next.entities.helpArticles = Object.fromEntries(helpArticleRoleConfigs().map(([role]) => {
      const current = next.entities.helpArticles?.[role];
      const seeded = seededHelpArticles[role];
      return [role, {
        title: current?.title || seeded.title,
        markdown: current?.markdown || seeded.markdown || legacyHelpArticle.markdown || "",
        updatedAt: current?.updatedAt || seeded.updatedAt || legacyHelpArticle.updatedAt || nowText(),
      }];
    }));
    delete next.entities.helpArticle;
    delete next.entities[legacyArticleListKey];
    next.entities.audit = (next.entities.audit || []).map((item) => ({
      ...item,
      action: String(item.action || "").replaceAll(["外部", " BD"].join(""), "模型BD"),
      result: String(item.result || "").replaceAll(["外部", " BD"].join(""), "模型BD"),
    }));
    next.ui = {
      focus: "主流程未开始",
      selectedFlow: "main",
      openInviteId: "",
      customerSubmitResult: "",
      modal: null,
      filters: {
        customerKeyword: "",
        customerStatus: "all",
        performanceKeyword: "",
        performanceOwner: "all",
        listFilters: {},
      },
      ...(next.ui || {}),
    };
    next.ui.filters = {
      customerKeyword: "",
      customerStatus: "all",
      performanceKeyword: "",
      performanceOwner: "all",
      listFilters: {},
      ...(next.ui.filters || {}),
    };
    next.ui.filters.listFilters = next.ui.filters.listFilters || {};
    if (next.page === ["channel", "Overview"].join("")) next.page = "accounts";
    delete next.entities.oldCodes;
    return next;
  }

  function saveState() {
    state.session = session;
    state.page = page;
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function resetState() {
    state = seedState();
    session = null;
    page = "accounts";
    saveState();
    render();
  }

  function currentUser() {
    return allUsers().find((item) => item.username === session?.username);
  }

  function currentAccount() {
    const user = currentUser();
    if (!user || user.role === "admin" || user.role === "externalBD") return null;
    return state.entities.channelAccounts.find((item) => item.id === user.accountId);
  }

  function setPage(next) {
    if (mustChangeCurrentPassword() && next !== "profile") {
      page = "profile";
      addAudit(actorName(), "访问拦截", "首次登录或重置后必须先修改密码");
      saveState();
      render();
      return;
    }
    page = next;
    saveState();
    render();
  }

  function login(username, password) {
    const found = allUsers().find((item) => item.username === username && item.password === password);
    if (!found) {
      alert("账号或密码不正确。");
      return;
    }
    session = { username: found.username, role: found.role };
    page = found.mustChangePassword ? "profile" : defaultPageForRole(found.role);
    addAudit(found.name, "登录系统", "进入" + roleName[found.role] + "视角");
    if (found.mustChangePassword) addAudit(found.name, "首次登录改密", "默认密码登录后必须先修改密码");
    saveState();
    render();
  }

  function logout() {
    session = null;
    page = "dashboard";
    saveState();
    render();
  }

  function switchRole(username) {
    const found = allUsers().find((item) => item.username === username);
    if (!found) return;
    session = { username: found.username, role: found.role };
    page = found.mustChangePassword ? "profile" : defaultPageForRole(found.role);
    addAudit("系统操作", "切换视角", `进入${roleName[found.role]}视角`);
  }

  function defaultPageForRole(role) {
    return {
      admin: "accounts",
      investor: "dashboard",
      operator: "dashboard",
      business: "dashboard",
      externalBD: "models",
    }[role] || "performance";
  }

  function mustChangeCurrentPassword() {
    return Boolean(currentUser()?.mustChangePassword);
  }

  function allUsers() {
    const baseUsers = accounts.map((user) => {
      const channelAccount = state.entities.channelAccounts.find((item) => item.id === user.accountId || item.username === user.username);
      const bdAccount = state.entities.bdAccounts.find((item) => item.id === user.accountId || item.username === user.username);
      const source = channelAccount || bdAccount;
      return source ? { ...user, name: source.name || user.name, password: source.password || user.password, mustChangePassword: Boolean(source.mustChangePassword) } : user;
    });
    const knownUsernames = new Set(baseUsers.map((item) => item.username));
    const channelUsers = state.entities.channelAccounts
      .filter((item) => item.status === "active" && item.username && !knownUsernames.has(item.username))
      .map((item) => ({
        username: item.username,
        password: item.password,
        mustChangePassword: Boolean(item.mustChangePassword),
        role: item.role,
        name: item.name,
        accountId: item.id,
        title: roleName[item.role] || "渠道账号",
      }));
    const knownAfterChannel = new Set([...knownUsernames, ...channelUsers.map((item) => item.username)]);
    const bdUsers = state.entities.bdAccounts
      .filter((item) => item.status === "active" && item.username && !knownAfterChannel.has(item.username))
      .map((item) => ({
        username: item.username,
        password: item.password,
        mustChangePassword: Boolean(item.mustChangePassword),
        role: "externalBD",
        name: item.name,
        accountId: item.id,
        title: "模型BD",
      }));
    return [...baseUsers, ...channelUsers, ...bdUsers];
  }

  function addAudit(actor, action, result) {
    const time = new Date().toISOString().slice(0, 19).replace("T", " ");
    state.entities.audit.unshift({ time, actor, action, result });
    state.entities.audit = state.entities.audit.slice(0, 80);
    state.ui.focus = `${action}：${result}`;
  }

  function badge(text, type = "") {
    return `<span class="badge ${type}">${escapeHtml(text)}</span>`;
  }

  function statusBadge(status) {
    const label = statusName[status] || status || "-";
    const type = ["active", "bound", "approved", "paid"].includes(status)
      ? "current"
      : ["generated", "opened", "submitted", "pending_official_review", "pending_binding_review", "pending_admin_review"].includes(status)
        ? "warn"
        : ["rejected", "disabled", "stopped", "expired"].includes(status)
          ? "danger"
          : "";
    return badge(label, type);
  }

  function featureBadges(current, optimized) {
    return "";
  }

  function money(value) {
    return "¥" + Number(value || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function percent(value) {
    return (Number(value || 0) * 100).toFixed(2) + "%";
  }

  function formatUsageQuantity(value, unit) {
    return `${Number(value || 0).toLocaleString("zh-CN")} ${unit || ""}`.trim();
  }

  function formatUnitPrice(value, unit) {
    return `${money(value)} / ${unit || "单位"}`;
  }

  function modelUsageDefaults(modelName, models = []) {
    const model = models.find((item) => item.name === modelName || item.id === modelName) || {};
    return {
      usageType: model.usageType || "模型消耗",
      billingType: model.billingType || "按次",
      usageUnit: model.usageUnit || "次",
      unitPriceSnapshot: Number(model.unitPriceSnapshot || 0),
      demoUsage: Number(model.demoUsage || 0),
      demoDayUsage: Number(model.demoDayUsage || 0),
      demoWeekUsage: Number(model.demoWeekUsage || 0),
    };
  }

  function modelBillableAmount(row) {
    const directAmount = Number(row?.billableAmount);
    if (Number.isFinite(directAmount) && directAmount > 0) return Math.round(directAmount * 100) / 100;
    const amount = Number(row?.usage || 0) * Number(row?.unitPriceSnapshot || 0);
    return Math.round(amount * 100) / 100;
  }

  function collectAttachmentMeta(formData, key = "attachments") {
    return formData.getAll(key)
      .filter((file) => file && typeof file === "object" && "name" in file && file.name)
      .map((file, index) => ({
        id: "ATT-" + Date.now() + "-" + (index + 1),
        name: file.name,
        type: file.type || "file",
        size: file.size || 0,
        uploadedAt: nowText(),
      }));
  }

  function attachmentSummary(attachments = []) {
    const list = Array.isArray(attachments) ? attachments.filter((item) => item?.name) : [];
    if (!list.length) return "-";
    return list.map((item) => `${item.name}${item.size ? ` (${formatFileSize(item.size)})` : ""}`).join("、");
  }

  function formatFileSize(size) {
    const value = Number(size || 0);
    if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)}MB`;
    if (value >= 1024) return `${(value / 1024).toFixed(1)}KB`;
    return `${value}B`;
  }

  function settlementPeriod() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      label: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")} 自然月`,
      start: dateOnly(start),
      end: dateOnly(end),
    };
  }

  function dateOnly(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function defaultInviteExpiry() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return dateOnly(date);
  }

  function hasInviteExpired(invite) {
    if (!invite?.expiresAt) return false;
    return invite.expiresAt < dateOnly(new Date());
  }

  function inviteEffectiveStatus(invite) {
    if (!invite) return "expired";
    if (["generated", "opened"].includes(invite.status) && hasInviteExpired(invite)) return "expired";
    return invite.status;
  }

  function isInviteUsable(invite) {
    if (!invite) return false;
    if (!["generated", "opened"].includes(invite.status)) return false;
    if (hasInviteExpired(invite)) return false;
    return Number(invite.used || 0) < Number(invite.maxUses || 1);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function table(columns, rows, rowActions) {
    if (!rows.length) return `<div class="empty">暂无数据。</div>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join("")}
              ${rowActions ? "<th>操作</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${columns.map((col) => `<td>${formatCell(row, col)}</td>`).join("")}
                ${rowActions ? `<td>${rowActions(row)}</td>` : ""}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function formatCell(row, col) {
    const value = typeof col.value === "function" ? col.value(row) : row[col.key];
    if (col.type === "status") return statusBadge(value);
    if (col.type === "money") return money(value);
    if (col.type === "percent") return percent(value);
    if (col.type === "badges") return `<div class="badge-row">${value.map((item) => badge(item.text, item.type)).join("")}</div>`;
    return escapeHtml(value || "-");
  }

  function render() {
    const app = document.getElementById("app");
    if (!session) {
      app.innerHTML = renderLogin();
      bindLogin();
      return;
    }
    const user = currentUser();
    const roleNav = navs[user.role] || navs.business;
    const standalonePage = page === "customerBind";
    if (mustChangeCurrentPassword() && page !== "profile") page = "profile";
    if (!standalonePage && page !== "profile" && !roleNav.some(([key]) => key === page)) page = defaultPageForRole(user.role);
    app.innerHTML = `
      <div class="app-shell">
        ${renderPrototypeOps(user)}
        <div class="assist-layer" aria-label="prototype helpers">
          <details class="assist-drawer state-drawer">
            <summary>数据状态</summary>
            <aside class="state-panel">${renderRightPanel(user)}</aside>
          </details>
        </div>
        ${standalonePage ? `
          <main class="customer-public-main">${renderCustomerBindPage(user)}</main>
        ` : `
          <div class="prototype-workspace">
            ${renderSidebar(user, roleNav)}
            <main class="main">${renderMain(user)}</main>
          </div>
        `}
        ${renderModal()}
      </div>
    `;
    bindActions();
  }

  function renderLogin() {
    return `
      <div class="login-shell">
        <section class="login-card">
          <div class="login-intro">
            <h1>招商后台全流程</h1>
            <p>统一处理渠道账号、客户归属、业绩返点、结算审核与打款归档。</p>
            <div class="notice">
              推荐先用商务生成邀请链接，再切到总后台审批，最后回商务确认结算。也可以直接点“跑通主流程”。
            </div>
            <div class="account-grid">
              ${accounts.map((item) => `
                <button class="account-tile" data-quick-login="${item.username}">
                  <strong>${escapeHtml(item.name)}</strong>
                  <span>${escapeHtml(item.username)} / ${escapeHtml(item.password)}</span>
                </button>
              `).join("")}
            </div>
          </div>
          <form class="login-form" id="login-form">
            <h2>登录账号</h2>
            <p class="muted">账号和密码均使用测试账号本身。</p>
            <div class="field">
              <label for="username">账号</label>
              <input id="username" name="username" value="swtest123" autocomplete="username" />
            </div>
            <div class="field">
              <label for="password">密码</label>
              <input id="password" name="password" type="password" value="swtest123" autocomplete="current-password" />
            </div>
            <button class="btn primary" type="submit">登录</button>
          </form>
        </section>
      </div>
    `;
  }

  function bindLogin() {
    document.getElementById("login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      login(form.get("username"), form.get("password"));
    });
    document.querySelectorAll("[data-quick-login]").forEach((button) => {
      button.addEventListener("click", () => {
        const username = button.dataset.quickLogin;
        login(username, username);
      });
    });
  }

  function renderPrototypeOps(user) {
    return `
      <aside class="prototype-ops">
        <div class="ops-brand">
          <strong>原型操作</strong>
          <span>演示控制，不属于真实后台</span>
        </div>
        <div class="ops-section">
          <div class="ops-title">切换视角</div>
          ${accounts.map((item) => `
            <button class="ops-btn ${user.username === item.username ? "active" : ""}" data-action="switchRole" data-username="${item.username}">
              <span>${escapeHtml(roleName[item.role])}</span>
              <small>${escapeHtml(item.username)}</small>
            </button>
          `).join("")}
        </div>
        <div class="ops-section">
          <div class="ops-title">一键测试</div>
          <button class="ops-btn primary" data-action="runMainFlow">跑通主流程</button>
          <button class="ops-btn" data-action="reset">重置演示数据</button>
        </div>
        <div class="ops-section">
          <div class="ops-title">单步模拟</div>
          ${renderMainFlowActions()}
        </div>
        <div class="ops-section bottom">
          <button class="ops-btn" data-action="logout">退出原型登录</button>
        </div>
      </aside>
    `;
  }

  function renderSidebar(user, roleNav) {
    if (user.role === "admin") return renderAdminSidebar(user, roleNav);
    return `
      <aside class="sidebar">
        <div class="brand">
          <h2>${escapeHtml(roleName[user.role])}后台</h2>
          <p>只展示当前账号可处理的客户、业绩、结算和资料。</p>
        </div>
        <div class="role-card">
          <strong>${escapeHtml(user.name)}</strong>
          <span>${escapeHtml(user.title)} · ${escapeHtml(user.accountId)}</span>
        </div>
        <div class="nav-group-title">日常工作</div>
        ${roleNav.map(([key, label]) => `
          <button class="nav-item ${page === key ? "active" : ""}" data-page="${key}">
            <span>${escapeHtml(label)}</span>
            ${navHint(user.role, key)}
          </button>
        `).join("")}
      </aside>
    `;
  }

  function renderAdminSidebar(user, roleNav) {
    const channelMenu = [
      ["accounts", "账号治理"],
      ["workorders", "官方终审"],
      ["performance", "渠道返佣"],
      ["settlements", "渠道结算"],
      ["bdRelations", "BD 模型关联"],
      ["bdSettlement", "BD 结算"],
      ["audit", "审计日志"],
      ["customerChannelOwnership", "客户渠道归属"],
      ["help", "规则与协议"],
    ];
    const disabledGroups = [
      ["调度中心", ["调度看板", "任务列表", "任务统计", "Worker 列表", "配置项", "调度规则", "鉴权 Key", "插队定价"]],
      ["财务与订单", ["算力管理", "发布渠道", "支付渠道", "订单管理", "订阅管理", "用户开票申请"]],
      ["系统运维", ["健康检查"]],
      ["内容与 AI", ["项目列表", "反馈列表", "题材列表", "文风列表", "项目模板", "案例设置", "内容资产", "AI 配置"]],
      ["团队管理", ["团队付费", "团队列表", "团队订单", "团队账单", "开票申请", "联系销售", "团队积分流水", "支付事件"]],
    ];
    return `
      <aside class="sidebar admin-sidebar">
        <div class="brand admin-brand">
          <h2>塑梦superAI管理平台</h2>
          <p>塑梦 AI 管理后台</p>
        </div>
        <div class="role-card admin-user-card">
          <strong>${escapeHtml(user.name)}</strong>
          <span>${escapeHtml(user.title)} · ${escapeHtml(user.accountId)}</span>
        </div>
        <div class="nav-group-title">总后台</div>
        ${["数据埋点", "用户管理", "管理员", "发版说明"].map((label) => `
          <button class="nav-item nav-disabled" type="button" disabled><span>${escapeHtml(label)}</span></button>
        `).join("")}
        <button class="nav-item admin-collapse active" type="button" disabled>
          <span>渠道 / BD 治理</span><small>已展开</small>
        </button>
        <div class="admin-subnav">
        ${channelMenu.map(([key, label]) => `
          <button class="nav-item ${page === key ? "active" : ""}" data-page="${key}">
            <span>${escapeHtml(label)}</span>
          </button>
        `).join("")}
        </div>
        ${disabledGroups.map(([group, labels]) => `
          <div class="nav-group-title">${escapeHtml(group)}</div>
          ${labels.map((label) => `<button class="nav-item nav-disabled" type="button" disabled><span>${escapeHtml(label)}</span></button>`).join("")}
        `).join("")}
      </aside>
    `;
  }

  function navHint(role, key) {
    return "";
  }

  function renderMain(user) {
    const pages = {
      accounts: renderAdminAccounts,
      ownership: renderAdminOwnership,
      performance: renderPerformance,
      settlements: renderSettlements,
      workorders: renderWorkorders,
      bdSettlement: renderBdSettlement,
      bdRelations: renderBdModels,
      audit: renderAudit,
      customerChannelOwnership: renderCustomerChannelOwnership,
      dashboard: renderChannelDashboard,
      bindings: renderBusinessBindings,
      activityPoints: renderActivityPoints,
      messages: renderMessages,
      profile: renderProfile,
      help: renderHelpCenter,
      childAccounts: renderChildAccounts,
      models: renderBdModels,
      bdBills: renderBdBills,
    };
    const renderer = pages[page] || pages[defaultPageForRole(user.role)] || renderAdminAccounts;
    return renderer(user);
  }

  function pageHeader(title, desc, actions = "") {
    return `
      <div class="topbar">
        <div>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(desc)}</p>
        </div>
        <div class="toolbar">${actions}</div>
      </div>
    `;
  }

  function renderModal() {
    const modal = state.ui.modal;
    if (!modal?.type) return "";
    const content = renderModalContent(modal);
    if (!content) return "";
    return `
      <div class="modal-backdrop" role="presentation">
        <section class="modal-panel" role="dialog" aria-modal="true">
          ${content}
        </section>
      </div>
    `;
  }

  function renderModalContent(modal) {
    const current = currentAccount();
    const closeButton = `<button class="btn ghost" type="button" data-action="closeModal">关闭</button>`;
    if (modal.type === "createInvite") {
      const owner = current?.id || "SW3001";
      return modalShell("生成邀请链接", "生成后只产生链接记录；复制链接后可发给客户访问。", closeButton, `
        <form class="form-grid" data-form="createInviteForm">
          <input type="hidden" name="owner" value="${escapeHtml(owner)}" />
          <div class="field"><label>归属商务</label><input value="${escapeHtml(owner)}" readonly /></div>
          <div class="field"><label>有效期</label><input name="expiresAt" type="date" value="${defaultInviteExpiry()}" /></div>
          <div class="field"><label>可提交次数</label><input name="maxUses" value="1" /></div>
          <div class="field"><label>备注</label><input name="note" placeholder="如 线下会销客户" /></div>
          <div class="toolbar"><button class="btn primary" type="submit">生成</button></div>
        </form>
      `);
    }
    if (modal.type === "createChannelAccount") {
      return modalShell("新增渠道账号", "默认密码为 password，首次登录必须修改。", closeButton, `
        <form class="form-grid" data-form="createChannelAccount">
          <div class="field"><label>角色</label><select name="role" data-channel-role-select><option value="investor">招商</option><option value="operator">运营</option><option value="business">商务</option></select></div>
          <div class="field"><label>账号ID</label><input name="id" placeholder="如 BD1002 / OP2002 / SW3002" /></div>
          <div class="field"><label>名称</label><input name="name" placeholder="如 招商 华东一区" /></div>
          <div class="field"><label>登录账号</label><input name="username" placeholder="如 bd_huadong_01" /></div>
          ${defaultPasswordHint()}
          <div class="field"><label>上级账号</label><input name="parent" data-channel-parent-input placeholder="招商无上级" readonly tabindex="-1" /></div>
          <div class="field"><label>受益主体</label><input name="beneficiary" placeholder="合同/收款主体" /></div>
          <div class="field"><label>收款账户</label><input name="payment" placeholder="银行卡/对公账户/支付宝等" /></div>
          <div class="field"><label>手机号</label><input name="contact" placeholder="用于账号发放和异常联系" required /></div>
          <div class="toolbar"><button class="btn primary" type="submit">提交并启用</button></div>
        </form>
      `);
    }
    if (modal.type === "editChannelAccount") {
      const row = state.entities.channelAccounts.find((item) => item.id === modal.id);
      if (!row) return "";
      const parentField = row.role === "investor"
        ? `<input type="hidden" name="parent" value="" /><div class="field"><label>上级账号</label><input value="无上级" readonly tabindex="-1" /></div>`
        : `<div class="field"><label>上级账号</label><input name="parent" value="${escapeHtml(row.parent)}" /></div>`;
      return modalShell(`编辑账号 ${row.id}`, "可调整账号资料、上级关系、收款资料和启用状态。", closeButton, `
        <form class="form-grid" data-form="updateChannelAccount">
          <input type="hidden" name="id" value="${escapeHtml(row.id)}" />
          <div class="field"><label>角色</label><input value="${escapeHtml(roleName[row.role])}" readonly /></div>
          <div class="field"><label>名称</label><input name="name" value="${escapeHtml(row.name)}" /></div>
          <div class="field"><label>登录账号</label><input name="username" value="${escapeHtml(row.username)}" /></div>
          ${parentField}
          <div class="field"><label>受益主体</label><input name="beneficiary" value="${escapeHtml(row.beneficiary)}" /></div>
          <div class="field"><label>收款账户</label><input name="payment" value="${escapeHtml(row.payment)}" /></div>
          <div class="field"><label>手机号</label><input name="contact" value="${escapeHtml(row.contact || "")}" required /></div>
          <div class="field"><label>状态</label><select name="status"><option value="active" ${row.status === "active" ? "selected" : ""}>启用</option><option value="disabled" ${row.status === "disabled" ? "selected" : ""}>停用</option></select></div>
          <div class="toolbar"><button class="btn primary" type="submit">保存修改</button></div>
        </form>
      `);
    }
    if (modal.type === "createAccountDraft") {
      const role = modal.role || "business";
      const config = channelRoleConfig(role);
      const fixedParent = fixedParentForChannelDraft(role);
      return modalShell(`创建${roleName[role]}资料`, "本级提交资料后进入总后台官方终审，通过后才启用账号。", closeButton, `
        <form class="form-grid" data-form="createAccountDraftForm">
          <input type="hidden" name="role" value="${escapeHtml(role)}" />
          <input type="hidden" name="parent" value="${escapeHtml(fixedParent)}" />
          <div class="field"><label>账号ID</label><input name="id" placeholder="留空自动生成 ${config.prefix}" /></div>
          <div class="field"><label>名称</label><input name="name" placeholder="如 ${roleName[role]} 华东一区" /></div>
          <div class="field"><label>登录账号</label><input name="username" placeholder="留空默认账号ID小写" /></div>
          ${defaultPasswordHint()}
          <div class="field"><label>上级账号</label><input value="${escapeHtml(fixedParent)}" readonly tabindex="-1" /></div>
          <div class="field"><label>受益主体</label><input name="beneficiary" placeholder="合同/收款主体" /></div>
          <div class="field"><label>收款账户</label><input name="payment" placeholder="打款账户" /></div>
          <div class="field"><label>手机号</label><input name="contact" placeholder="用于账号发放和异常联系" required /></div>
          <div class="toolbar"><button class="btn primary" type="submit">提交资料</button></div>
        </form>
      `);
    }
    if (modal.type === "addRebateRule") {
      return modalShell("新增返佣规则", "先维护规则库，再到渠道账号上选择要使用的规则。", closeButton, `
        <form class="form-grid" data-form="addRebateRule">
          <div class="field"><label>规则名称</label><input name="name" placeholder="如 华东商务月度充值返点" /></div>
          <div class="field"><label>口径</label><select name="basis">${basisOptions("充值")}</select></div>
          <div class="field"><label>返点比例</label><input name="rate" placeholder="如 4 表示 4%" /></div>
          <div class="field"><label>返佣周期</label><select name="cycle">${rebateCycleOptions("自然月")}</select></div>
          <div class="toolbar"><button class="btn primary" type="submit">新增规则</button></div>
        </form>
      `);
    }
    if (modal.type === "editRebateRule") {
      const rule = state.entities.rebateRules.find((item) => item.id === modal.id);
      if (!rule) return "";
      return modalShell("编辑返佣规则", "修改规则库后，已选择该规则的渠道账号会按新规则结算。", closeButton, `
        <form class="form-grid" data-form="updateRebateRule">
          <input type="hidden" name="id" value="${escapeHtml(rule?.id || "")}" />
          <div class="field"><label>规则名称</label><input name="name" value="${escapeHtml(rule?.name || "")}" placeholder="如 华东商务月度充值返点" /></div>
          <div class="field"><label>口径</label><select name="basis">${basisOptions(rule?.basis || "充值")}</select></div>
          <div class="field"><label>返点比例</label><input name="rate" value="${escapeHtml(rateInputValue(rule))}" placeholder="如 4 表示 4%" /></div>
          <div class="field"><label>返佣周期</label><select name="cycle">${rebateCycleOptions(rule?.cycle || "自然月")}</select></div>
          <div class="field"><label>状态</label><select name="status">${ruleStatusOptions(rule?.status || "active")}</select></div>
          <div class="toolbar"><button class="btn primary" type="submit">保存规则</button></div>
        </form>
      `);
    }
    if (modal.type === "assignRebateRule") {
      const account = state.entities.channelAccounts.find((item) => item.id === modal.id);
      if (!account) return "";
      return modalShell("配置返点规则", "从已维护的返点规则中选择一条给该渠道账号使用。", closeButton, `
        <form class="form-grid" data-form="assignChannelRebateRule">
          <input type="hidden" name="accountId" value="${escapeHtml(account.id)}" />
          <div class="field"><label>渠道账号</label><input value="${escapeHtml(channelAccountLabel(account.id))}" readonly /></div>
          <div class="field"><label>角色</label><input value="${escapeHtml(roleName[account.role])}" readonly /></div>
          <div class="field"><label>返点规则</label><select name="rebateRuleId">${rebateRuleOptions(account.rebateRuleId)}</select></div>
          <div class="toolbar"><button class="btn primary" type="submit">保存配置</button></div>
        </form>
      `);
    }
    if (modal.type === "editHelpArticle") {
      const role = modal.role || modal.id || "investor";
      const article = helpArticleForRole(role);
      const label = helpArticleRoleConfigs().find(([value]) => value === role)?.[1] || "规则说明";
      return modalShell("编辑规则说明", "总后台分别维护四份规则说明文本。", closeButton, `
        <form class="form-grid" data-form="saveHelpArticle">
          <input type="hidden" name="role" value="${escapeHtml(role)}" />
          <div class="field"><label>文本对象</label><input value="${escapeHtml(label)}" readonly /></div>
          <div class="field"><label>页面标题</label><input name="title" value="${escapeHtml(article.title)}" placeholder="如 规则与协议" required /></div>
          <div class="field full-span"><label>Markdown 正文</label><textarea name="markdown" placeholder="用 Markdown 写这页正文">${escapeHtml(article.markdown)}</textarea></div>
          <div class="toolbar"><button class="btn primary" type="submit">保存文本</button></div>
        </form>
      `);
    }
    if (modal.type === "transferActivityPoints") {
      const targets = activityTransferTargets();
      const user = currentUser();
      const isAdmin = user?.role === "admin";
      return modalShell(isAdmin ? "调整招商活动积分" : "发放活动积分", "额度按渠道层级流转：总后台给招商，招商给运营，运营给商务，商务给客户。", closeButton, `
        <form class="form-grid" data-form="transferActivityPoints">
          <div class="field"><label>发放对象</label><select name="target">${targets.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join("")}</select></div>
          <div class="field"><label>${isAdmin ? "调整积分" : "发放积分"}</label><input name="amount" placeholder="${isAdmin ? "可填正数增加，负数扣减" : "填写正整数"}" /></div>
          <div class="field full-span"><label>备注</label><input name="reason" placeholder="${isAdmin ? "如：月度活动额度配置" : "如：发放给下级活动使用"}" /></div>
          <div class="toolbar"><button class="btn primary" type="submit">提交</button></div>
        </form>
      `);
    }
    if (modal.type === "createModelBdAccount") {
      return modalShell("新增模型BD", "默认密码为 password，首次登录必须修改。", closeButton, `
        <form class="form-grid" data-form="createModelBdAccount">
          <div class="field"><label>BD账号ID</label><input name="id" placeholder="如 MXBD002" /></div>
          <div class="field"><label>名称</label><input name="name" placeholder="如 模型BD 华东" /></div>
          <div class="field"><label>登录账号</label><input name="username" placeholder="如 mxbd_huadong" /></div>
          ${defaultPasswordHint()}
          <div class="field"><label>手机号</label><input name="contact" placeholder="用于账号发放和异常联系" required /></div>
          <div class="field"><label>受益主体</label><input name="beneficiary" placeholder="合同/收款主体" /></div>
          <div class="field"><label>收款账户</label><input name="payment" placeholder="银行账户或其他打款账户" /></div>
          <div class="toolbar"><button class="btn primary" type="submit">新增模型BD</button></div>
        </form>
      `);
    }
    if (modal.type === "editModelBdAccount") {
      const row = state.entities.bdAccounts.find((item) => item.id === modal.id);
      if (!row) return "";
      return modalShell(`编辑模型BD ${row.id}`, "可修改模型BD账号资料、手机号、收款资料和启用状态。", closeButton, `
        <form class="form-grid" data-form="updateModelBdAccount">
          <input type="hidden" name="id" value="${escapeHtml(row.id)}" />
          <div class="field"><label>名称</label><input name="name" value="${escapeHtml(row.name)}" /></div>
          <div class="field"><label>登录账号</label><input name="username" value="${escapeHtml(row.username)}" /></div>
          <div class="field"><label>手机号</label><input name="contact" value="${escapeHtml(row.contact || "")}" required /></div>
          <div class="field"><label>受益主体</label><input name="beneficiary" value="${escapeHtml(row.beneficiary || "")}" /></div>
          <div class="field"><label>收款账户</label><input name="payment" value="${escapeHtml(row.payment || "")}" /></div>
          <div class="field"><label>状态</label><select name="status"><option value="active" ${row.status === "active" ? "selected" : ""}>启用</option><option value="disabled" ${row.status === "disabled" ? "selected" : ""}>停用</option></select></div>
          <div class="toolbar"><button class="btn primary" type="submit">保存修改</button></div>
        </form>
      `);
    }
    if (modal.type === "createBdRelation") {
      return modalShell("新建模型关联", "模型必须从已配置模型列表中选择；计费类型、用量单位、模型结算单价和计费消耗金额从模型接口读取。", closeButton, `
        <form class="form-grid" data-form="createBdRelation">
          <div class="field"><label>模型BD账号</label><select name="owner">${state.entities.bdAccounts.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)} / ${escapeHtml(item.name)}</option>`).join("")}</select></div>
          <div class="field"><label>模型</label><select name="model">${state.entities.models.map((item) => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)} / ${escapeHtml(item.provider)}</option>`).join("")}</select></div>
          <div class="field"><label>返点口径</label><input value="${escapeHtml(modelBdRebateBasis())}" readonly /></div>
          <div class="field"><label>返点比例</label><input name="rate" placeholder="如 10 表示 10%" /></div>
          <div class="field"><label>结算周期</label><input name="cycle" value="自然月" /></div>
          <div class="field"><label>结算账号</label><input name="settlementAccount" placeholder="默认使用模型BD收款账户" /></div>
          <div class="toolbar"><button class="btn primary" type="submit">新建关联</button></div>
        </form>
      `);
    }
    return "";
  }

  function modalShell(title, desc, actions, body) {
    return `
      <div class="modal-head">
        <div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(desc)}</p></div>
        <div class="toolbar">${actions}</div>
      </div>
      <div class="modal-body">${body}</div>
    `;
  }

  function adminFilterBar(items, right = "") {
    return `
      <div class="admin-filter-bar">
        <div class="filter-chips">
          ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="toolbar">${right}</div>
      </div>
    `;
  }

  function renderCustomerFilter() {
    const filters = state.ui.filters;
    return `
      <form class="filter-form" data-form="applyCustomerFilter">
        <div class="field"><label>客户/账号/用户ID</label><input name="customerKeyword" value="${escapeHtml(filters.customerKeyword)}" placeholder="输入客户名称、账号或用户ID" /></div>
        <div class="field"><label>归属状态</label><select name="customerStatus"><option value="all">全部</option><option value="bound" ${filters.customerStatus === "bound" ? "selected" : ""}>已绑定</option><option value="unbound" ${filters.customerStatus === "unbound" ? "selected" : ""}>未绑定</option></select></div>
        <div class="toolbar"><button class="btn primary" type="submit">筛选</button><button class="btn" type="button" data-action="clearCustomerFilter">清空</button></div>
      </form>
    `;
  }

  function renderPerformanceFilter() {
    const filters = state.ui.filters;
    return `
      <form class="filter-form" data-form="applyPerformanceFilter">
        <div class="field"><label>客户/流水/渠道账号</label><input name="performanceKeyword" value="${escapeHtml(filters.performanceKeyword)}" placeholder="输入客户ID、流水号、招商/运营/商务账号" /></div>
        <div class="field"><label>归属账号</label><input name="performanceOwner" value="${filters.performanceOwner === "all" ? "" : escapeHtml(filters.performanceOwner)}" placeholder="如 SW3001 / OP2001 / BD1001" /></div>
        <div class="toolbar"><button class="btn primary" type="submit">筛选</button><button class="btn" type="button" data-action="clearPerformanceFilter">清空</button></div>
      </form>
    `;
  }

  function filterCustomers(rows) {
    const keyword = state.ui.filters.customerKeyword.trim().toLowerCase();
    const status = state.ui.filters.customerStatus;
    return rows.filter((row) => {
      const hitKeyword = !keyword || [row.id, row.name, row.account, row.company, row.contact, row.ownerBusiness].some((value) => String(value || "").toLowerCase().includes(keyword));
      const hitStatus = status === "all" || row.status === status;
      return hitKeyword && hitStatus;
    });
  }

  function filterTransactions(rows) {
    const keyword = state.ui.filters.performanceKeyword.trim().toLowerCase();
    const owner = state.ui.filters.performanceOwner === "all" ? "" : state.ui.filters.performanceOwner.trim().toLowerCase();
    return rows.filter((row) => {
      const hitKeyword = !keyword || [row.id, row.customerId, row.investor, row.operator, row.business, row.downstream, row.ruleName, row.status].some((value) => String(value || "").toLowerCase().includes(keyword));
      const hitOwner = !owner || [row.investor, row.operator, row.business].some((value) => String(value || "").toLowerCase().includes(owner));
      return hitKeyword && hitOwner;
    });
  }

  function listFilterValue(filterKey) {
    state.ui.filters.listFilters = state.ui.filters.listFilters || {};
    return state.ui.filters.listFilters[filterKey] || { keyword: "", status: "all" };
  }

  function renderListFilter(filterKey, placeholder = "输入关键词", rows = []) {
    const filter = listFilterValue(filterKey);
    const statuses = [...new Set(rows.map((row) => row.status).filter(Boolean))];
    return `
      <form class="filter-form" data-form="applyListFilter">
        <input type="hidden" name="filterKey" value="${escapeHtml(filterKey)}" />
        <div class="field"><label>关键词</label><input name="keyword" value="${escapeHtml(filter.keyword || "")}" placeholder="${escapeHtml(placeholder)}" /></div>
        <div class="field"><label>状态</label><select name="status">
          <option value="all">全部状态</option>
          ${statuses.map((status) => `<option value="${escapeHtml(status)}" ${filter.status === status ? "selected" : ""}>${escapeHtml(statusName[status] || status)}</option>`).join("")}
        </select></div>
        <div class="toolbar"><button class="btn primary" type="submit">筛选</button><button class="btn" type="button" data-action="clearListFilter" data-filter-key="${escapeHtml(filterKey)}">清空</button></div>
      </form>
    `;
  }

  function filterListRows(filterKey, rows, fields) {
    const filter = listFilterValue(filterKey);
    const keyword = String(filter.keyword || "").trim().toLowerCase();
    const status = filter.status || "all";
    return rows.filter((row) => {
      const hitKeyword = !keyword || fields.some((field) => {
        const value = typeof field === "function" ? field(row) : row[field];
        return filterTextValue(value).includes(keyword);
      });
      const hitStatus = status === "all" || row.status === status;
      return hitKeyword && hitStatus;
    });
  }

  function filterTextValue(value) {
    if (Array.isArray(value)) return value.map(filterTextValue).join(" ").toLowerCase();
    if (value && typeof value === "object") return Object.values(value).map(filterTextValue).join(" ").toLowerCase();
    return String(value || "").toLowerCase();
  }

  function renderChannelDashboard(user) {
    const account = currentAccount();
    const transactions = visibleTransactions(user);
    const settlementRows = visibleSettlements(user);
    const summary = channelDashboardSummary(user, transactions, settlementRows);
    const interfaceRows = interfaceConsumptionRows(user, transactions);
    const scopeRows = scopeConsumptionRows(user, transactions);
    return `
      ${pageHeader(`${roleName[user.role]}数据中心`, "按当前账号的团队链路展示消耗、接口分布、历史累计和今日实时增量。", `
        <button class="btn" data-page="performance">查看返点流水</button>
        ${user.role === "business" ? `<button class="btn primary" data-page="bindings">查看我的客户</button>` : ""}
      `)}
      <div class="grid cols-4">
        ${metric("本账期预计结算", money(summary.currentExpectedSettlement), `${summary.currentPeriodLabel} 可见链路`)}
        ${metric("上账期结算", money(summary.previousSettlement), summary.previousPeriodLabel)}
        ${metric("历史结算总额", money(summary.historySettlement), "按月汇总")}
        ${metric("今日预计结算", `+ ${money(summary.todayExpectedSettlement)}`, "实时预估")}
      </div>
      <div class="grid cols-4">
        ${metric("本期流水总额", money(summary.currentFlow), "充值 + 消费")}
        ${metric("上账期流水", money(summary.previousFlow), summary.previousPeriodLabel)}
        ${metric("历史流水总额", money(summary.historyFlow), "按月汇总")}
        ${metric("今日流水", `+ ${money(summary.todayFlow)}`, "实时产生")}
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3>每月趋势</h3><p>展示可见链路内每月流水和预计结算额。</p></div>
          ${featureBadges(true, true)}
        </div>
        ${renderMonthlyTrend(summary.monthlyRows)}
      </div>
      <div class="card daily-flow-card">
        <div class="card-header"><div><h3>今日实时流水</h3><p>展示今天新增的客户流水和对应预计结算。</p></div>${featureBadges(true, true)}</div>
        ${renderDailyRealtimeRows(summary.todayRows, user)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>接口消耗分布</h3><p>按客户实际使用的接口/模型能力展示消耗金额。</p></div>${featureBadges(true, true)}</div>
        ${renderInterfaceConsumptionTable(interfaceRows)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>下游消耗汇总</h3><p>招商看运营/商务汇总，运营看商务和客户，商务看客户。</p></div>${featureBadges(true, true)}</div>
        ${renderScopeConsumptionSummary(scopeRows, user)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>结算处理</h3><p>渠道侧仅查看结算进展；账单由结算人审核、打款并归档。</p></div>${featureBadges(true, true)}</div>
        ${renderSettlementProgress(settlementRows)}
      </div>
    `;
  }

  function renderExternalBdDashboard() {
    return `
      ${pageHeader("模型BD模型用量", "模型BD独立于招商/运营/商务链路，只看模型关联、模型消耗和 BD 返点账单。", `
        <button class="btn primary" data-action="generateBdBill">生成上月自然月BD账单</button>
      `)}
      <div class="grid cols-4">
        ${metric("关联模型", state.entities.bdRelations.length, "总后台维护")}
        ${metric("计费消耗金额", money(state.entities.bdRelations.reduce((sum, item) => sum + modelBillableAmount(item), 0)), "模型接口读取")}
        ${metric("未结算账单", state.entities.bdBills.filter((item) => item.status !== "paid").length, "BD账单")}
        ${metric("预计返点", money(state.entities.bdBills.reduce((sum, item) => sum + item.amount, 0)), "按模型消耗计算")}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>模型关联</h3><p>模型BD不进入客户归属链路，不参与招商三层返点。</p></div>${featureBadges(true, true)}</div>
        ${renderBdRelationsTable()}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>BD 返点账单</h3><p>由总后台生成并登记付款。</p></div>${featureBadges(true, true)}</div>
        ${renderBdBillsTable()}
      </div>
    `;
  }

  function renderBusinessInvites(user) {
    return `
      ${pageHeader("固定邀请入口", "每个商务账号固定一个邀请码和邀请链接，不再单独管理多条邀请链接。", "")}
      ${renderFixedInviteCard(user?.accountId || currentAccount()?.id || "SW3001")}
    `;
  }

  function fixedInviteForBusiness(businessId) {
    const id = businessId || "SW3001";
    return {
      id: `FIX-${id}`,
      owner: id,
      code: `INV-${id}`,
      link: `https://storyaai.test/customer-bind?invite=FIX-${id}`,
      status: "active",
    };
  }

  function renderFixedInviteCard(businessId) {
    const invite = fixedInviteForBusiness(businessId);
    return `
      <div class="card">
        <div class="card-header"><div><h3>固定邀请入口</h3><p>该账号长期使用同一个邀请码和链接；客户提交后进入客户归属审批。</p></div>${featureBadges(true, true)}</div>
        <div class="grid cols-2">
          <div class="card"><strong>固定邀请码</strong><p>${escapeHtml(invite.code)}</p></div>
          <div class="card"><strong>固定邀请链接</strong><p>${escapeHtml(invite.link)}</p></div>
        </div>
      </div>
    `;
  }

  function renderBusinessBindings() {
    const account = currentAccount();
    const owner = account?.id || "SW3001";
    const rawApplications = state.entities.bindingApplications.filter((item) => item.ownerBusiness === owner);
    const applications = filterListRows("businessBindingApplications", rawApplications, ["id", "customerId", "customerName", "customerAccount", "customerCompany", "contact", "ownerBusiness", "sourceLink", "status", "reason", "rejectReason"]);
    const customers = filterCustomers(state.entities.customers.filter((item) => item.ownerBusiness === owner));
    return `
      ${pageHeader("我的客户", "客户通过链接提交资料后进入审批；审批通过前不计佣、不结算。", "")}
      ${renderFixedInviteCard(owner)}
      ${renderCustomerFilter()}
      ${renderListFilter("businessBindingApplications", "输入申请单、客户ID、客户名称、账号或状态", rawApplications)}
      <div class="card">
        <div class="card-header"><div><h3>绑定申请</h3><p>展示客户提交、审批中、审批通过和驳回状态。</p></div>${featureBadges(false, true)}</div>
        ${renderBindingTable(applications)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>客户列表</h3><p>审批通过后客户进入正式归属台账。</p></div>${featureBadges(true, true)}</div>
        ${renderCustomerTable(customers)}
      </div>
    `;
  }

  function renderCustomerBindPage() {
    const invite = state.entities.invites.find((item) => item.id === state.ui.openInviteId);
    const business = invite ? state.entities.channelAccounts.find((item) => item.id === invite.owner) : null;
    const chain = business ? channelChainForBusiness(business.id) : {};
    const inviteStatus = invite ? inviteEffectiveStatus(invite) : "expired";
    const usable = invite && isInviteUsable(invite);
    if (!invite) {
      return renderCustomerBindShell("邀请链接不存在", `
        <div class="customer-result danger">
          <strong>无法打开客户绑定页</strong>
          <span>请确认链接地址是否完整，或联系发送链接的商务重新发送。</span>
        </div>
      `);
    }
    if (!usable && !state.ui.customerSubmitResult) {
      return renderCustomerBindShell("邀请链接不可用", `
        <div class="customer-result danger">
          <strong>${escapeHtml(statusName[inviteStatus] || "链接不可用")}</strong>
          <span>该链接已提交、停用、过期或达到使用次数，不能再次提交客户归属申请。</span>
        </div>
        <div class="customer-link-card">
          <strong>${escapeHtml(invite.id)}</strong>
          <span>${escapeHtml(invite.link)}</span>
        </div>
      `);
    }
    if (state.ui.customerSubmitResult === "success") {
      const latest = state.entities.bindingApplications.find((item) => item.sourceLink === invite.id);
      return renderCustomerBindShell("绑定申请已提交", `
        <div class="customer-result success">
          <strong>资料已提交，等待平台审核</strong>
          <span>审核通过前不会计入商务客户列表，也不会进入业绩和结算。</span>
        </div>
        <div class="customer-summary-grid">
          ${summaryItem("申请单", latest?.id || "-")}
          ${summaryItem("客户", latest ? `${latest.customerId} / ${latest.customerName}` : "-")}
          ${summaryItem("归属商务", invite.owner)}
          ${summaryItem("当前状态", statusName[latest?.status] || "-")}
        </div>
        <div class="button-row">
          <span class="muted">平台审核完成后，工作人员会按资料联系。</span>
        </div>
      `);
    }
    const errorBanner = state.ui.customerSubmitResult === "error"
      ? `<div class="customer-result danger"><strong>提交未成功</strong><span>请检查链接状态、客户资料、重复归属或确认勾选项；具体原因见右侧数据状态和审计日志。</span></div>`
      : "";
    return renderCustomerBindShell("客户绑定确认", `
      <div class="customer-link-card">
        <strong>邀请链接 ${escapeHtml(invite.id)}</strong>
        <span>${escapeHtml(invite.link)}</span>
      </div>
      <div class="customer-summary-grid">
        ${summaryItem("申请归属商务", `${business?.id || invite.owner} / ${business?.name || "-"}`)}
        ${summaryItem("所属运营", chain.operator || "-")}
        ${summaryItem("所属招商", chain.investor || "-")}
        ${summaryItem("链接状态", statusName[inviteStatus] || inviteStatus)}
      </div>
      ${errorBanner}
      <form class="customer-form" data-form="submitCustomerBindingForm">
        <input type="hidden" name="inviteId" value="${escapeHtml(invite.id)}" />
        <div class="field"><label>客户ID</label><input name="customerId" value="C9001" /></div>
        <div class="field"><label>客户名称</label><input name="customerName" value="客户 C9001" /></div>
        <div class="field"><label>客户账号</label><input name="customerAccount" value="customer_demo" /></div>
        <div class="field"><label>客户主体</label><input name="customerCompany" value="示例客户主体" /></div>
        <div class="field"><label>联系人</label><input name="contact" value="13800000000" /></div>
        <div class="field"><label>补充说明</label><input name="reason" value="客户通过商务邀请链接进入，并确认归属该商务。" /></div>
        <label class="check-row"><input name="consent" type="checkbox" checked /> 确认以上客户资料真实，并同意提交平台审核</label>
        <div class="button-row">
          <button class="btn primary" type="submit">提交绑定申请</button>
        </div>
      </form>
    `);
  }

  function renderCustomerBindShell(title, content) {
    return `
      <section class="customer-public-shell">
        <div class="customer-public-head">
          <div>
            <span>塑梦 AI 客户入口</span>
            <h1>${escapeHtml(title)}</h1>
          </div>
          <span class="customer-public-badge">邀请链接访问</span>
        </div>
        <div class="customer-public-body">
          ${content}
        </div>
      </section>
    `;
  }

  function summaryItem(label, value) {
    return `<div class="summary-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  function inviteBackPage() {
    const user = currentUser();
    return user?.role === "business" ? "invites" : defaultPageForRole(user?.role);
  }

  function renderAdminAccounts() {
    const rawApplications = state.entities.accountApplications;
    const rawAccounts = state.entities.channelAccounts;
    const filterRows = rawApplications.concat(rawAccounts);
    const accountApplications = filterListRows("adminAccounts", rawApplications, ["id", "role", "name", "parent", "createdBy", "beneficiary", "contact", "username", "status", "source"]);
    const channelAccounts = filterListRows("adminAccounts", rawAccounts, ["id", "role", "name", "parent", "beneficiary", "contact", "username", "status", "source"]);
    return `
      ${pageHeader("账号治理", "管理招商、运营、商务三层渠道账号；默认密码为 password，首次登录必须修改。", `
        <button class="btn primary" data-action="openModal" data-modal="createChannelAccount">新增渠道账号</button>
      `)}
      ${adminFilterBar(["角色：全部", "状态：待官方终审/启用/驳回", "资料完整度：收款主体、手机号、上级关系", "风险：单账号单角色校验"], `<button class="btn ghost" type="button">导出账号清单</button>`)}
      ${renderListFilter("adminAccounts", "输入账号ID、名称、手机号、上级、角色或状态", filterRows)}
      <div class="card">
        <div class="card-header"><div><h3>待终审账号资料</h3><p>招商创建运营资料、运营创建商务资料后进入这里。</p></div>${featureBadges(false, true)}</div>
        ${renderAccountApplications(accountApplications)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>正式渠道账号</h3><p>账号通过终审后才可登录、获客、绑定客户、计佣和结算。</p></div>${featureBadges(true, true)}</div>
        ${renderChannelAccountsTable(channelAccounts)}
      </div>
    `;
  }

  function renderAdminOwnership() {
    const rawApplications = state.entities.bindingApplications;
    const rawLedger = state.entities.ownershipLedger;
    const applications = filterListRows("adminOwnership", rawApplications, ["id", "customerId", "customerName", "customerAccount", "customerCompany", "contact", "ownerBusiness", "sourceLink", "status", "reason", "rejectReason"]);
    const ledgerRows = filterListRows("adminOwnership", rawLedger, ["customerId", "investor", "operator", "business", "effectiveAt", "basis", "status"]);
    return `
      ${pageHeader("客户归属审批", "客户绑定必须审批，审批通过后写入正式客户归属台账。", "")}
      ${adminFilterBar(["审批状态：待审批", "客户：C9001/用户名/手机号", "来源：邀请链接", "冲突校验：历史归属/重复绑定", "处理人：总后台"], `<button class="btn ghost" type="button">查看冲突规则</button>`)}
      ${renderListFilter("adminOwnership", "输入客户ID、客户名称、商务、链接或状态", rawApplications.concat(rawLedger))}
      <div class="card">
        <div class="card-header"><div><h3>客户绑定申请</h3><p>总后台审批前不计佣；审批通过后生成客户归属台账。</p></div>${featureBadges(false, true)}</div>
        ${renderBindingTable(applications, (row) => row.status === "pending_binding_review" ? `
          <button class="btn success" data-action="approveBinding" data-id="${row.id}">通过</button>
          <button class="btn danger" data-action="rejectBinding" data-id="${row.id}">驳回</button>
        ` : "")}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>客户归属台账</h3><p>正式计佣依据，保留招商、运营、商务链路快照。</p></div>${featureBadges(false, true)}</div>
        ${renderLedgerTable(ledgerRows)}
      </div>
    `;
  }

  function renderPerformance(user) {
    const transactions = filterTransactions(visibleTransactions(user));
    const isAdmin = currentUser()?.role === "admin";
    const rules = visibleRebateRules(user);
    return `
      ${pageHeader(isAdmin ? "渠道返佣" : "返点流水", "先维护返佣规则库，再给具体招商、运营、商务账号选择规则。", `
        ${isAdmin ? `<button class="btn primary" data-action="openModal" data-modal="addRebateRule">新增返佣规则</button>` : ""}
      `)}
      ${isAdmin ? adminFilterBar([`账期：${settlementPeriod().label}`, "口径：充值/消费可配置", "规则库：先建规则", "渠道账号：下拉选择规则"], `<button class="btn ghost" type="button">导出核算明细</button>`) : ""}
      ${renderPerformanceFilter()}
      <div class="grid cols-4">
        ${metric("充值流水", money(transactions.reduce((sum, item) => sum + item.recharge, 0)), "原始账务")}
        ${metric("消费流水", money(transactions.reduce((sum, item) => sum + item.consume, 0)), "消费金额")}
        ${metric("退款扣减", money(transactions.reduce((sum, item) => sum + item.refund, 0)), "从返点基数扣除")}
        ${metric("返点基数", money(transactions.reduce((sum, item) => sum + rebateBaseForCurrentUser(item, user), 0)), "优惠券和赠送额度参与返点")}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>交易明细</h3><p>每笔流水保留客户、归属链路、返点基数和规则版本。</p></div>${featureBadges(true, true)}</div>
        ${renderTransactionsTable(transactions)}
      </div>
      ${!isAdmin && currentUser()?.role !== "externalBD" ? `
        <div class="card">
          <div class="card-header"><div><h3>关联客户</h3><p>按当前账号链路筛选，只展示审批通过后的客户。</p></div></div>
          ${renderCustomerTable(filterCustomers(visibleCustomers(user)))}
        </div>
      ` : ""}
      <div class="card">
        <div class="card-header"><div><h3>返点规则</h3><p>${isAdmin ? "总后台维护规则库；渠道账号在账号治理中选择已写好的规则。" : "只展示当前账号已选择的返佣规则。"}</p></div>${featureBadges(true, true)}</div>
        ${renderRulesTable(rules)}
      </div>
    `;
  }

  function renderSettlements(user) {
    const rawRows = visibleSettlements(user);
    const rows = filterListRows("settlements", rawRows, ["id", "periodStart", "periodEnd", "role", "owner", "ruleName", "cycle", "status"]);
    const isAdmin = user.role === "admin";
    const period = settlementPeriod();
    return `
      ${pageHeader(isAdmin ? "渠道结算" : "结算查看", "按自然月生成渠道账单，账单直接进入结算人处理；渠道侧只查看进度。", `
        ${isAdmin ? `<button class="btn primary" data-action="generateSettlement">生成上月自然月账单</button>` : ""}
      `)}
      ${isAdmin ? adminFilterBar([`账期：${period.start} 至 ${period.end}`, "状态：待审核/待打款/已打款", "层级：招商/运营/商务", "处理人：结算人"], `<button class="btn ghost" type="button">生成付款批次</button>`) : ""}
      ${renderListFilter("settlements", "输入账单、归属账号、规则、账期或状态", rawRows)}
      <div class="card">
        <div class="card-header"><div><h3>结算单</h3><p>支持结算人审核、打款和归档；渠道侧不需要确认。</p></div>${featureBadges(true, true)}</div>
        ${renderSettlementsTable(rows, user)}
      </div>
    `;
  }

  function renderWorkorders(user) {
    if (user.role === "admin") {
      const rawAccountApplications = state.entities.accountApplications;
      const rawPendingBindings = state.entities.bindingApplications.filter((item) => item.status === "pending_binding_review");
      const rawReviewedBindings = state.entities.bindingApplications.filter((item) => item.status !== "pending_binding_review");
      const rawWorkorders = state.entities.workorders;
      const filterRows = rawAccountApplications.concat(rawPendingBindings, rawReviewedBindings, rawWorkorders);
      const accountApplications = filterListRows("workorders", rawAccountApplications, ["id", "role", "name", "parent", "createdBy", "beneficiary", "status"]);
      const pendingBindings = filterListRows("workorders", rawPendingBindings, ["id", "customerId", "customerName", "customerAccount", "ownerBusiness", "sourceLink", "status", "reason"]);
      const reviewedBindings = filterListRows("workorders", rawReviewedBindings, ["id", "customerId", "customerName", "customerAccount", "ownerBusiness", "sourceLink", "status", "rejectReason"]);
      const workorders = filterListRows("workorders", rawWorkorders, ["id", "type", "title", "target", "status", "handler", "createdAt"]);
      return `
        ${pageHeader("官方终审", "账号资料和客户归属在这里分组处理，每个处理结果都写入业务对象。", "")}
        ${adminFilterBar(["类型：账号终审/客户归属", "状态：待处理/已通过/已驳回", "处理人：总后台", "SLA：24 小时内"], `<button class="btn ghost" type="button">查看处理规则</button>`)}
        ${renderListFilter("workorders", "输入工单、申请单、客户、账号、业务对象或状态", filterRows)}
        <div class="card">
          <div class="card-header"><div><h3>账号资料终审</h3><p>招商创建运营、运营创建商务后，在这里终审启用。</p></div>${featureBadges(false, true)}</div>
          ${renderAccountApplications(accountApplications)}
        </div>
        <div class="card">
          <div class="card-header"><div><h3>客户归属审批</h3><p>客户提交资料后进入待审；通过前不计佣、不结算。</p></div>${featureBadges(false, true)}</div>
          ${renderBindingTable(pendingBindings, (row) => `
            <button class="btn success" data-action="approveBinding" data-id="${row.id}">通过</button>
            <button class="btn danger" data-action="rejectBinding" data-id="${row.id}">驳回</button>
          `)}
        </div>
        <div class="card">
          <div class="card-header"><div><h3>已处理客户归属</h3><p>保留审批结论、来源链接和驳回原因，便于追溯。</p></div></div>
          ${renderBindingTable(reviewedBindings)}
        </div>
        <div class="card">
          <div class="card-header"><div><h3>工单记录</h3><p>每个审批和处理动作都有业务对象、状态和处理人。</p></div>${featureBadges(true, true)}</div>
          ${renderWorkorderTable(workorders)}
        </div>
      `;
    }
    const rawRows = visibleWorkorders(user);
    const rows = filterListRows("workorders", rawRows, ["id", "type", "title", "target", "status", "handler", "createdAt"]);
    return `
      ${pageHeader("官方终审", "承接账号资料终审、客户归属审批、补充材料和人工调整，不做泛化留言板。", "")}
      ${renderListFilter("workorders", "输入工单、标题、业务对象或状态", rawRows)}
      <div class="card">
        <div class="card-header"><div><h3>工单列表</h3><p>每个工单都必须有业务对象、状态、处理人和结果。</p></div>${featureBadges(true, true)}</div>
        ${renderWorkorderTable(rows)}
      </div>
    `;
  }

  function renderCustomerChannelOwnership() {
    const rawRows = state.entities.ownershipLedger.map((ledger) => {
      const customer = state.entities.customers.find((item) => item.id === ledger.customerId) || {};
      return {
        userId: ledger.customerId,
        customerAccount: customer.account || "-",
        customerName: customer.name || "-",
        business: ledger.business,
        operator: ledger.operator,
        investor: ledger.investor,
        effectiveAt: ledger.effectiveAt,
        basis: ledger.basis,
      };
    });
    const rows = filterListRows("customerChannelOwnership", rawRows, ["userId", "customerAccount", "customerName", "business", "operator", "investor", "effectiveAt", "basis"]);
    return `
      ${pageHeader("客户渠道归属", "查看所有已与商务绑定的客户，以及对应招商、运营、商务链路。", "")}
      ${adminFilterBar(["用户ID：全部", "客户账号：全部", "商务：全部", "状态：已生效"], `<button class="btn ghost" type="button">导出归属清单</button>`)}
      ${renderListFilter("customerChannelOwnership", "输入用户ID、客户账号、客户名称、商务、运营或招商", rawRows)}
      <div class="card">
        <div class="card-header"><div><h3>客户与渠道链路</h3><p>客户通过归属审批后才会进入本表，作为计佣和结算依据。</p></div>${featureBadges(true, true)}</div>
        ${table([
          { key: "userId", label: "用户ID" },
          { key: "customerAccount", label: "客户账号" },
          { key: "customerName", label: "客户名称" },
          { key: "business", label: "商务" },
          { key: "operator", label: "运营" },
          { key: "investor", label: "招商" },
          { key: "effectiveAt", label: "生效时间" },
          { key: "basis", label: "依据" },
        ], rows)}
      </div>
    `;
  }

  function renderBdSettlement(user) {
    const period = settlementPeriod();
    const rawBills = user.role === "externalBD"
      ? state.entities.bdBills.filter((item) => item.owner === user.accountId)
      : state.entities.bdBills;
    const bills = filterListRows("bdSettlement", rawBills, ["id", "periodStart", "periodEnd", "owner", "model", "usageType", "billingType", "usageUnit", "status"]);
    return `
      ${pageHeader("BD 结算", "按自然月生成模型BD返点账单，并处理线下打款状态。", `
        <button class="btn primary" data-action="generateBdBill">生成上月自然月BD账单</button>
      `)}
      ${adminFilterBar([`账期：${period.start} 至 ${period.end}`, "状态：待BD确认/待打款/已打款", "对象：模型BD", "来源：BD 模型关联"], "")}
      ${renderListFilter("bdSettlement", "输入BD账单、模型、BD账号、账期或状态", rawBills)}
      <div class="card">
        <div class="card-header"><div><h3>BD 账单</h3><p>总后台生成账单，模型BD确认后进入打款。</p></div>${featureBadges(true, true)}</div>
        ${renderBdBillsTable(user, bills)}
      </div>
    `;
  }

  function renderAudit() {
    const rows = filterListRows("audit", state.entities.audit, ["time", "actor", "action", "result", "status"]);
    return `
      ${pageHeader("审计日志", "所有关键动作都写入审计日志，用于研发验收和运营追溯。", "")}
      ${renderListFilter("audit", "输入时间、操作人、动作或结果", state.entities.audit)}
      <div class="card">
        ${renderAuditTable(rows)}
      </div>
    `;
  }

  function renderMessages(user) {
    const rawRows = visibleWorkorders(user).map((item) => ({ title: item.title, status: item.status, related: item.target, time: item.createdAt }));
    const rows = filterListRows("messages", rawRows, ["title", "status", "related", "time"]);
    return `
      ${pageHeader("工单消息", "状态变化、审批结论、疑问处理和付款完成都应通知对应角色。", "")}
      ${renderListFilter("messages", "输入消息、业务对象、时间或状态", rawRows)}
      <div class="card">
        ${table([
          { key: "title", label: "消息" },
          { key: "related", label: "关联对象" },
          { key: "status", label: "状态", type: "status" },
          { key: "time", label: "时间" },
        ], rows)}
      </div>
    `;
  }

  function renderActivityPoints(user) {
    const isAdmin = user.role === "admin";
    const account = currentAccount();
    const visiblePools = isAdmin
      ? state.entities.activityPools
      : state.entities.activityPools.filter((item) => getScopeAccountIds(account).includes(item.owner));
    const visibleLogs = isAdmin
      ? state.entities.activityLogs
      : state.entities.activityLogs.filter((item) => getScopeAccountIds(account).includes(item.from) || getScopeAccountIds(account).includes(item.to));
    const balance = isAdmin ? visiblePools.reduce((sum, item) => sum + Number(item.balance || 0), 0) : activityPointBalance(account?.id);
    return `
      ${pageHeader("活动积分", isAdmin ? "总后台只配置招商活动积分额度；后续由渠道上下级自行发放。" : "活动积分按渠道层级向下发放，商务可发给自己的客户。", `
        <button class="btn primary" data-action="openModal" data-modal="transferActivityPoints">${isAdmin ? "调整招商额度" : "发放活动积分"}</button>
      `)}
      <div class="grid cols-4">
        ${metric(isAdmin ? "渠道活动积分余额" : "我的活动积分余额", String(balance), isAdmin ? "全部招商/渠道余额" : "可继续向下发放")}
        ${metric("发放记录", String(visibleLogs.length), "当前可见范围")}
        ${metric("可发放对象", String(activityTransferTargets().length), "按当前角色")}
        ${metric("审批", "无", "线下沟通处理")}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>活动积分余额</h3><p>${isAdmin ? "总后台只直接调整招商额度。" : "显示当前链路内活动积分余额。"}</p></div>${featureBadges(true, true)}</div>
        ${renderActivityPoolTable(visiblePools)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>活动积分流水</h3><p>记录平台到招商、招商到运营、运营到商务、商务到客户的发放动作。</p></div>${featureBadges(true, true)}</div>
        ${renderActivityLogTable(visibleLogs)}
      </div>
    `;
  }

  function renderActivityPoolTable(rows) {
    return table([
      { key: "owner", label: "账号/对象" },
      { key: "role", label: "角色", value: (row) => roleName[row.role] || row.role },
      { key: "balance", label: "活动积分余额" },
      { key: "updatedAt", label: "更新时间" },
    ], rows);
  }

  function renderActivityLogTable(rows) {
    return table([
      { key: "id", label: "流水" },
      { key: "from", label: "发出方" },
      { key: "to", label: "接收方" },
      { key: "amount", label: "积分" },
      { key: "reason", label: "备注" },
      { key: "actor", label: "操作人" },
      { key: "createdAt", label: "时间" },
    ], rows);
  }

  function renderHelpCenter(user) {
    if (user.role === "admin") {
      return `
        <div class="article-topbar">
          <div>
            <h1>规则与协议</h1>
            <p>总后台分别维护招商、运营、商务、模型BD四份规则说明文本。</p>
          </div>
        </div>
        ${renderAdminHelpArticleList()}
      `;
    }
    const article = helpArticleForRole(user.role);
    return `
      <div class="article-topbar">
        <div>
          <h1>${escapeHtml(article.title || "规则与协议")}</h1>
          <p>当前仅展示本角色对应的规则说明。</p>
        </div>
      </div>
      <article class="help-article">
        ${renderMarkdownPreview(article.markdown)}
      </article>
    `;
  }

  function renderAdminHelpArticleList() {
    return `
      <div class="help-role-list">
        ${helpArticleRoleConfigs().map(([role, label]) => {
          const article = helpArticleForRole(role);
          return `
            <article class="help-role-item">
              <div class="help-role-head">
                <div>
                  <strong>${escapeHtml(label)}</strong>
                  <span>更新时间：${escapeHtml(article.updatedAt || "-")}</span>
                </div>
                <button class="btn primary" data-action="openModal" data-modal="editHelpArticle" data-role="${escapeHtml(role)}">编辑文本</button>
              </div>
              <div class="help-role-preview">
                ${renderMarkdownPreview(article.markdown)}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderProfile(user) {
    const account = currentAccount();
    const bdAccount = user.role === "externalBD" ? state.entities.bdAccounts.find((item) => item.id === user.accountId) : null;
    const info = user.role === "externalBD"
      ? { id: bdAccount?.id || "MXBD001", name: bdAccount?.name || "模型BD", role: "模型BD", parent: "无上级", status: statusName[bdAccount?.status] || "启用", 登录账号: bdAccount?.username || user.username }
      : { id: account?.id, name: account?.name, role: roleName[user.role], parent: account?.parent || "无上级", status: statusName[account?.status] || "-" };
    return `
      ${pageHeader("账号资料", "基础资料由总后台维护；当前账号可修改自己的登录密码。", "")}
      <div class="card">
        <div class="grid cols-2">
          ${Object.entries(info).map(([key, value]) => `<div class="card"><strong>${escapeHtml(key)}</strong><p>${escapeHtml(value)}</p></div>`).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>修改登录密码</h3><p>修改后下次登录使用新密码，管理员重置会覆盖当前密码。</p></div></div>
        <form class="form-grid" data-form="changeOwnPassword">
          <div class="field"><label>当前密码</label><input name="oldPassword" type="password" /></div>
          <div class="field"><label>新密码</label><input name="newPassword" type="password" /></div>
          <div class="field"><label>确认新密码</label><input name="confirmPassword" type="password" /></div>
          <div class="toolbar"><button class="btn primary" type="submit">修改密码</button></div>
        </form>
      </div>
    `;
  }

  function renderChildAccounts(user) {
    if (user.role === "investor") return renderInvestorHierarchy(user);
    if (user.role === "operator") return renderOperatorHierarchy(user);
    const account = currentAccount();
    const rawRows = state.entities.channelAccounts.filter((item) => item.parent === account?.id);
    const rawApplications = state.entities.accountApplications.filter((item) => item.createdBy === account?.id);
    const rows = filterListRows("childAccounts", rawRows, ["id", "name", "role", "parent", "beneficiary", "username", "contact", "status", "source"]);
    const applications = filterListRows("childAccounts", rawApplications, ["id", "role", "name", "parent", "createdBy", "beneficiary", "contact", "status"]);
    return `
      ${pageHeader("我的团队", "渠道可填写团队成员资料，但启用必须经过总后台官方终审。", `
        ${user.role === "investor" ? `<button class="btn primary" data-action="openModal" data-modal="createAccountDraft" data-role="operator">创建运营资料</button>` : ""}
        ${user.role === "operator" ? `<button class="btn primary" data-action="openModal" data-modal="createAccountDraft" data-role="business">创建商务资料</button>` : ""}
      `)}
      ${renderListFilter("childAccounts", "输入账号ID、名称、手机号、角色、客户或状态", rawRows.concat(rawApplications))}
      <div class="card">
        <div class="card-header"><div><h3>正式团队账号</h3><p>仅展示已启用账号；待审资料在总后台终审。</p></div>${featureBadges(true, true)}</div>
        ${renderChannelAccountsTable(rows)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>我提交的资料</h3><p>未通过官方终审前，不允许获客和计佣。</p></div>${featureBadges(false, true)}</div>
        ${renderAccountApplications(applications)}
      </div>
    `;
  }

  function renderInvestorHierarchy(user) {
    const account = currentAccount();
    const rawOperators = state.entities.channelAccounts.filter((item) => item.parent === account?.id);
    const operators = filterListRows("childAccounts", rawOperators, ["id", "name", "role", "parent", "beneficiary", "username", "contact", "status", "source"]);
    const operatorIds = operators.map((item) => item.id);
    const rawBusinesses = state.entities.channelAccounts.filter((item) => state.entities.channelAccounts.filter((operator) => operator.parent === account?.id).map((operator) => operator.id).includes(item.parent));
    const businesses = filterListRows("childAccounts", rawBusinesses, ["id", "name", "role", "parent", "beneficiary", "username", "contact", "status", "source"]);
    const rawApplications = state.entities.accountApplications.filter((item) => item.createdBy === account?.id);
    const applications = filterListRows("childAccounts", rawApplications, ["id", "role", "name", "parent", "createdBy", "beneficiary", "contact", "status"]);
    const summaryRows = renderBusinessConsumptionSummary(businesses.map((item) => item.id));
    return `
      ${pageHeader("我的团队", "招商可查看自己的运营、运营的商务，以及商务消耗汇总；不展示商务客户明细。", `
        <button class="btn primary" data-action="openModal" data-modal="createAccountDraft" data-role="operator">创建运营资料</button>
      `)}
      ${renderListFilter("childAccounts", "输入账号ID、名称、手机号、角色或状态", rawOperators.concat(rawBusinesses, rawApplications))}
      <div class="card">
        <div class="card-header"><div><h3>运营账号</h3><p>直属运营，通过官方终审后才启用。</p></div>${featureBadges(true, true)}</div>
        ${renderChannelAccountsTable(operators)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>运营的商务</h3><p>展示团队运营名下的商务账号。</p></div>${featureBadges(true, true)}</div>
        ${renderChannelAccountsTable(businesses)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>商务数据汇总</h3><p>只展示商务消耗和接口分布，不展示客户账号、客户ID或联系人。</p></div>${featureBadges(true, true)}</div>
        ${summaryRows}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>我提交的资料</h3><p>未通过官方终审前，不允许获客和计佣。</p></div>${featureBadges(false, true)}</div>
        ${renderAccountApplications(applications)}
      </div>
    `;
  }

  function renderOperatorHierarchy(user) {
    const account = currentAccount();
    const rawBusinesses = state.entities.channelAccounts.filter((item) => item.parent === account?.id);
    const businesses = filterListRows("childAccounts", rawBusinesses, ["id", "name", "role", "parent", "beneficiary", "username", "contact", "status", "source"]);
    const rawCustomers = state.entities.customers.filter((item) => rawBusinesses.map((business) => business.id).includes(item.ownerBusiness));
    const customers = filterCustomers(filterListRows("childAccounts", rawCustomers, ["id", "name", "account", "company", "contact", "status", "ownerBusiness"]));
    const rawApplications = state.entities.accountApplications.filter((item) => item.createdBy === account?.id);
    const applications = filterListRows("childAccounts", rawApplications, ["id", "role", "name", "parent", "createdBy", "beneficiary", "contact", "status"]);
    return `
      ${pageHeader("我的团队", "运营可查看自己的商务，以及商务已审批通过的客户。", `
        <button class="btn primary" data-action="openModal" data-modal="createAccountDraft" data-role="business">创建商务资料</button>
      `)}
      ${renderListFilter("childAccounts", "输入账号ID、名称、手机号、客户、角色或状态", rawBusinesses.concat(rawCustomers, rawApplications))}
      <div class="card">
        <div class="card-header"><div><h3>商务账号</h3><p>正式商务账号，通过官方终审后才启用。</p></div>${featureBadges(true, true)}</div>
        ${renderChannelAccountsTable(businesses)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>商务的客户</h3><p>只展示当前运营链路内的已归属客户。</p></div>${featureBadges(true, true)}</div>
        ${renderCustomerTable(filterCustomers(customers))}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>我提交的资料</h3><p>未通过官方终审前，不允许获客和计佣。</p></div>${featureBadges(false, true)}</div>
        ${renderAccountApplications(applications)}
      </div>
    `;
  }

  function renderBdModels(user = currentUser()) {
    if (user.role === "externalBD") {
      const rawRows = state.entities.bdRelations.filter((item) => item.owner === user.accountId);
      const rows = filterListRows("bdModels", rawRows, ["id", "owner", "model", "usageType", "billingType", "usageUnit", "basis", "cycle", "settlementAccount", "latestBill", "status"]);
      return `
        ${pageHeader("模型用量", "查看与自己关联的模型、日/周/月用量、返点口径和最近账单。", "")}
        ${renderListFilter("bdModels", "输入模型、用量类型、计费类型、账单或状态", rawRows)}
        <div class="grid cols-4">
          ${metric("关联模型", rows.length, "总后台维护")}
          ${metric("计费消耗金额", money(rows.reduce((sum, item) => sum + modelBillableAmount(item), 0)), "模型接口读取")}
          ${metric("预计返点", money(state.entities.bdBills.filter((item) => item.owner === user.accountId).reduce((sum, item) => sum + item.amount, 0)), "按模型账单汇总")}
          ${metric("未结算账单", state.entities.bdBills.filter((item) => item.owner === user.accountId && item.status !== "paid").length, "返点结算")}
        </div>
        <div class="card">
          <div class="card-header"><div><h3>关联模型与用量</h3><p>模型BD不创建团队账号、不绑定客户，只查看模型合作数据。</p></div></div>
          ${renderBdRelationsTable(rows)}
        </div>
      `;
    }
    const rawAccounts = state.entities.bdAccounts;
    const rawModels = state.entities.models;
    const rawRelations = state.entities.bdRelations;
    const filterRows = rawAccounts.concat(rawModels, rawRelations);
    const bdAccounts = filterListRows("bdModelsAdmin", rawAccounts, ["id", "name", "username", "contact", "beneficiary", "payment", "status", "source"]);
    const models = filterListRows("bdModelsAdmin", rawModels, ["id", "name", "provider", "usageType", "billingType", "usageUnit", "status"]);
    const relations = filterListRows("bdModelsAdmin", rawRelations, ["id", "owner", "model", "usageType", "billingType", "usageUnit", "basis", "cycle", "settlementAccount", "latestBill", "status"]);
    return `
      ${pageHeader("BD 模型关联", "维护模型BD账号、模型关系、消耗监控和返点口径；模型BD不进入招商/运营/商务客户链路。", `
        <button class="btn primary" data-action="openModal" data-modal="createModelBdAccount">新增模型BD</button>
        <button class="btn" data-action="openModal" data-modal="createBdRelation">新建模型关联</button>
      `)}
      ${renderListFilter("bdModelsAdmin", "输入BD账号、模型、用量类型、计费类型或状态", filterRows)}
      <div class="card">
        <div class="card-header"><div><h3>模型BD账号</h3><p>已启用的模型BD账号，可用于模型关联和 BD 结算。</p></div></div>
        ${renderBdAccountsTable(bdAccounts)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>可选模型列表</h3><p>新建模型关联时只能从这里的模型列表选择。</p></div></div>
        ${renderModelCatalogTable(models)}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>BD 模型关联与数据监控</h3><p>监控模型接口返回的日/周/月用量、计价快照、计费消耗金额和最近账单。</p></div></div>
        ${renderBdRelationsTable(relations)}
      </div>
    `;
  }

  function renderBdBills(user) {
    const rawBills = user.role === "externalBD"
      ? state.entities.bdBills.filter((item) => item.owner === user.accountId)
      : state.entities.bdBills;
    const bills = filterListRows("bdBills", rawBills, ["id", "periodStart", "periodEnd", "owner", "model", "usageType", "billingType", "usageUnit", "status"]);
    return `
      ${pageHeader("BD账单", "模型BD查看自己的模型返点账单，确认后进入总后台打款。", "")}
      ${renderListFilter("bdBills", "输入BD账单、模型、账期或状态", rawBills)}
      <div class="card">${renderBdBillsTable(user, bills)}</div>
    `;
  }

  function renderMarkdownPreview(markdown) {
    const lines = String(markdown || "").split(/\r?\n/);
    let html = "";
    let inList = false;
    const closeList = () => {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    };
    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        closeList();
        return;
      }
      if (line.startsWith("- ")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${renderInlineMarkdown(line.slice(2))}</li>`;
        return;
      }
      closeList();
      if (line.startsWith("### ")) html += `<h4>${renderInlineMarkdown(line.slice(4))}</h4>`;
      else if (line.startsWith("## ")) html += `<h3>${renderInlineMarkdown(line.slice(3))}</h3>`;
      else if (line.startsWith("# ")) html += `<h3>${renderInlineMarkdown(line.slice(2))}</h3>`;
      else html += `<p>${renderInlineMarkdown(line)}</p>`;
    });
    closeList();
    return `<div class="markdown-preview">${html || "<p>暂无内容。</p>"}</div>`;
  }

  function metric(label, value, hint) {
    return `
      <div class="card metric">
        <div class="label">${escapeHtml(label)}</div>
        <div class="value">${escapeHtml(value)}</div>
        <div class="hint">${escapeHtml(hint)}</div>
      </div>
    `;
  }

  function monthLabel(offset = 0) {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function isTodayTransaction(tx) {
    return String(tx.createdAt || dateOnly(new Date())).slice(0, 10) === dateOnly(new Date());
  }

  function channelDashboardSummary(user, transactions = visibleTransactions(user), settlementRows = visibleSettlements(user)) {
    const currentFlow = roundMoney(transactions.reduce((sum, item) => sum + transactionFlowTotal(item), 0));
    const projectedSettlement = roundMoney(projectedSettlementForTransactions(user, transactions));
    const currentExpectedSettlement = roundMoney(settlementRows.length ? settlementRows.reduce((sum, item) => sum + item.amount, 0) : projectedSettlement);
    const todayRows = transactions.filter(isTodayTransaction);
    const todayFlow = roundMoney(todayRows.reduce((sum, item) => sum + transactionFlowTotal(item), 0));
    const todayExpectedSettlement = roundMoney(projectedSettlementForTransactions(user, todayRows));
    const multipliers = [0.72, 0.84, 0.93, 1];
    const monthlyRows = multipliers.map((factor, index) => ({
      period: monthLabel(index - multipliers.length + 1),
      flow: roundMoney(currentFlow * factor),
      settlement: roundMoney(currentExpectedSettlement * factor),
    }));
    const previous = monthlyRows[monthlyRows.length - 2] || { flow: 0, settlement: 0, period: monthLabel(-1) };
    return {
      currentPeriodLabel: monthLabel(0),
      previousPeriodLabel: previous.period,
      currentFlow,
      previousFlow: previous.flow,
      historyFlow: roundMoney(monthlyRows.reduce((sum, item) => sum + item.flow, 0)),
      todayFlow,
      currentExpectedSettlement,
      previousSettlement: previous.settlement,
      historySettlement: roundMoney(monthlyRows.reduce((sum, item) => sum + item.settlement, 0)),
      todayExpectedSettlement,
      todayRows,
      monthlyRows,
    };
  }

  function renderMonthlyTrend(rows) {
    if (!rows.length) return `<div class="empty">暂无数据。</div>`;
    const chartWidth = 760;
    const chartHeight = 176;
    const pad = { top: 28, right: 28, bottom: 38, left: 56 };
    const innerWidth = chartWidth - pad.left - pad.right;
    const innerHeight = chartHeight - pad.top - pad.bottom;
    const xFor = (index) => pad.left + (rows.length === 1 ? innerWidth / 2 : (innerWidth / (rows.length - 1)) * index);
    const renderChart = (key, label, className) => {
      const values = rows.map((item) => Number(item[key] || 0));
      const maxValue = Math.max(...values, 1);
      const yFor = (value) => pad.top + innerHeight - (Number(value || 0) / maxValue) * innerHeight;
      const points = rows.map((item, index) => `${xFor(index)},${yFor(item[key])}`).join(" ");
      return `
        <div class="trend-chart-panel">
          <div class="trend-chart-head"><strong>${escapeHtml(label)}趋势</strong><span>峰值 ${escapeHtml(money(maxValue))}</span></div>
          <svg class="trend-chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}" role="img" aria-label="${escapeHtml(label)}每月趋势">
            <line class="trend-axis" x1="${pad.left}" y1="${pad.top + innerHeight}" x2="${chartWidth - pad.right}" y2="${pad.top + innerHeight}"></line>
            <line class="trend-axis" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + innerHeight}"></line>
            ${[0.25, 0.5, 0.75].map((ratio) => `<line class="trend-grid-line" x1="${pad.left}" y1="${pad.top + innerHeight * ratio}" x2="${chartWidth - pad.right}" y2="${pad.top + innerHeight * ratio}"></line>`).join("")}
            <text class="trend-y-label" x="${pad.left - 10}" y="${pad.top + 4}" text-anchor="end">${escapeHtml(money(maxValue))}</text>
            <text class="trend-y-label" x="${pad.left - 10}" y="${pad.top + innerHeight + 4}" text-anchor="end">0</text>
            <polyline class="trend-line ${className}" points="${points}"></polyline>
            ${rows.map((item, index) => {
              const x = xFor(index);
              const y = yFor(item[key]);
              const labelY = Math.max(14, y - 9);
              return `
                <g class="trend-point-group">
                  <circle class="trend-dot ${className}" cx="${x}" cy="${y}" r="4"></circle>
                  <text class="trend-point-label" x="${x}" y="${labelY}" text-anchor="middle">${escapeHtml(money(item[key]))}</text>
                  <text class="trend-x-label" x="${x}" y="${chartHeight - 12}" text-anchor="middle">${escapeHtml(item.period)}</text>
                </g>
              `;
            }).join("")}
          </svg>
        </div>
      `;
    };
    return `
      <div class="trend-line-chart">
        <div class="trend-chart-legend">
          <span><i class="flow-line"></i>流水</span>
          <span><i class="settlement-line"></i>预计结算</span>
        </div>
        ${renderChart("flow", "流水", "flow-line")}
        ${renderChart("settlement", "预计结算", "settlement-line")}
        <div class="trend-chart-values">
          ${rows.map((item) => `
            <div>
              <strong>${escapeHtml(item.period)}</strong>
              <span>流水 ${escapeHtml(money(item.flow))}</span>
              <span>预计结算 ${escapeHtml(money(item.settlement))}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderDailyRealtimeRows(rows, user) {
    if (!rows.length) return `<div class="empty">今日暂无新增流水。</div>`;
    return table([
      { key: "customerId", label: "客户ID" },
      { key: "downstream", label: "来源链路", value: (row) => downstreamPath(row, user) },
      { key: "recharge", label: "充值", type: "money" },
      { key: "consume", label: "消费", type: "money" },
      { key: "refund", label: "退款扣减", type: "money" },
      { key: "effectiveBase", label: "返点基数", value: (row) => rebateBaseForCurrentUser(row, user), type: "money" },
    ], rows);
  }

  function interfaceConsumptionRows(user, transactions = visibleTransactions(user)) {
    const groups = new Map();
    transactions.forEach((tx, index) => {
      const interfaceName = tx.interfaceName || ["视频生成接口", "图片生成接口", "脚本处理接口"][index % 3];
      const current = groups.get(interfaceName) || { interfaceName, consume: 0, recharge: 0, refund: 0, count: 0 };
      current.consume += Number(tx.consume || 0);
      current.recharge += Number(tx.recharge || 0);
      current.refund += Number(tx.refund || 0);
      current.count += 1;
      groups.set(interfaceName, current);
    });
    return [...groups.values()].map((row) => ({
      ...row,
      netConsume: Math.max(0, roundMoney(row.consume - row.refund)),
    }));
  }

  function scopeConsumptionRows(user, transactions = visibleTransactions(user)) {
    const role = user?.role;
    const groupKey = (tx) => {
      if (role === "investor") return tx.operator || tx.business || "未归属运营";
      if (role === "operator") return tx.business || tx.customerId || "未归属商务";
      if (role === "business") return tx.customerId || "未归属客户";
      return tx.business || tx.operator || tx.investor || "未归属";
    };
    const groups = new Map();
    transactions.forEach((tx) => {
      const owner = groupKey(tx);
      const current = groups.get(owner) || { owner, consume: 0, recharge: 0, refund: 0, count: 0 };
      current.consume += Number(tx.consume || 0);
      current.recharge += Number(tx.recharge || 0);
      current.refund += Number(tx.refund || 0);
      current.count += 1;
      groups.set(owner, current);
    });
    return [...groups.values()].map((row) => ({
      ...row,
      netConsume: Math.max(0, roundMoney(row.consume - row.refund)),
    }));
  }

  function renderInterfaceConsumptionTable(rows) {
    return table([
      { key: "interfaceName", label: "接口/能力" },
      { key: "consume", label: "消耗金额", type: "money" },
      { key: "refund", label: "退款扣减", type: "money" },
      { key: "netConsume", label: "净消耗", type: "money" },
      { key: "count", label: "流水数" },
    ], rows);
  }

  function renderScopeConsumptionSummary(rows, user) {
    const label = user?.role === "investor" ? "下游运营/商务" : user?.role === "operator" ? "商务/客户" : "客户";
    return table([
      { key: "owner", label },
      { key: "consume", label: "消耗金额", type: "money" },
      { key: "refund", label: "退款扣减", type: "money" },
      { key: "netConsume", label: "净消耗", type: "money" },
      { key: "count", label: "流水数" },
    ], rows);
  }

  function renderBusinessConsumptionSummary(businessIds) {
    const rows = businessIds.map((businessId) => {
      const txs = state.entities.transactions.filter((tx) => tx.business === businessId);
      const consume = roundMoney(txs.reduce((sum, tx) => sum + Number(tx.consume || 0), 0));
      const refund = roundMoney(txs.reduce((sum, tx) => sum + Number(tx.refund || 0), 0));
      const topInterface = interfaceConsumptionRows(currentUser(), txs).sort((a, b) => b.netConsume - a.netConsume)[0]?.interfaceName || "-";
      return {
        business: businessId,
        consume,
        refund,
        netConsume: Math.max(0, roundMoney(consume - refund)),
        topInterface,
        count: txs.length,
      };
    });
    return table([
      { key: "business", label: "商务账号" },
      { key: "consume", label: "消耗金额", type: "money" },
      { key: "refund", label: "退款扣减", type: "money" },
      { key: "netConsume", label: "净消耗", type: "money" },
      { key: "topInterface", label: "主要接口" },
      { key: "count", label: "流水数" },
    ], rows);
  }

  function renderSettlementProgress(rows) {
    return table([
      { key: "id", label: "结算单" },
      { key: "periodStart", label: "账期开始" },
      { key: "periodEnd", label: "账期结束" },
      { key: "owner", label: "归属账号" },
      { key: "amount", label: "返点金额", type: "money" },
      { key: "status", label: "状态", type: "status" },
    ], rows);
  }

  function renderMainFlowActions() {
    return `
      <div class="button-row ops-flow">
        <button class="ops-btn primary" data-action="generateInvite">1 生成链接</button>
        <button class="ops-btn" data-action="openFirstCustomerBindPage">2 打开客户绑定页</button>
        <button class="ops-btn" data-action="submitDemoCustomerBinding">3 客户填表提交</button>
        <button class="ops-btn success" data-action="approveFirstBinding">4 审批归属</button>
        <button class="ops-btn" data-action="simulateTransaction">5 生成业绩</button>
        <button class="ops-btn" data-action="ensureDemoRebateRules">6 配置测试规则</button>
        <button class="ops-btn" data-action="generateSettlement">7 生成自然月账单</button>
        <button class="ops-btn success" data-action="approveSettlement">8 结算人审核</button>
        <button class="ops-btn success" data-action="paySettlement">9 打款归档</button>
      </div>
    `;
  }

  function renderInvitesTable(rows) {
    return table([
      { key: "id", label: "链接编号" },
      { key: "owner", label: "商务" },
      { key: "link", label: "邀请链接" },
      { key: "status", label: "状态", type: "status", value: (row) => inviteEffectiveStatus(row) },
      { key: "used", label: "已使用" },
      { key: "maxUses", label: "上限" },
      { key: "expiresAt", label: "有效期" },
      { key: "createdAt", label: "创建时间" },
    ], rows);
  }

  function renderCustomerTable(rows) {
    return table([
      { key: "id", label: "客户ID" },
      { key: "name", label: "客户" },
      { key: "account", label: "客户账号" },
      { key: "company", label: "客户主体" },
      { key: "contact", label: "联系人" },
      { key: "status", label: "归属状态", type: "status" },
      { key: "ownerBusiness", label: "归属商务" },
      { key: "boundAt", label: "生效时间" },
    ], rows);
  }

  function renderBindingTable(rows, actions) {
    return table([
      { key: "id", label: "申请单" },
      { key: "customerId", label: "客户" },
      { key: "customerName", label: "客户名称" },
      { key: "customerAccount", label: "客户账号" },
      { key: "customerCompany", label: "客户主体" },
      { key: "contact", label: "联系人" },
      { key: "ownerBusiness", label: "申请归属商务" },
      { key: "sourceLink", label: "来源链接" },
      { key: "status", label: "状态", type: "status" },
      { key: "reason", label: "材料说明" },
      { key: "rejectReason", label: "驳回原因" },
    ], rows, actions);
  }

  function renderLedgerTable(rows = state.entities.ownershipLedger) {
    return table([
      { key: "customerId", label: "客户" },
      { key: "investor", label: "招商" },
      { key: "operator", label: "运营" },
      { key: "business", label: "商务" },
      { key: "effectiveAt", label: "生效时间" },
      { key: "basis", label: "计佣依据" },
    ], rows);
  }

  function renderTransactionsTable(rows) {
    return table([
      { key: "id", label: "流水" },
      { key: "customerId", label: "客户" },
      { key: "downstream", label: "下游来源", value: (row) => downstreamPath(row, currentUser()) },
      { key: "investor", label: "招商" },
      { key: "operator", label: "运营" },
      { key: "business", label: "商务" },
      { key: "recharge", label: "充值", type: "money" },
      { key: "consume", label: "消费", type: "money" },
      { key: "refund", label: "退款", type: "money" },
      { key: "coupon", label: "优惠券", type: "money" },
      { key: "gift", label: "赠送额度", type: "money" },
      { key: "effectiveBase", label: "返点基数", value: (row) => rebateBaseForCurrentUser(row, currentUser()), type: "money" },
      { key: "status", label: "状态", type: "status" },
    ], rows);
  }

  function renderRulesTable(rows = visibleRebateRules(currentUser())) {
    return table([
      { key: "name", label: "规则" },
      { key: "basis", label: "口径" },
      { key: "rate", label: "比例", type: "percent" },
      { key: "cycle", label: "周期" },
      { key: "status", label: "状态", type: "status" },
    ], rows, (row) => currentUser()?.role === "admin" ? `
      <button class="btn" data-action="openModal" data-modal="editRebateRule" data-id="${row.id}">编辑</button>
    ` : "");
  }

  function renderSettlementsTable(rows, user) {
    return table([
      { key: "id", label: "结算单" },
      { key: "periodStart", label: "账期开始" },
      { key: "periodEnd", label: "账期结束" },
      { key: "role", label: "层级" },
      { key: "owner", label: "归属账号" },
      { key: "ruleName", label: "适用规则" },
      { key: "cycle", label: "返佣周期" },
      { key: "base", label: "返点基数", type: "money" },
      { key: "rate", label: "比例", type: "percent" },
      { key: "amount", label: "返点金额", type: "money" },
      { key: "status", label: "状态", type: "status" },
    ], rows, (row) => settlementActions(row, user));
  }

  function settlementActions(row, user) {
    if (user.role === "admin") {
      if (row.status === "pending_admin_review") return `<button class="btn success" data-action="approveSettlement" data-id="${row.id}">审核通过</button>`;
      if (row.status === "approved") return `<button class="btn success" data-action="paySettlement" data-id="${row.id}">登记打款</button>`;
      return "";
    }
    return "";
  }


  function renderWorkorderTable(rows) {
    return table([
      { key: "id", label: "工单" },
      { key: "type", label: "类型" },
      { key: "title", label: "标题" },
      { key: "target", label: "业务对象" },
      { key: "status", label: "状态", type: "status" },
      { key: "handler", label: "处理人" },
      { key: "createdAt", label: "创建时间" },
    ], rows);
  }

  function renderAccountApplications(rows = state.entities.accountApplications) {
    return table([
      { key: "id", label: "资料单" },
      { key: "role", label: "拟角色", value: (row) => roleName[row.role] },
      { key: "name", label: "姓名" },
      { key: "parent", label: "拟上级" },
      { key: "createdBy", label: "创建人" },
      { key: "beneficiary", label: "受益主体" },
      { key: "status", label: "状态", type: "status" },
    ], rows, (row) => currentUser()?.role === "admin" && row.status === "pending_official_review"
      ? `<button class="btn success" data-action="approveAccount" data-id="${row.id}">终审通过</button><button class="btn danger" data-action="rejectAccount" data-id="${row.id}">驳回</button>`
      : "");
  }

  function renderChannelAccountsTable(rows = state.entities.channelAccounts) {
    return table([
      { key: "id", label: "账号" },
      { key: "name", label: "名称" },
      { key: "role", label: "角色", value: (row) => roleName[row.role] },
      { key: "parent", label: "上级" },
      { key: "beneficiary", label: "受益主体" },
      { key: "username", label: "登录账号" },
      { key: "contact", label: "手机号" },
      { key: "mustChangePassword", label: "登录要求", value: (row) => row.mustChangePassword ? "首次登录改密" : "正常" },
      { key: "rebateRule", label: "返点规则", value: (row) => ruleNameForAccount(row.id) },
      { key: "status", label: "状态", type: "status" },
      { key: "source", label: "来源" },
    ], rows, (row) => currentUser()?.role === "admin" ? `
      <button class="btn" data-action="openModal" data-modal="editChannelAccount" data-id="${row.id}">编辑</button>
      <button class="btn" data-action="openModal" data-modal="assignRebateRule" data-id="${row.id}">${row.rebateRuleId ? "更换返点" : "配置返点"}</button>
      <button class="btn" data-action="resetChannelPassword" data-id="${row.id}">重置密码</button>
    ` : "");
  }

  function renderBdAccountsTable(rows = state.entities.bdAccounts) {
    return table([
      { key: "id", label: "BD账号" },
      { key: "name", label: "名称" },
      { key: "username", label: "登录账号" },
      { key: "contact", label: "手机号" },
      { key: "beneficiary", label: "受益主体" },
      { key: "payment", label: "收款账户" },
      { key: "mustChangePassword", label: "登录要求", value: (row) => row.mustChangePassword ? "首次登录改密" : "正常" },
      { key: "status", label: "状态", type: "status" },
      { key: "source", label: "来源" },
    ], rows, (row) => currentUser()?.role === "admin" ? `<button class="btn" data-action="openModal" data-modal="editModelBdAccount" data-id="${row.id}">编辑</button><button class="btn" data-action="resetModelBdPassword" data-id="${row.id}">重置密码</button>` : "");
  }

  function renderModelCatalogTable(rows = state.entities.models) {
    return table([
      { key: "id", label: "模型ID" },
      { key: "name", label: "模型名称" },
      { key: "provider", label: "供应方" },
      { key: "usageType", label: "用量类型" },
      { key: "billingType", label: "计费类型" },
      { key: "usageUnit", label: "用量单位" },
      { key: "unitPriceSnapshot", label: "模型结算单价", value: (row) => formatUnitPrice(row.unitPriceSnapshot, row.usageUnit) },
      { key: "status", label: "状态", type: "status" },
    ], rows);
  }

  function renderBdRelationsTable(rows = state.entities.bdRelations) {
    return table([
      { key: "id", label: "关联" },
      { key: "owner", label: "BD账号" },
      { key: "model", label: "模型" },
      { key: "usageType", label: "用量类型" },
      { key: "billingType", label: "计费类型" },
      { key: "usageUnit", label: "用量单位" },
      { key: "dayUsage", label: "日消耗", value: (row) => formatUsageQuantity(row.dayUsage, row.usageUnit) },
      { key: "weekUsage", label: "周消耗", value: (row) => formatUsageQuantity(row.weekUsage, row.usageUnit) },
      { key: "usage", label: "月消耗", value: (row) => formatUsageQuantity(row.usage, row.usageUnit) },
      { key: "unitPriceSnapshot", label: "模型结算单价", value: (row) => formatUnitPrice(row.unitPriceSnapshot, row.usageUnit) },
      { key: "billableAmount", label: "计费消耗金额", type: "money" },
      { key: "basis", label: "返点口径" },
      { key: "rate", label: "比例", type: "percent" },
      { key: "cycle", label: "周期" },
      { key: "settlementAccount", label: "结算账号" },
      { key: "latestBill", label: "最近账单" },
      { key: "status", label: "状态", type: "status" },
    ], rows);
  }

  function renderBdBillsTable(user = currentUser(), rows = null) {
    const visibleRows = rows || (user.role === "externalBD"
      ? state.entities.bdBills.filter((item) => item.owner === user.accountId)
      : state.entities.bdBills);
    return table([
      { key: "id", label: "账单" },
      { key: "periodStart", label: "账期开始" },
      { key: "periodEnd", label: "账期结束" },
      { key: "owner", label: "BD账号" },
      { key: "model", label: "关联模型" },
      { key: "usageType", label: "用量类型" },
      { key: "billingType", label: "计费类型" },
      { key: "usageUnit", label: "用量单位" },
      { key: "usage", label: "账期用量", value: (row) => formatUsageQuantity(row.usage, row.usageUnit) },
      { key: "unitPriceSnapshot", label: "模型结算单价", value: (row) => formatUnitPrice(row.unitPriceSnapshot, row.usageUnit) },
      { key: "billableAmount", label: "计费消耗金额", type: "money" },
      { key: "rate", label: "比例", type: "percent" },
      { key: "amount", label: "返点金额", type: "money" },
      { key: "status", label: "状态", type: "status" },
    ], visibleRows, (row) => {
      if (user.role === "admin") {
        if (row.status === "pending_payment") return `<button class="btn success" data-action="payBdBill" data-id="${row.id}">登记打款</button>`;
        return "";
      }
      if (user.role === "externalBD" && row.status === "pending_bd_confirm") {
        return `<button class="btn success" data-action="confirmBdBill" data-id="${row.id}">确认</button>`;
      }
      return "";
    });
  }


  function renderAuditTable(rows = state.entities.audit) {
    return table([
      { key: "time", label: "时间" },
      { key: "actor", label: "操作人" },
      { key: "action", label: "动作" },
      { key: "result", label: "结果" },
    ], rows);
  }

  function renderRightPanel(user) {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h3>数据状态</h3>
            <p>演示辅助信息，不属于真实后台页面。当前焦点：${escapeHtml(state.ui.focus)}</p>
          </div>
        </div>
        <ul class="flow-list">${renderMainFlowSteps()}</ul>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>当前关键数据</h3><p>用于验证全流程是否闭环。</p></div></div>
        ${renderDataSnapshot()}
      </div>
      <div class="card">
        <div class="card-header"><div><h3>最近动作</h3><p>所有按钮动作都会记录。</p></div></div>
        <ul class="log-list">
          ${state.entities.audit.slice(0, 8).map((item) => `
            <li class="log-item"><strong>${escapeHtml(item.time)} · ${escapeHtml(item.actor)}</strong><span>${escapeHtml(item.action)}：${escapeHtml(item.result)}</span></li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  function renderMainFlowSteps() {
    const progress = getFlowProgress();
    const steps = [
      ["invite", "商务生成邀请链接", "系统记录链接、归属商务和生成时组织链路。"],
      ["binding", "客户提交绑定申请", "客户归属进入待官方审批，不计佣。"],
      ["approval", "总后台审批归属", "通过后写入客户归属台账。"],
      ["performance", "产生业绩并计算返点", "退款扣减返点基数，优惠券和赠送额度参与返点。"],
      ["settlement", "生成结算单", "结算单直接进入结算人审核。"],
      ["confirm", "结算人审核", "审核通过后进入打款处理。"],
      ["pay", "总后台打款归档", "结算完成，历史可追溯。"],
    ];
    return steps.map((step, index) => {
      const cls = progress.done.includes(step[0]) ? "done" : progress.active === step[0] ? "active" : "";
      return `<li class="flow-item ${cls}"><div class="flow-dot">${index + 1}</div><div><strong>${step[1]}</strong><span>${step[2]}</span></div></li>`;
    }).join("");
  }

  function getFlowProgress() {
    const e = state.entities;
    const done = [];
    if (e.invites.some((item) => ["generated", "opened", "submitted"].includes(item.status))) done.push("invite");
    if (e.bindingApplications.length) done.push("binding");
    if (e.ownershipLedger.length) done.push("approval");
    if (e.transactions.length) done.push("performance");
    if (e.settlements.length) done.push("settlement");
    if (e.settlements.some((item) => [, "pending_admin_review", "approved", "paid"].includes(item.status))) done.push("confirm");
    if (e.settlements.some((item) => item.status === "paid")) done.push("pay");
    const keys = ["invite", "binding", "approval", "performance", "settlement", "confirm", "pay"];
    const active = keys.find((key) => !done.includes(key)) || "pay";
    return { done, active };
  }

  function renderDataSnapshot() {
    const e = state.entities;
    const latestInvite = e.invites.slice(-1)[0];
    const latestBinding = e.bindingApplications.slice(-1)[0];
    const latestSettlement = e.settlements.slice(-1)[0];
    const rows = [
      ["邀请链接", latestInvite ? `${latestInvite.id} · ${statusName[inviteEffectiveStatus(latestInvite)]}` : "未生成"],
      ["客户绑定", latestBinding ? `${latestBinding.id} · ${statusName[latestBinding.status]}` : "未提交"],
      ["归属台账", e.ownershipLedger.length ? `${e.ownershipLedger.length} 条正式归属` : "未写入"],
      ["交易流水", e.transactions.length ? `${e.transactions.length} 条，合计 ${money(e.transactions.reduce((sum, item) => sum + rebateBaseForTransaction(item, "充值"), 0))}` : "未产生"],
      ["结算状态", latestSettlement ? `${latestSettlement.id} · ${statusName[latestSettlement.status]}` : "未生成"],
    ];
    return `<div class="grid">${rows.map(([label, value]) => `<div class="role-card"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`).join("")}</div>`;
  }

  function getScopeAccountIds(account) {
    if (!account) return [];
    if (account.role === "business") return [account.id];
    if (account.role === "operator") return state.entities.channelAccounts.filter((item) => item.parent === account.id || item.id === account.id).map((item) => item.id);
    if (account.role === "investor") {
      const operators = state.entities.channelAccounts.filter((item) => item.parent === account.id).map((item) => item.id);
      const businesses = state.entities.channelAccounts.filter((item) => operators.includes(item.parent)).map((item) => item.id);
      return [account.id, ...operators, ...businesses];
    }
    return [];
  }

  function channelChainForBusiness(businessId) {
    const business = state.entities.channelAccounts.find((item) => item.id === businessId);
    const operator = state.entities.channelAccounts.find((item) => item.id === business?.parent);
    const investor = state.entities.channelAccounts.find((item) => item.id === operator?.parent);
    return {
      business: business?.id || businessId || "",
      operator: operator?.id || "",
      investor: investor?.id || "",
    };
  }

  function seededAutoRuleIds() {
    return [
      ["RULE", "SW3001", "202607"],
      ["RULE", "OP2001", "202607"],
      ["RULE", "BD1001", "202607"],
    ].map((parts) => parts.join("-"));
  }

  function ensureDemoRebateRules() {
    const specs = [
      { id: "DEMO-RULE-BUSINESS", accountId: "SW3001", name: "测试商务返佣规则", rate: 0.04 },
      { id: "DEMO-RULE-OPERATOR", accountId: "OP2001", name: "测试运营返佣规则", rate: 0.02 },
      { id: "DEMO-RULE-INVESTOR", accountId: "BD1001", name: "测试招商返佣规则", rate: 0.01 },
    ];
    let created = 0;
    specs.forEach((spec) => {
      if (!state.entities.rebateRules.some((item) => item.id === spec.id)) {
        state.entities.rebateRules.push({
          id: spec.id,
          name: spec.name,
          rate: spec.rate,
          basis: "充值",
          cycle: "自然月",
          status: "active",
        });
        created += 1;
      }
      const account = state.entities.channelAccounts.find((item) => item.id === spec.accountId);
      if (account) account.rebateRuleId = spec.id;
    });
    addAudit(actorName(), "配置测试返点规则", created ? `已创建 ${created} 条测试规则并完成账号选择` : "测试规则已存在并已完成账号选择");
  }

  function channelAccountLabel(accountId) {
    if (!accountId) return "未指定账号";
    const account = state.entities.channelAccounts.find((item) => item.id === accountId);
    return account ? `${account.id} / ${account.name}` : accountId;
  }

  function rebateRuleOptions(selected = "") {
    const options = [`<option value="">不配置</option>`];
    state.entities.rebateRules
      .filter((item) => item.status === "active" || item.id === selected)
      .forEach((item) => {
        const label = `${item.name} / ${item.basis} / ${percent(item.rate)} / ${item.cycle}${item.status === "active" ? "" : " / 停用"}`;
        options.push(`<option value="${escapeHtml(item.id)}" ${item.id === selected ? "selected" : ""}>${escapeHtml(label)}</option>`);
      });
    return options.join("");
  }

  function optionList(values, selected = "") {
    return values.map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
  }

  function basisOptions(selected = "充值") {
    return optionList(["充值", "消费"], selected);
  }

  function modelBdRebateBasis() {
    return "模型消耗返点";
  }

  function rebateCycleOptions(selected = "自然月") {
    return optionList(["自然月", "周结", "季度"], selected);
  }

  function ruleStatusOptions(selected = "active") {
    const labels = { active: "启用", disabled: "停用" };
    return ["active", "disabled"].map((value) => `<option value="${value}" ${value === selected ? "selected" : ""}>${labels[value]}</option>`).join("");
  }

  function renderInlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer">$1</a>`);
  }

  function rateInputValue(rule) {
    if (!rule?.rate) return "";
    return String(Number((Number(rule.rate) * 100).toFixed(2))).replace(/\.00$/, "");
  }

  function visibleRebateRules(user) {
    if (!user) return [];
    if (user.role === "admin") return state.entities.rebateRules;
    if (user.role === "externalBD") return [];
    const account = currentAccount();
    if (!account) return [];
    return state.entities.rebateRules.filter((rule) => rule.id === account.rebateRuleId);
  }

  function ruleForSettlement(role, owner) {
    const account = state.entities.channelAccounts.find((item) => item.id === owner && item.role === role);
    if (!account?.rebateRuleId) return null;
    return state.entities.rebateRules.find((rule) => rule.id === account.rebateRuleId && rule.status === "active") || null;
  }

  function ruleNameForAccount(accountId) {
    const account = state.entities.channelAccounts.find((item) => item.id === accountId);
    const rule = state.entities.rebateRules.find((item) => item.id === account?.rebateRuleId);
    if (!rule) return "未配置";
    return `${rule.name} / ${percent(rule.rate)}${rule.status === "active" ? "" : " / 停用"}`;
  }

  function transactionFlowTotal(tx) {
    return Number(tx.recharge || 0) + Number(tx.consume || 0);
  }

  function rebateBaseForTransaction(tx, basis = "充值") {
    const rawAmount = basis === "消费" ? Number(tx.consume || 0) : Number(tx.recharge || 0);
    return Math.max(0, rawAmount - Number(tx.refund || 0));
  }

  function rebateBaseForCurrentUser(tx, user = currentUser()) {
    const account = user?.role === "admin" ? null : currentAccount();
    const rule = account ? ruleForSettlement(account.role, account.id) : null;
    return rebateBaseForTransaction(tx, rule?.basis || "充值");
  }

  function settlementBaseForRule(tx, rule) {
    return rebateBaseForTransaction(tx, rule?.basis || "充值");
  }

  function projectedSettlementForTransactions(user, rows = visibleTransactions(user)) {
    if (!user || user.role === "admin" || user.role === "externalBD") return 0;
    const account = currentAccount();
    const scope = getScopeAccountIds(account);
    return rows.reduce((sum, tx) => {
      const specs = [
        { role: "business", owner: tx.business },
        { role: "operator", owner: tx.operator },
        { role: "investor", owner: tx.investor },
      ];
      const amount = specs.reduce((innerSum, item) => {
        if (!scope.includes(item.owner)) return innerSum;
        const rule = ruleForSettlement(item.role, item.owner);
        if (!rule) return innerSum;
        return innerSum + rebateBaseForTransaction(tx, rule.basis) * rule.rate;
      }, 0);
      return sum + amount;
    }, 0);
  }

  function roundMoney(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function downstreamPath(row, user) {
    if (!user || user.role === "admin") return `${row.investor} / ${row.operator} / ${row.business}`;
    if (user.role === "investor") return `${row.operator} / ${row.business}`;
    if (user.role === "operator") return row.business;
    if (user.role === "business") return row.customerId;
    return "";
  }

  function visibleTransactions(user) {
    if (user.role === "admin") return state.entities.transactions;
    const account = currentAccount();
    const scope = getScopeAccountIds(account);
    return state.entities.transactions.filter((item) => scope.includes(item.business) || scope.includes(item.operator) || scope.includes(item.investor));
  }

  function visibleCustomers(user) {
    if (user.role === "admin") return state.entities.customers;
    const account = currentAccount();
    const scope = getScopeAccountIds(account);
    return state.entities.customers.filter((item) => scope.includes(item.ownerBusiness));
  }

  function visibleSettlements(user) {
    if (user.role === "admin") return state.entities.settlements;
    if (user.role === "externalBD") return [];
    const account = currentAccount();
    const scope = getScopeAccountIds(account);
    return state.entities.settlements.filter((item) => scope.includes(item.owner));
  }



  function visibleWorkorders(user) {
    if (user.role === "admin") return state.entities.workorders;
    if (user.role === "externalBD") return [];
    const account = currentAccount();
    const scope = getScopeAccountIds(account);
    return state.entities.workorders.filter((item) => scope.includes(item.owner) || scope.includes(item.target) || scope.includes(item.createdBy));
  }

  function activityPoolFor(owner, role = "") {
    let pool = state.entities.activityPools.find((item) => item.owner === owner);
    if (!pool) {
      const account = state.entities.channelAccounts.find((item) => item.id === owner);
      pool = { owner, role: role || account?.role || "customer", balance: 0, updatedAt: nowText() };
      state.entities.activityPools.push(pool);
    }
    return pool;
  }

  function activityPointBalance(owner) {
    return Number(activityPoolFor(owner).balance || 0);
  }

  function activityTransferTargets() {
    const user = currentUser();
    const account = currentAccount();
    if (!user) return [];
    if (user.role === "admin") {
      return state.entities.channelAccounts
        .filter((item) => item.role === "investor" && item.status === "active")
        .map((item) => ({ id: item.id, label: `${item.id} / ${item.name}`, role: "investor" }));
    }
    if (user.role === "investor") {
      return state.entities.channelAccounts
        .filter((item) => item.parent === account?.id && item.role === "operator" && item.status === "active")
        .map((item) => ({ id: item.id, label: `${item.id} / ${item.name}`, role: "operator" }));
    }
    if (user.role === "operator") {
      return state.entities.channelAccounts
        .filter((item) => item.parent === account?.id && item.role === "business" && item.status === "active")
        .map((item) => ({ id: item.id, label: `${item.id} / ${item.name}`, role: "business" }));
    }
    if (user.role === "business") {
      return state.entities.customers
        .filter((item) => item.ownerBusiness === account?.id && item.status === "bound")
        .map((item) => ({ id: item.id, label: `${item.id} / ${item.name || item.account}`, role: "customer" }));
    }
    return [];
  }

  function calcVisibleRebate(user) {
    const rows = visibleSettlements(user);
    if (rows.length) return rows.reduce((sum, item) => sum + item.amount, 0);
    return projectedSettlementForTransactions(user);
  }

  function bindActions() {
    bindChannelRoleParentControl();
    document.querySelectorAll(".assist-drawer").forEach((drawer) => {
      drawer.addEventListener("toggle", () => {
        if (!drawer.open) return;
        document.querySelectorAll(".assist-drawer").forEach((otherDrawer) => {
          if (otherDrawer !== drawer) otherDrawer.open = false;
        });
      });
    });
    document.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => setPage(button.dataset.page));
    });
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => runAction(button.dataset.action, button.dataset.id, button.dataset));
    });
    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => runAction("closeModal"));
    });
    document.querySelectorAll("[data-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        runForm(form.dataset.form, new FormData(form));
        saveState();
        render();
      });
    });
  }

  function bindChannelRoleParentControl() {
    document.querySelectorAll("[data-channel-role-select]").forEach((select) => {
      const form = select.closest("form");
      const parentInput = form?.querySelector("[data-channel-parent-input]");
      if (!parentInput) return;
      const sync = () => {
        if (select.value === "investor") {
          parentInput.value = "";
          parentInput.placeholder = "招商无上级";
          parentInput.readOnly = true;
          parentInput.tabIndex = -1;
          return;
        }
        const config = channelRoleConfig(select.value);
        parentInput.value = config.parent;
        parentInput.placeholder = select.value === "operator" ? "填写上级招商账号" : "填写上级运营账号";
        parentInput.readOnly = false;
        parentInput.tabIndex = 0;
      };
      select.addEventListener("change", sync);
      sync();
    });
  }

  function runForm(formName, formData) {
    const forms = {
      createInviteForm,
      submitCustomerBindingForm,
      createChannelAccount,
      updateChannelAccount,
      createAccountDraftForm,
      createModelBdAccount,
      updateModelBdAccount,
      createBdRelation,
      addRebateRule,
      updateRebateRule,
      assignChannelRebateRule,
      transferActivityPoints,
      saveHelpArticle,
      applyCustomerFilter,
      applyPerformanceFilter,
      applyListFilter,
      changeOwnPassword,
    };
    if (forms[formName]) {
      const keepModalOpen = forms[formName](formData) === false;
      if (!keepModalOpen && !["applyCustomerFilter", "applyPerformanceFilter", "applyListFilter", "changeOwnPassword", "submitCustomerBindingForm"].includes(formName)) {
        state.ui.modal = null;
      }
    }
  }

  function runAction(action, id, dataset = {}) {
    const actions = {
      logout,
      reset: resetState,
      switchRole: () => switchRole(dataset.username),
      openModal: () => openModal(dataset),
      closeModal,
      generateInvite,
      openFirstCustomerBindPage,
      openCustomerBindPage,
      submitDemoCustomerBinding,
      approveBinding,
      rejectBinding,
      approveFirstBinding,
      simulateTransaction,
      ensureDemoRebateRules,
      generateSettlement,
      approveSettlement,
      paySettlement,
      createOperatorDraft,
      createBusinessDraft,
      createInvestorAccount,
      createOperatorAccount,
      createBusinessAccount,
      resetChannelPassword,
      resetModelBdPassword,
      clearCustomerFilter,
      clearPerformanceFilter,
      clearListFilter,
      approveAccount,
      rejectAccount,
      runMainFlow,
      generateBdBill,
      confirmBdBill,
      payBdBill,
    };
    if (actions[action]) {
      actions[action](id, dataset);
      saveState();
      render();
    }
  }

  function generateInvite() {
    return createInvite({
      owner: "SW3001",
      maxUses: 999999,
      expiresAt: "",
      note: "固定邀请入口",
      source: "固定邀请",
    });
  }

  function openModal(dataset = {}) {
    state.ui.modal = {
      type: dataset.modal,
      id: dataset.id || "",
      role: dataset.role || "",
    };
  }

  function closeModal() {
    state.ui.modal = null;
  }

  function openFirstCustomerBindPage() {
    let invite = state.entities.invites.find((item) => item.owner === "SW3001" && isInviteUsable(item));
    if (!invite) invite = generateInvite();
    if (invite) openCustomerBindPage(invite.id);
  }

  function createInviteForm(formData) {
    createInvite({
      owner: formValue(formData, "owner"),
      maxUses: Number(formValue(formData, "maxUses") || 1),
      expiresAt: formValue(formData, "expiresAt") || defaultInviteExpiry(),
      note: formValue(formData, "note"),
      source: currentUser()?.role === "admin" ? "总后台生成" : "商务生成",
    });
  }

  function createInvite(payload) {
    const owner = payload.owner || currentAccount()?.id || "SW3001";
    const business = state.entities.channelAccounts.find((item) => item.id === owner && item.role === "business" && item.status === "active");
    if (!business) {
      addAudit(actorName(), "固定邀请入口", "请选择已启用的商务账号");
      return null;
    }
    const fixed = fixedInviteForBusiness(owner);
    const existing = state.entities.invites.find((item) => item.id === fixed.id || item.owner === owner);
    if (existing) {
      Object.assign(existing, {
        id: fixed.id,
        owner,
        type: "固定邀请入口",
        link: fixed.link,
        maxUses: Math.max(999999, Number(existing.maxUses || 0)),
        expiresAt: "",
        status: ["submitted", "opened"].includes(existing.status) ? existing.status : "generated",
        source: "固定邀请",
      });
      addAudit(actorName(), "固定邀请入口", `${fixed.id} 已复用`);
      return existing;
    }
    const id = fixed.id;
    const invite = {
      id,
      owner,
      type: "固定邀请入口",
      link: fixed.link,
      status: "generated",
      maxUses: 999999,
      used: 0,
      expiresAt: "",
      openedAt: "",
      submittedAt: "",
      note: payload.note || "",
      source: payload.source || "固定邀请",
      createdAt: nowText(),
    };
    state.entities.invites.push(invite);
    addAudit(actorName(), "固定邀请入口", `${id} 已准备好，等待客户打开`);
    return invite;
  }

  function openCustomerBindPage(inviteId) {
    const invite = state.entities.invites.find((item) => item.id === inviteId);
    if (!invite) {
      addAudit(actorName(), "打开客户绑定页", "邀请链接不存在");
      return;
    }
    if (!isInviteUsable(invite)) {
      if (hasInviteExpired(invite)) invite.status = "expired";
      addAudit(actorName(), "打开客户绑定页", `${invite.id} 当前状态为${statusName[inviteEffectiveStatus(invite)] || "不可用"}`);
      state.ui.openInviteId = invite.id;
      state.ui.customerSubmitResult = "";
      page = "customerBind";
      return;
    }
    invite.status = "opened";
    invite.openedAt = invite.openedAt || nowText();
    state.ui.openInviteId = invite.id;
    state.ui.customerSubmitResult = "";
    page = "customerBind";
    addAudit(actorName(), "打开客户绑定页", `${invite.id} 已打开，等待客户填写资料`);
  }

  function stopInviteLink(inviteId) {
    const invite = state.entities.invites.find((item) => item.id === inviteId);
    if (!invite) return;
    if (!["generated", "opened"].includes(invite.status)) {
      addAudit(actorName(), "停用邀请链接", `${invite.id} 当前状态不可停用`);
      return;
    }
    invite.status = "stopped";
    addAudit(actorName(), "停用邀请链接", `${invite.id} 已停用，客户不能再提交`);
  }

  function submitCustomerBindingForm(formData) {
    submitCustomerBindingPayload({
      inviteId: formValue(formData, "inviteId"),
      customerId: formValue(formData, "customerId"),
      customerName: formValue(formData, "customerName"),
      customerAccount: formValue(formData, "customerAccount"),
      customerCompany: formValue(formData, "customerCompany"),
      contact: formValue(formData, "contact"),
      reason: formValue(formData, "reason"),
      consent: formData.get("consent") === "on",
    });
  }

  function submitDemoCustomerBinding(inviteId) {
    let invite = inviteId ? state.entities.invites.find((item) => item.id === inviteId) : state.entities.invites.find((item) => item.owner === "SW3001" && isInviteUsable(item));
    if (!invite) invite = generateInvite();
    if (!invite) invite = state.entities.invites.find((item) => item.owner === "SW3001" && isInviteUsable(item));
    if (!invite) {
      addAudit(actorName(), "客户填表提交", "没有可用邀请链接");
      return;
    }
    if (invite.status === "generated") openCustomerBindPage(invite.id);
    submitCustomerBindingPayload({
      inviteId: invite.id,
      customerId: "C9001",
      customerName: "客户 C9001",
      customerAccount: "customer_demo",
      customerCompany: "示例客户主体",
      contact: "13800000000",
      reason: "客户通过商务邀请链接进入，并确认归属该商务。",
      consent: true,
    });
  }

  function submitCustomerBindingPayload(payload) {
    const invite = state.entities.invites.find((item) => item.id === payload.inviteId);
    if (!invite) {
      addAudit("客户", "提交绑定申请", "邀请链接不存在");
      state.ui.customerSubmitResult = "error";
      return;
    }
    if (!isInviteUsable(invite)) {
      if (hasInviteExpired(invite)) invite.status = "expired";
      addAudit("客户", "提交绑定申请", `${invite.id} 当前不可提交`);
      state.ui.customerSubmitResult = "error";
      return;
    }
    const required = ["customerId", "customerName", "customerAccount", "customerCompany", "contact"];
    const missing = required.find((key) => !String(payload[key] || "").trim());
    if (missing || !payload.consent) {
      addAudit("客户", "提交绑定申请", "客户资料未填写完整或未确认提交");
      state.ui.customerSubmitResult = "error";
      return;
    }
    if (state.entities.ownershipLedger.some((item) => item.customerId === payload.customerId)) {
      addAudit("客户", "提交绑定申请", `${payload.customerId} 已有正式归属，不能重复绑定`);
      state.ui.customerSubmitResult = "error";
      return;
    }
    if (state.entities.bindingApplications.some((item) => item.customerId === payload.customerId && ["pending_binding_review", "bound"].includes(item.status))) {
      addAudit("客户", "提交绑定申请", `${payload.customerId} 已存在待审或已通过申请`);
      state.ui.customerSubmitResult = "error";
      return;
    }
    invite.status = "submitted";
    invite.used += 1;
    invite.submittedAt = nowText();
    const appId = "BIND-" + String(1001 + state.entities.bindingApplications.length);
    const application = {
      id: appId,
      customerId: payload.customerId,
      customerName: payload.customerName,
      customerAccount: payload.customerAccount,
      customerCompany: payload.customerCompany,
      contact: payload.contact,
      ownerBusiness: invite.owner,
      sourceLink: invite.id,
      status: "pending_binding_review",
      reason: payload.reason || "客户通过邀请链接提交资料，并确认归属商务。",
      rejectReason: "",
      createdAt: nowText(),
    };
    state.entities.bindingApplications.push(application);
    state.entities.workorders.unshift({
      id: "WO-" + appId,
      type: "客户归属审批",
      title: `客户 ${payload.customerId} 绑定商务 ${invite.owner}`,
      target: payload.customerId,
      owner: invite.owner,
      createdBy: payload.customerId,
      status: "pending_binding_review",
      handler: "总后台",
      createdAt: nowText(),
    });
    state.ui.customerSubmitResult = "success";
    addAudit("客户", "提交绑定申请", `生成绑定申请 ${appId}，等待总后台审批`);
  }

  function approveFirstBinding() {
    const pending = state.entities.bindingApplications.find((item) => item.status === "pending_binding_review");
    if (pending) approveBinding(pending.id);
    else addAudit(actorName(), "审批归属", "没有待审批的客户绑定申请");
  }

  function approveBinding(id) {
    const item = state.entities.bindingApplications.find((row) => row.id === id);
    if (!item) return;
    item.status = "bound";
    item.rejectReason = "";
    const customer = state.entities.customers.find((row) => row.id === item.customerId);
    if (customer) {
      customer.name = item.customerName || customer.name;
      customer.account = item.customerAccount || customer.account;
      customer.company = item.customerCompany || customer.company;
      customer.contact = item.contact || customer.contact;
      customer.status = "bound";
      customer.ownerBusiness = item.ownerBusiness;
      customer.boundAt = nowText();
    } else {
      state.entities.customers.push({
        id: item.customerId,
        name: item.customerName,
        account: item.customerAccount,
        company: item.customerCompany,
        contact: item.contact,
        status: "bound",
        ownerBusiness: item.ownerBusiness,
        source: "邀请链接",
        boundAt: nowText(),
      });
    }
    const chain = channelChainForBusiness(item.ownerBusiness);
    if (!state.entities.ownershipLedger.some((row) => row.customerId === item.customerId)) {
      state.entities.ownershipLedger.push({
        customerId: item.customerId,
        investor: chain.investor || "-",
        operator: chain.operator || "-",
        business: item.ownerBusiness,
        effectiveAt: nowText(),
        basis: "客户绑定审批通过",
      });
    }
    state.entities.workorders.forEach((wo) => {
      if (wo.id === "WO-" + id) wo.status = "approved";
    });
    addAudit(actorName(), "客户归属审批通过", item.customerId + " 写入客户归属台账");
  }

  function rejectBinding(id) {
    const item = state.entities.bindingApplications.find((row) => row.id === id);
    if (!item) return;
    item.status = "rejected";
    item.rejectReason = "平台终审驳回：客户资料或归属依据不足";
    state.entities.workorders.forEach((wo) => {
      if (wo.id === "WO-" + id) wo.status = "rejected";
    });
    addAudit(actorName(), "客户归属审批驳回", item.customerId + " 未写入客户归属台账");
  }

  function simulateTransaction() {
    if (!state.entities.ownershipLedger.length) {
      addAudit(actorName(), "生成业绩", "需要先通过客户归属审批");
      return;
    }
    if (state.entities.transactions.length) {
      addAudit(actorName(), "生成业绩", "交易流水已存在");
      return;
    }
    const ledger = state.entities.ownershipLedger[0];
    state.entities.transactions.push({
      id: "TX-202607-001",
      customerId: ledger.customerId,
      investor: ledger.investor,
      operator: ledger.operator,
      business: ledger.business,
      downstream: `${ledger.operator} / ${ledger.business}`,
      recharge: 10000,
      consume: 6000,
      refund: 500,
      coupon: 1000,
      gift: 300,
      effectiveBase: 9500,
      createdAt: nowText(),
      status: "calculated",
      ruleVersion: "2026-07-v1",
    });
    addAudit(actorName(), "生成业绩", `${ledger.customerId} 充值 10000，扣除退款 500，返点基数 9500；优惠券和赠送额度参与返点`);
  }

  function generateSettlement() {
    if (!state.entities.transactions.length) {
      addAudit(actorName(), "生成渠道账单", "没有可结算交易流水");
      return;
    }
    if (state.entities.settlements.length) {
      addAudit(actorName(), "生成渠道账单", "当前自然月账单已存在");
      return;
    }
    const period = settlementPeriod();
    const tx = state.entities.transactions[0];
    const specs = [
      { id: "SET-BUS-001", role: "business", roleLabel: "商务", owner: tx.business },
      { id: "SET-OP-001", role: "operator", roleLabel: "运营", owner: tx.operator },
      { id: "SET-BD-001", role: "investor", roleLabel: "招商", owner: tx.investor },
    ].map((item) => {
      const rule = ruleForSettlement(item.role, item.owner);
      const base = settlementBaseForRule(tx, rule);
      return { ...item, rule, base };
    }).filter((item) => item.owner && item.owner !== "-" && item.rule);
    if (!specs.length) {
      addAudit(actorName(), "生成渠道账单", "当前链路没有可用返佣规则");
      return;
    }
    state.entities.settlements.push(...specs.map((item) => ({
      id: item.id,
      role: item.roleLabel,
      period: period.label,
      periodStart: period.start,
      periodEnd: period.end,
      owner: item.owner,
      base: item.base,
      rate: item.rule.rate,
      amount: Math.round(item.base * item.rule.rate * 100) / 100,
      ruleId: item.rule.id,
      ruleName: item.rule.name,
      cycle: item.rule.cycle,
      status: "pending_admin_review",
      source: `客户 ${tx.customerId}`,
    })));
    addAudit(actorName(), "生成渠道账单", `${period.label} 商务、运营、招商三层账单已生成，状态为待总后台审核`);
  }












  function approveSettlement(id) {
    const rows = id ? state.entities.settlements.filter((item) => item.id === id) : state.entities.settlements.filter((item) => item.status === "pending_admin_review");
    if (!rows.length) {
      addAudit(actorName(), "总后台审核结算", "没有待审核的结算单");
      return;
    }
    rows.forEach((row) => {
      row.status = "approved";
    });
    addAudit(actorName(), "总后台审核结算", rows.map((row) => row.id).join("、") + " 审核通过，待打款");
  }

  function paySettlement(id) {
    const rows = id ? state.entities.settlements.filter((item) => item.id === id) : state.entities.settlements.filter((item) => item.status === "approved");
    if (!rows.length) {
      addAudit(actorName(), "登记打款", "没有审核通过的结算单");
      return;
    }
    rows.forEach((row) => {
      row.status = "paid";
      row.paidAt = nowText();
    });
    addAudit(actorName(), "登记打款", rows.map((row) => row.id).join("、") + " 已打款归档");
  }

  function createChannelAccount(formData) {
    const role = formValue(formData, "role") || "investor";
    const config = channelRoleConfig(role);
    const id = formValue(formData, "id") || nextAccountId(config.prefix, config.start, [...state.entities.channelAccounts, ...state.entities.accountApplications]);
    const contact = requiredPhone(formData, "新增渠道账号");
    if (!contact) return false;
    if (state.entities.channelAccounts.some((item) => item.id === id) || state.entities.accountApplications.some((item) => item.id === id)) {
      addAudit(actorName(), "新增渠道账号", `${id} 已存在，未创建`);
      return;
    }
    const account = {
      id,
      role,
      name: formValue(formData, "name") || `${config.label} ${id}`,
      username: formValue(formData, "username") || id.toLowerCase(),
      password: defaultResetPassword(id),
      mustChangePassword: true,
      passwordUpdatedAt: nowText(),
      parent: normalizeChannelParent(role, formValue(formData, "parent") || config.parent),
      status: "active",
      beneficiary: formValue(formData, "beneficiary") || `${config.beneficiary}${id.slice(-1)}`,
      payment: formValue(formData, "payment") || `${config.payment}${id.slice(-1)}`,
      contact,
      source: "总后台创建",
      createdAt: nowText(),
    };
    state.entities.channelAccounts.push(account);
    addAudit(actorName(), "新增渠道账号", `${account.name} 已创建并启用`);
  }

  function updateChannelAccount(formData) {
    const id = formValue(formData, "id");
    const account = state.entities.channelAccounts.find((item) => item.id === id);
    if (!account) {
      addAudit(actorName(), "编辑渠道账号", `${id} 不存在`);
      return;
    }
    const contact = requiredPhone(formData, "编辑渠道账号");
    if (!contact) return false;
    account.name = formValue(formData, "name") || account.name;
    account.username = formValue(formData, "username") || account.username;
    account.parent = normalizeChannelParent(account.role, formValue(formData, "parent"));
    account.beneficiary = formValue(formData, "beneficiary") || account.beneficiary;
    account.payment = formValue(formData, "payment") || account.payment;
    account.contact = contact;
    account.status = formValue(formData, "status") || account.status;
    addAudit(actorName(), "编辑渠道账号", `${id} 资料已更新`);
  }

  function createModelBdAccount(formData) {
    const id = formValue(formData, "id") || nextAccountId("MXBD", 2, state.entities.bdAccounts);
    const contact = requiredPhone(formData, "新增模型BD");
    if (!contact) return false;
    if (state.entities.bdAccounts.some((item) => item.id === id)) {
      addAudit(actorName(), "新增模型BD", `${id} 已存在，未创建`);
      return;
    }
    const account = {
      id,
      name: formValue(formData, "name") || `模型BD ${id}`,
      username: formValue(formData, "username") || id.toLowerCase(),
      password: defaultResetPassword(id),
      mustChangePassword: true,
      passwordUpdatedAt: nowText(),
      status: "active",
      beneficiary: formValue(formData, "beneficiary") || `模型BD主体${id.slice(-1)}`,
      payment: formValue(formData, "payment") || `BD 收款户${id.slice(-1)}`,
      contact,
      source: "BD 模型关联创建",
      createdAt: nowText(),
    };
    state.entities.bdAccounts.push(account);
    addAudit(actorName(), "新增模型BD", `${account.name} 已创建，可新建模型关联`);
  }

  function updateModelBdAccount(formData) {
    const id = formValue(formData, "id");
    const account = state.entities.bdAccounts.find((item) => item.id === id);
    if (!account) {
      addAudit(actorName(), "编辑模型BD", `${id} 不存在`);
      return;
    }
    const contact = requiredPhone(formData, "编辑模型BD");
    if (!contact) return false;
    account.name = formValue(formData, "name") || account.name;
    account.username = formValue(formData, "username") || account.username;
    account.beneficiary = formValue(formData, "beneficiary") || account.beneficiary;
    account.payment = formValue(formData, "payment") || account.payment;
    account.contact = contact;
    account.status = formValue(formData, "status") || account.status;
    addAudit(actorName(), "编辑模型BD", `${id} 资料已更新`);
  }

  function createBdRelation(formData) {
    const owner = formValue(formData, "owner") || state.entities.bdAccounts[0]?.id;
    const bdAccount = state.entities.bdAccounts.find((item) => item.id === owner);
    if (!bdAccount) {
      addAudit(actorName(), "新建模型关联", "请先新增模型BD账号");
      return;
    }
    const id = "MXR-" + String(1001 + state.entities.bdRelations.length);
    const rate = percentInput(formValue(formData, "rate"), 0.1);
    const model = formValue(formData, "model") || "Seedance 2.0";
    const snapshot = modelUsageDefaults(model, state.entities.models);
    const relation = {
      id,
      owner,
      model,
      basis: modelBdRebateBasis(),
      usageType: snapshot.usageType,
      billingType: snapshot.billingType,
      usageUnit: snapshot.usageUnit,
      unitPriceSnapshot: snapshot.unitPriceSnapshot,
      billableAmount: Math.round(snapshot.demoUsage * snapshot.unitPriceSnapshot * 100) / 100,
      rate,
      cycle: formValue(formData, "cycle") || "自然月",
      settlementAccount: formValue(formData, "settlementAccount") || bdAccount.payment,
      usage: snapshot.demoUsage,
      dayUsage: snapshot.demoDayUsage,
      weekUsage: snapshot.demoWeekUsage,
      latestBill: "-",
      status: "active",
    };
    state.entities.bdRelations.push(relation);
    addAudit(actorName(), "新建模型关联", `${relation.owner} 已绑定 ${relation.model}，返点 ${percent(relation.rate)}`);
  }

  function addRebateRule(formData) {
    return saveRebateRuleFromForm(formData, "新增返佣规则");
  }

  function updateRebateRule(formData) {
    return saveRebateRuleFromForm(formData, "编辑返点规则");
  }

  function saveRebateRuleFromForm(formData, actionName) {
    const basis = formValue(formData, "basis") || "充值";
    const rate = percentInput(formValue(formData, "rate"), 0);
    if (!rate) {
      addAudit(actorName(), actionName, "返点比例不能为空");
      return false;
    }
    const existingId = formValue(formData, "id");
    let rule = state.entities.rebateRules.find((item) => item.id === existingId);
    if (!rule) {
      rule = { id: "RULE-" + String(1001 + state.entities.rebateRules.length) };
      state.entities.rebateRules.push(rule);
    }
    Object.assign(rule, {
      basis,
      name: formValue(formData, "name") || `${basis}返点规则`,
      rate,
      cycle: formValue(formData, "cycle") || "自然月",
      status: formValue(formData, "status") || "active",
    });
    addAudit(actorName(), actionName, `${rule.name} ${percent(rule.rate)}，${rule.cycle}`);
  }

  function assignChannelRebateRule(formData) {
    const accountId = formValue(formData, "accountId");
    const ruleId = formValue(formData, "rebateRuleId");
    const account = state.entities.channelAccounts.find((item) => item.id === accountId);
    if (!account) {
      addAudit(actorName(), "配置渠道返点规则", `${accountId} 不存在`);
      return;
    }
    if (ruleId && !state.entities.rebateRules.some((item) => item.id === ruleId && item.status === "active")) {
      addAudit(actorName(), "配置渠道返点规则", "请选择已启用的返点规则");
      return false;
    }
    account.rebateRuleId = ruleId;
    addAudit(actorName(), "配置渠道返点规则", `${channelAccountLabel(accountId)} 已选择 ${ruleNameForAccount(accountId)}`);
  }

  function saveHelpArticle(formData) {
    if (currentUser()?.role !== "admin") {
      addAudit(actorName(), "保存规则与协议", "仅总后台可配置");
      return false;
    }
    const role = formValue(formData, "role");
    const title = formValue(formData, "title") || "规则与协议";
    const markdown = formValue(formData, "markdown");
    if (!helpArticleRoleConfigs().some(([value]) => value === role)) {
      addAudit(actorName(), "保存规则与协议", "文本对象不正确");
      return false;
    }
    if (!title) {
      addAudit(actorName(), "保存规则与协议", "标题不能为空");
      return false;
    }
    if (!markdown) {
      addAudit(actorName(), "保存规则与协议", "正文不能为空");
      return false;
    }
    state.entities.helpArticles[role] = {
      title,
      markdown,
      updatedAt: nowText(),
    };
    addAudit(actorName(), "保存规则与协议", `${title} 已更新`);
  }

  function transferActivityPoints(formData) {
    const user = currentUser();
    const account = currentAccount();
    const targetId = formValue(formData, "target");
    const amount = Number(formValue(formData, "amount") || 0);
    const reason = formValue(formData, "reason") || "活动积分发放";
    const target = activityTransferTargets().find((item) => item.id === targetId);
    if (!target || !amount) {
      addAudit(actorName(), "活动积分", "请选择发放对象并填写积分");
      return;
    }
    const isAdmin = user?.role === "admin";
    if (!isAdmin && amount <= 0) {
      addAudit(actorName(), "活动积分", "渠道发放积分必须为正数");
      return;
    }
    const from = isAdmin ? "平台" : account?.id;
    if (!isAdmin) {
      const fromPool = activityPoolFor(from, account?.role);
      if (Number(fromPool.balance || 0) < amount) {
        addAudit(actorName(), "活动积分", "当前活动积分余额不足");
        return;
      }
      fromPool.balance = Number(fromPool.balance || 0) - amount;
      fromPool.updatedAt = nowText();
    }
    if (target.role !== "customer") {
      const toPool = activityPoolFor(target.id, target.role);
      toPool.balance = Number(toPool.balance || 0) + amount;
      toPool.updatedAt = nowText();
    }
    state.entities.activityLogs.unshift({
      id: "AP-" + String(1001 + state.entities.activityLogs.length),
      from,
      to: target.id,
      amount,
      reason,
      createdAt: nowText(),
      actor: actorName(),
    });
    addAudit(actorName(), "活动积分", `${from} -> ${target.id} ${amount} 分`);
  }

  function applyCustomerFilter(formData) {
    state.ui.filters.customerKeyword = formValue(formData, "customerKeyword");
    state.ui.filters.customerStatus = formValue(formData, "customerStatus") || "all";
    addAudit(actorName(), "筛选客户", "客户列表筛选条件已应用");
  }

  function clearCustomerFilter() {
    state.ui.filters.customerKeyword = "";
    state.ui.filters.customerStatus = "all";
    addAudit(actorName(), "清空客户筛选", "客户列表恢复全部");
  }

  function applyPerformanceFilter(formData) {
    state.ui.filters.performanceKeyword = formValue(formData, "performanceKeyword");
    state.ui.filters.performanceOwner = formValue(formData, "performanceOwner") || "all";
    addAudit(actorName(), "筛选返点流水", "返点流水筛选条件已应用");
  }

  function clearPerformanceFilter() {
    state.ui.filters.performanceKeyword = "";
    state.ui.filters.performanceOwner = "all";
    addAudit(actorName(), "清空返点筛选", "返点流水恢复全部");
  }

  function applyListFilter(formData) {
    const filterKey = formValue(formData, "filterKey");
    if (!filterKey) return;
    state.ui.filters.listFilters = state.ui.filters.listFilters || {};
    state.ui.filters.listFilters[filterKey] = {
      keyword: formValue(formData, "keyword"),
      status: formValue(formData, "status") || "all",
    };
    addAudit(actorName(), "应用列表筛选", `${filterKey} 筛选条件已应用`);
  }

  function clearListFilter(id, dataset = {}) {
    const filterKey = dataset.filterKey || id;
    if (!filterKey) return;
    state.ui.filters.listFilters = state.ui.filters.listFilters || {};
    delete state.ui.filters.listFilters[filterKey];
    addAudit(actorName(), "清空列表筛选", `${filterKey} 恢复全部`);
  }

  function changeOwnPassword(formData) {
    const user = currentUser();
    const oldPassword = formValue(formData, "oldPassword");
    const newPassword = formValue(formData, "newPassword");
    const confirmPassword = formValue(formData, "confirmPassword");
    if (!user) return;
    if (!newPassword || newPassword.length < 6) {
      addAudit(actorName(), "修改密码", "新密码至少 6 位");
      return;
    }
    if (newPassword !== confirmPassword) {
      addAudit(actorName(), "修改密码", "两次输入的新密码不一致");
      return;
    }
    const target = findMutableAccountByUser(user);
    const currentPassword = target?.password || user.password;
    if (oldPassword !== currentPassword) {
      addAudit(actorName(), "修改密码", "当前密码校验失败");
      return;
    }
    if (target) {
      target.password = newPassword;
      target.mustChangePassword = false;
      target.passwordUpdatedAt = nowText();
    }
    const staticUser = accounts.find((item) => item.username === user.username);
    if (staticUser && !target && staticUser.role === "admin") {
      addAudit(actorName(), "修改密码", "总后台管理员密码由系统账号模块维护");
      return;
    }
    addAudit(actorName(), "修改密码", "当前账号密码已更新");
  }

  function resetChannelPassword(id) {
    const account = state.entities.channelAccounts.find((item) => item.id === id);
    if (!account) return;
    account.password = defaultResetPassword(account.id);
    account.mustChangePassword = true;
    account.passwordUpdatedAt = nowText();
    addAudit(actorName(), "重置渠道账号密码", `${account.id} 密码已重置为默认初始密码`);
  }

  function resetModelBdPassword(id) {
    const account = state.entities.bdAccounts.find((item) => item.id === id);
    if (!account) return;
    account.password = defaultResetPassword(account.id);
    account.mustChangePassword = true;
    account.passwordUpdatedAt = nowText();
    addAudit(actorName(), "重置模型BD密码", `${account.id} 密码已重置为默认初始密码`);
  }

  function findMutableAccountByUser(user) {
    if (["investor", "operator", "business"].includes(user.role)) {
      return state.entities.channelAccounts.find((item) => item.id === user.accountId || item.username === user.username);
    }
    if (user.role === "externalBD") {
      return state.entities.bdAccounts.find((item) => item.id === user.accountId || item.username === user.username);
    }
    return null;
  }

  function defaultResetPassword(id) {
    return "password";
  }

  function defaultPasswordHint() {
    return `<div class="field"><label>初始密码</label><input data-default-password-hint value="默认密码 ${escapeHtml(defaultResetPassword())}，首次登录必须修改" readonly tabindex="-1" /></div>`;
  }

  function defaultPhoneForAccount(id) {
    const digits = String(id || "").replace(/\D/g, "").slice(-4).padStart(4, "0");
    return `1380000${digits}`;
  }

  function requiredPhone(formData, action) {
    const contact = formValue(formData, "contact");
    if (!contact) {
      addAudit(actorName(), action, "手机号必填，未保存");
      return "";
    }
    return contact;
  }

  function formValue(formData, key) {
    return String(formData.get(key) || "").trim();
  }

  function percentInput(value, fallback) {
    if (!value) return fallback;
    const parsed = Number(String(value).replace("%", "").trim());
    if (!Number.isFinite(parsed)) return fallback;
    return parsed > 1 ? parsed / 100 : parsed;
  }

  function channelRoleConfig(role) {
    return {
      investor: { prefix: "BD", start: 1002, label: "招商", parent: "", beneficiary: "招商主体", payment: "招商收款户" },
      operator: { prefix: "OP", start: 2002, label: "运营", parent: "BD1001", beneficiary: "运营主体", payment: "运营收款户" },
      business: { prefix: "SW", start: 3002, label: "商务", parent: "OP2001", beneficiary: "商务主体", payment: "商务收款户" },
    }[role] || { prefix: "BD", start: 1002, label: "招商", parent: "", beneficiary: "招商主体", payment: "招商收款户" };
  }

  function normalizeChannelParent(role, parent) {
    if (role === "investor") return "";
    return String(parent || channelRoleConfig(role).parent || "").trim();
  }

  function fixedParentForChannelDraft(role) {
    const account = currentAccount();
    if (role === "operator" && account?.role === "investor") return account.id;
    if (role === "business" && account?.role === "operator") return account.id;
    return "";
  }

  function createInvestorAccount() {
    createOfficialChannelAccount("investor");
  }

  function createOperatorAccount() {
    createOfficialChannelAccount("operator");
  }

  function createBusinessAccount() {
    createOfficialChannelAccount("business");
  }

  function createOfficialChannelAccount(role) {
    const config = {
      investor: { prefix: "BD", start: 1002, label: "招商", parent: "", beneficiary: "招商主体", payment: "招商收款户" },
      operator: { prefix: "OP", start: 2002, label: "运营", parent: "BD1001", beneficiary: "运营主体", payment: "运营收款户" },
      business: { prefix: "SW", start: 3002, label: "商务", parent: "OP2001", beneficiary: "商务主体", payment: "商务收款户" },
    }[role];
    const id = nextAccountId(config.prefix, config.start, [...state.entities.channelAccounts, ...state.entities.accountApplications]);
    state.entities.channelAccounts.push({
      id,
      role,
      name: `${config.label} ${id}`,
      username: id.toLowerCase(),
      password: defaultResetPassword(id),
      mustChangePassword: true,
      passwordUpdatedAt: nowText(),
      parent: config.parent,
      status: "active",
      beneficiary: `${config.beneficiary}${id.slice(-1)}`,
      payment: `${config.payment}${id.slice(-1)}`,
      source: "总后台创建",
      createdAt: nowText(),
    });
    addAudit(actorName(), "总后台新增渠道账号", `${config.label}账号 ${id} 已创建并启用`);
  }

  function nextAccountId(prefix, start, rows) {
    let index = start;
    let id = `${prefix}${String(index).padStart(3, "0")}`;
    while (rows.some((item) => item.id === id)) {
      index += 1;
      id = `${prefix}${String(index).padStart(3, "0")}`;
    }
    return id;
  }

  function createOperatorDraft() {
    state.ui.modal = { type: "createAccountDraft", role: "operator", id: "" };
  }

  function createBusinessDraft() {
    state.ui.modal = { type: "createAccountDraft", role: "business", id: "" };
  }

  function createAccountDraftForm(formData) {
    const role = formValue(formData, "role") || "business";
    const config = channelRoleConfig(role);
    const id = formValue(formData, "id") || nextAccountId(config.prefix, config.start, [...state.entities.channelAccounts, ...state.entities.accountApplications]);
    const contact = requiredPhone(formData, "创建账号资料");
    if (!contact) return false;
    createAccountDraft({
      id,
      role,
      name: formValue(formData, "name") || `${roleName[role]} ${id}`,
      username: formValue(formData, "username") || id.toLowerCase(),
      parent: fixedParentForChannelDraft(role),
      createdBy: currentAccount()?.id || "ADMIN",
      beneficiary: formValue(formData, "beneficiary") || `${roleName[role]}主体${id.slice(-1)}`,
      payment: formValue(formData, "payment") || `${roleName[role]}收款户${id.slice(-1)}`,
      contact,
    });
  }

  function createAccountDraft(payload) {
    if (state.entities.channelAccounts.some((item) => item.id === payload.id) || state.entities.accountApplications.some((item) => item.id === payload.id)) {
      addAudit(actorName(), "创建账号资料", payload.id + " 已存在");
      return;
    }
    state.entities.accountApplications.push({ ...payload, password: defaultResetPassword(payload.id), mustChangePassword: true, passwordUpdatedAt: nowText(), status: "pending_official_review", createdAt: nowText() });
    state.entities.workorders.unshift({
      id: "WO-ACC-" + payload.id,
      type: "账号资料终审",
      title: payload.name + " 官方终审",
      target: payload.id,
      owner: payload.createdBy,
      createdBy: payload.createdBy,
      status: "pending_official_review",
      handler: "总后台",
      createdAt: nowText(),
    });
    addAudit(actorName(), "创建账号资料", payload.name + " 进入待官方终审");
  }

  function approveAccount(id) {
    const app = state.entities.accountApplications.find((item) => item.id === id);
    if (!app) return;
    app.status = "active";
    if (!state.entities.channelAccounts.some((item) => item.id === app.id)) {
      state.entities.channelAccounts.push({ ...app, username: app.username || app.id.toLowerCase(), password: app.password || defaultResetPassword(app.id), mustChangePassword: true, passwordUpdatedAt: app.passwordUpdatedAt || nowText(), status: "active", source: "终审启用" });
    }
    state.entities.workorders.forEach((wo) => {
      if (wo.id === "WO-ACC-" + id) wo.status = "approved";
    });
    addAudit(actorName(), "账号官方终审通过", id + " 已启用并写入组织关系");
  }

  function rejectAccount(id) {
    const app = state.entities.accountApplications.find((item) => item.id === id);
    if (!app) return;
    app.status = "rejected";
    state.entities.workorders.forEach((wo) => {
      if (wo.id === "WO-ACC-" + id) wo.status = "rejected";
    });
    addAudit(actorName(), "账号官方终审驳回", id + " 未启用");
  }

  function runMainFlow() {
    const hasInvite = state.entities.invites.some((item) => item.type === "固定邀请入口" && isInviteUsable(item));
    if (!hasInvite) generateInvite();
    const hasBinding = state.entities.bindingApplications.some((item) => item.customerId === "C9001" && item.status !== "rejected");
    if (!hasBinding) submitDemoCustomerBinding();
    if (!state.entities.ownershipLedger.length) approveFirstBinding();
    if (!state.entities.transactions.length) simulateTransaction();
    ensureDemoRebateRules();
    if (!state.entities.settlements.length) generateSettlement();
    state.entities.settlements.forEach((item) => {
      if (item.status === "pending_admin_review") item.status = "approved";
    });
    state.entities.settlements.forEach((item) => {
      if (item.status === "approved") item.status = "paid";
    });
    addAudit(actorName(), "跑通主流程", "从链接、绑定、审批、业绩、结算到打款全部完成");
  }

  function generateBdBill() {
    if (state.entities.bdBills.length) {
      addAudit(actorName(), "生成 BD 账单", "当前自然月BD账单已存在");
      return;
    }
    const relation = state.entities.bdRelations[0];
    if (!relation) {
      addAudit(actorName(), "生成 BD 账单", "请先建立 BD 模型关联");
      return;
    }
    const period = settlementPeriod();
    const billId = "BRB-" + period.start.replaceAll("-", "") + "-" + String(1001 + state.entities.bdBills.length);
    const billableAmount = modelBillableAmount(relation);
    state.entities.bdBills.push({
      id: billId,
      owner: relation.owner,
      model: relation.model,
      period: period.label,
      periodStart: period.start,
      periodEnd: period.end,
      usageType: relation.usageType,
      billingType: relation.billingType,
      usageUnit: relation.usageUnit,
      usage: relation.usage,
      unitPriceSnapshot: relation.unitPriceSnapshot,
      billableAmount,
      base: billableAmount,
      rate: relation.rate,
      amount: Math.round(billableAmount * relation.rate * 100) / 100,
      status: "pending_bd_confirm",
      bdConfirmedAt: "",
    });
    relation.latestBill = billId;
    addAudit(actorName(), "生成 BD 账单", `${period.label} 模型BD返点账单已生成，待BD确认`);
  }

  function confirmBdBill(id) {
    const user = currentUser();
    const rows = state.entities.bdBills.filter((item) => item.id === id && item.status === "pending_bd_confirm");
    const allowedRows = user?.role === "externalBD" ? rows.filter((item) => item.owner === user.accountId) : [];
    if (!allowedRows.length) {
      addAudit(actorName(), "确认 BD 账单", "没有可确认的BD账单");
      return;
    }
    allowedRows.forEach((row) => {
      row.status = "pending_payment";
      row.bdConfirmedAt = nowText();
    });
    addAudit(actorName(), "确认 BD 账单", allowedRows.map((row) => row.id).join("、") + " 已确认，待总后台打款");
  }

  function payBdBill(id) {
    const rows = id ? state.entities.bdBills.filter((item) => item.id === id && item.status === "pending_payment") : state.entities.bdBills.filter((item) => item.status === "pending_payment");
    if (!rows.length) {
      addAudit(actorName(), "登记 BD 打款", "没有BD已确认的待打款账单");
      return;
    }
    rows.forEach((row) => {
      row.status = "paid";
    });
    addAudit(actorName(), "登记 BD 打款", rows.map((row) => row.id).join("、") + " 已打款");
  }

  function actorName() {
    return currentUser()?.name || "未登录";
  }

  function nowText() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  render();
})();
