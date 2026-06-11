"use client";

import { useEffect, useMemo, useState } from "react";

type Step =
  | "home"
  | "basic"
  | "interest"
  | "skills"
  | "prefs"
  | "generate"
  | "report"
  | "ops"
  | "feedback"
  | "admin";

type Basic = {
  school: string;
  major: string;
  grade: string;
  degree: string;
  goal: string;
  city: string;
};

type SkillInfo = {
  skillTags: string[];
  project: string;
  aiUsage: string;
  selfDesc: string;
};

type Prefs = {
  industries: string[];
  roles: string[];
  types: string[];
  workStyle: string;
};

type AppState = {
  step: Step;
  basic: Basic;
  answers: Record<string, number>;
  interestTags: string[];
  skills: SkillInfo;
  prefs: Prefs;
  report: any;
  recs: any[];
  feedbacks: any[];
};

const STORAGE_KEY = "zhihang_ai_career_mvp";

const emptyState: AppState = {
  step: "home",
  basic: {
    school: "",
    major: "",
    grade: "",
    degree: "",
    goal: "",
    city: "",
  },
  answers: {},
  interestTags: [],
  skills: {
    skillTags: [],
    project: "",
    aiUsage: "",
    selfDesc: "",
  },
  prefs: {
    industries: [],
    roles: [],
    types: [],
    workStyle: "",
  },
  report: null,
  recs: [],
  feedbacks: [],
};

const grades = ["大一", "大二", "大三", "大四", "研一", "研二", "研三", "已毕业"];
const degrees = ["本科", "硕士", "博士", "其他"];
const goals = ["找实习", "找全职", "升学", "探索方向", "暂不确定"];

const questions = [
  ["Q1", "我喜欢从大量信息中找出规律和结论。", "分析探索"],
  ["Q2", "面对复杂问题，我会先拆解它的结构。", "分析探索"],
  ["Q3", "我喜欢把想法用文字、图片或视频表达出来。", "创造表达"],
  ["Q4", "我愿意为活动、产品或项目设计传播方案。", "创造表达"],
  ["Q5", "我在团队中愿意承担沟通和协调角色。", "人际协作"],
  ["Q6", "我愿意倾听别人的需求并帮助他们解决问题。", "人际协作"],
  ["Q7", "我喜欢制定计划、推进进度并检查结果。", "组织管理"],
  ["Q8", "如果项目混乱，我会想办法建立流程和规则。", "组织管理"],
  ["Q9", "我愿意学习工具或代码，把想法做成可用的东西。", "技术实践"],
  ["Q10", "我对 AI 工具、自动化工具或数据工具有兴趣。", "技术实践"],
  ["Q11", "我希望工作能对教育、医疗、公共服务或社会议题产生价值。", "社会服务"],
  ["Q12", "我愿意参与有公共价值或社会影响力的项目。", "社会服务"],
];

const skillOptions = [
  "Python",
  "数据分析",
  "产品设计",
  "新媒体运营",
  "市场调研",
  "Java",
  "SQL",
  "机器学习",
  "办公软件",
  "演讲表达",
  "项目管理",
  "用户研究",
  "PPT",
  "AI工具",
];

const industryOptions = [
  "AI/互联网",
  "金融",
  "制造",
  "教育",
  "医疗",
  "咨询",
  "传媒",
  "政务",
  "暂不确定",
];

const roleOptions = [
  "产品",
  "运营",
  "数据",
  "算法",
  "开发",
  "市场",
  "职能",
  "研究",
  "暂不确定",
];

const typeOptions = ["实习", "全职", "科研项目", "比赛", "训练营", "志愿服务"];

const opportunities = [
  {
    title: "AI产品实习生",
    type: "实习",
    org: "科技创新企业",
    tags: ["AI工具", "产品设计", "用户研究"],
    desc: "适合对 AI 应用、用户需求和产品原型感兴趣的学生。",
  },
  {
    title: "数据分析训练项目",
    type: "训练营",
    org: "高校就业能力提升项目",
    tags: ["数据分析", "SQL", "Python"],
    desc: "适合想补强数据能力、了解数据岗位基础流程的学生。",
  },
  {
    title: "校园新媒体增长项目",
    type: "科研项目",
    org: "校园创新实践中心",
    tags: ["新媒体运营", "创造表达", "演讲表达"],
    desc: "适合希望积累内容、活动和用户增长经验的学生。",
  },
  {
    title: "智能体应用挑战赛",
    type: "比赛",
    org: "AI应用创新平台",
    tags: ["AI工具", "项目管理", "技术实践"],
    desc: "适合希望通过比赛验证 AI 应用想法和项目协作能力的学生。",
  },
  {
    title: "高校就业数据分析助理",
    type: "科研项目",
    org: "高校就业指导中心",
    tags: ["社会服务", "数据分析", "办公软件"],
    desc: "适合关注教育、就业指导和公共服务场景的学生。",
  },
];

function toggle(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function Button({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
      >
        <option value="">请选择</option>
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function Tags({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => {
          const active = values.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(toggle(values, item))}
              className={
                active
                  ? "rounded-full bg-blue-700 px-3 py-2 text-sm text-white"
                  : "rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              }
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Notice() {
  return (
    <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
      本工具仅用于职业探索参考，不构成就业承诺、心理诊断或唯一决策依据。请不要填写身份证、电话等敏感信息。
    </div>
  );
}

export default function Page() {
  const [state, setState] = useState<AppState>(emptyState);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function go(step: Step) {
    setError("");
    setState((s) => ({ ...s, step }));
  }

  function calcInterestTags() {
    const scores: Record<string, number> = {};
    questions.forEach(([id, , dim]) => {
      scores[dim] = (scores[dim] || 0) + (state.answers[id] || 0);
    });

    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
  }

  function makeReport() {
    const tags = state.interestTags.length ? state.interestTags.join("、") : "当前信息有限";
    const skills = state.skills.skillTags.length ? state.skills.skillTags.join("、") : "待补充";

    const report = {
      title: "个性化职业导航报告",
      profile: `你目前就读于 ${state.basic.school || "高校"}，专业为 ${
        state.basic.major || "未填写"
      }，当前目标是 ${state.basic.goal || "暂不确定"}。从已填写信息看，可以优先围绕 ${tags} 相关方向进行职业探索。`,
      strength: `你已展现出与 ${skills} 相关的基础能力线索。建议后续通过项目、训练营、比赛或实习把已有能力转化为可展示的作品和经历。`,
      directions: [
        {
          name: "AI应用 / 数据分析方向",
          reason: "适合希望结合工具、数据和实际问题解决的学生。",
          action: "先完成一个小型数据分析或 AI 工具应用作品。",
        },
        {
          name: "产品策划 / 用户研究方向",
          reason: "适合希望连接用户需求、业务问题和解决方案的学生。",
          action: "拆解一个常用 App，输出一页用户需求和改进建议。",
        },
        {
          name: "内容运营 / 校园项目方向",
          reason: "适合希望通过表达、协作和项目执行积累经验的学生。",
          action: "参与一次校园活动或社群运营，并完成复盘记录。",
        },
      ],
      gaps: [
        "岗位认知还需要具体化：建议查看 3 个真实岗位 JD，记录高频技能要求。",
        "经历表达还需要结构化：建议用“背景-任务-行动-结果”整理 1-2 段经历。",
      ],
      plan: [
        "第1周：整理课程、项目、社团、比赛或实习经历。",
        "第2周：选择 2-3 个感兴趣方向，查看真实岗位要求。",
        "第3周：完成一个小作品，例如数据分析报告、产品拆解或活动复盘。",
        "第4周：优化简历中的一段经历，并向老师或学长学姐获取反馈。",
      ],
      resume: `具备 ${skills} 等基础能力，关注 ${tags} 相关方向，正在通过项目实践持续探索职业发展路径。`,
      risk: "本报告基于用户填写信息与 Mock 规则生成，仅供职业探索参考，不构成就业承诺、心理诊断或唯一决策依据。",
    };

    const userTags = [
      ...state.interestTags,
      ...state.skills.skillTags,
      ...state.prefs.roles,
      ...state.prefs.industries,
    ];

    const recs = opportunities
      .map((op) => {
        let score = 40;
        if (state.prefs.types.includes(op.type)) score += 20;
        op.tags.forEach((tag) => {
          if (userTags.includes(tag)) score += 15;
        });
        return {
          ...op,
          score: Math.min(score, 100),
          reason:
            "该机会与你填写的兴趣、技能或机会类型偏好有一定关联，适合作为初步探索选择。",
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setState((s) => ({
      ...s,
      report,
      recs,
      step: "report",
    }));
  }

  const title = useMemo(() => {
    const map: Record<Step, string> = {
      home: "智航AI生涯规划助手",
      basic: "基础信息填写",
      interest: "职业兴趣测评",
      skills: "技能与经历评估",
      prefs: "职业偏好设置",
      generate: "正在生成报告",
      report: "职业导航报告",
      ops: "个性化机会推荐",
      feedback: "用户反馈",
      admin: "简易后台",
    };
    return map[state.step];
  }, [state.step]);

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          智航AI生涯规划助手 · Mock MVP
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900">{title}</h1>

        {state.step === "home" && (
          <section className="card space-y-5 p-6">
            <p className="text-sm leading-7 text-slate-600">
              用 5-8 分钟获得你的第一份职业导航报告，帮助你快速梳理自己、看到初步方向，并获得可执行的下一步建议。
            </p>

            <div className="grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>了解自己</b>
                <p className="mt-1 text-sm text-slate-600">整理专业、兴趣、技能和经历。</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>看到方向</b>
                <p className="mt-1 text-sm text-slate-600">生成适合优先探索的职业方向。</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <b>获得行动</b>
                <p className="mt-1 text-sm text-slate-600">推荐 3-5 个岗位、项目、训练营或比赛机会。</p>
              </div>
            </div>

            <Button onClick={() => go("basic")}>开始测评</Button>
            <GhostButton onClick={() => go("admin")}>查看本地后台</GhostButton>
            <Notice />
          </section>
        )}

        {state.step === "basic" && (
          <section className="card space-y-4 p-5">
            <p className="text-sm text-slate-600">信息仅用于生成职业导航报告。</p>

            <Input
              label="学校"
              value={state.basic.school}
              onChange={(v) => setState((s) => ({ ...s, basic: { ...s.basic, school: v } }))}
            />
            <Input
              label="专业"
              value={state.basic.major}
              onChange={(v) => setState((s) => ({ ...s, basic: { ...s.basic, major: v } }))}
            />
            <Select
              label="年级"
              value={state.basic.grade}
              options={grades}
              onChange={(v) => setState((s) => ({ ...s, basic: { ...s.basic, grade: v } }))}
            />
            <Select
              label="学历"
              value={state.basic.degree}
              options={degrees}
              onChange={(v) => setState((s) => ({ ...s, basic: { ...s.basic, degree: v } }))}
            />
            <Select
              label="当前目标"
              value={state.basic.goal}
              options={goals}
              onChange={(v) => setState((s) => ({ ...s, basic: { ...s.basic, goal: v } }))}
            />
            <Input
              label="目标城市，可选"
              value={state.basic.city}
              onChange={(v) => setState((s) => ({ ...s, basic: { ...s.basic, city: v } }))}
              placeholder="例如：上海、杭州、远程"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              onClick={() => {
                if (!state.basic.school || !state.basic.major || !state.basic.grade || !state.basic.degree || !state.basic.goal) {
                  setError("请先填写学校、专业、年级、学历和当前目标。");
                  return;
                }
                go("interest");
              }}
            >
              下一步：职业兴趣测评
            </Button>
          </section>
        )}

        {state.step === "interest" && (
          <section className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              这不是心理诊断，只用于生成职业探索标签。
            </p>

            {questions.map(([id, text]) => (
              <div key={id} className="card p-4">
                <p className="text-sm font-medium leading-6">
                  {id}. {text}
                </p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          answers: { ...s.answers, [id]: num },
                        }))
                      }
                      className={
                        state.answers[id] === num
                          ? "rounded-xl bg-blue-700 px-2 py-2 text-xs text-white"
                          : "rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600"
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              onClick={() => {
                if (questions.some(([id]) => !state.answers[id])) {
                  setError("请完成所有题目。");
                  return;
                }
                const tags = calcInterestTags();
                setState((s) => ({ ...s, interestTags: tags, step: "skills" }));
                setError("");
              }}
            >
              下一步：技能与经历
            </Button>
          </section>
        )}

        {state.step === "skills" && (
          <section className="card space-y-5 p-5">
            <Tags
              label="技能标签，至少选择 1 个"
              options={skillOptions}
              values={state.skills.skillTags}
              onChange={(v) => setState((s) => ({ ...s, skills: { ...s.skills, skillTags: v } }))}
            />

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">项目经历，可选</span>
              <textarea
                value={state.skills.project}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    skills: { ...s.skills, project: e.target.value },
                  }))
                }
                className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                placeholder="可填写课程项目、比赛、社团、实习或科研经历。"
              />
            </label>

            <Select
              label="AI工具使用情况"
              value={state.skills.aiUsage}
              options={["未使用", "偶尔使用", "经常使用", "能用于项目"]}
              onChange={(v) => setState((s) => ({ ...s, skills: { ...s.skills, aiUsage: v } }))}
            />

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">自我评价，可选</span>
              <textarea
                value={state.skills.selfDesc}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    skills: { ...s.skills, selfDesc: e.target.value },
                  }))
                }
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              onClick={() => {
                if (state.skills.skillTags.length === 0) {
                  setError("请至少选择一个技能标签。");
                  return;
                }
                go("prefs");
              }}
            >
              下一步：职业偏好
            </Button>
          </section>
        )}

        {state.step === "prefs" && (
          <section className="card space-y-5 p-5">
            <Tags
              label="偏好行业"
              options={industryOptions}
              values={state.prefs.industries}
              onChange={(v) => setState((s) => ({ ...s, prefs: { ...s.prefs, industries: v } }))}
            />

            <Tags
              label="偏好岗位"
              options={roleOptions}
              values={state.prefs.roles}
              onChange={(v) => setState((s) => ({ ...s, prefs: { ...s.prefs, roles: v } }))}
            />

            <Tags
              label="机会类型，至少选择 1 个"
              options={typeOptions}
              values={state.prefs.types}
              onChange={(v) => setState((s) => ({ ...s, prefs: { ...s.prefs, types: v } }))}
            />

            <Select
              label="工作偏好"
              value={state.prefs.workStyle}
              options={["稳定规范", "挑战成长", "自由探索", "团队协作", "暂不确定"]}
              onChange={(v) => setState((s) => ({ ...s, prefs: { ...s.prefs, workStyle: v } }))}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              onClick={() => {
                if (state.prefs.types.length === 0) {
                  setError("请至少选择一种机会类型。");
                  return;
                }
                go("generate");
                setTimeout(() => {
                  makeReport();
                }, 1200);
              }}
            >
              生成职业导航报告
            </Button>
          </section>
        )}

        {state.step === "generate" && (
          <section className="card p-6 text-center">
            <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-full bg-blue-100" />
            <p className="text-sm leading-7 text-slate-600">
              正在整理你的基础信息、兴趣标签、技能经历和职业偏好。
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Mock 版不会调用真实 AI，也不会产生费用。
            </p>
          </section>
        )}

        {state.step === "report" && state.report && (
          <section className="space-y-4">
            <div className="card p-5">
              <h2 className="font-semibold">个人画像摘要</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{state.report.profile}</p>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold">个人优势简述</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{state.report.strength}</p>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold">可以优先探索的职业方向</h2>
              <div className="mt-3 space-y-3">
                {state.report.directions.map((item: any) => (
                  <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
                    <b>{item.name}</b>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.reason}</p>
                    <p className="mt-2 text-sm text-blue-700">第一步：{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold">能力短板与补强建议</h2>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                {state.report.gaps.map((item: string) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold">30天行动计划</h2>
              <ol className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                {state.report.plan.map((item: string, index: number) => (
                  <li key={item}>
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="card p-5">
              <h2 className="font-semibold">可用于简历/自我介绍的一句话</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{state.report.resume}</p>
            </div>

            <Notice />

            <Button onClick={() => go("ops")}>查看推荐机会</Button>
            <GhostButton onClick={() => go("feedback")}>提交反馈</GhostButton>
          </section>
        )}

        {state.step === "ops" && (
          <section className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              以下推荐基于你填写的信息进行初步匹配，不代表录取或结果承诺。
            </p>

            {state.recs.map((item) => (
              <div key={item.title} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.type} · {item.org}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.score}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{item.desc}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-sm text-blue-700">推荐理由：{item.reason}</p>
              </div>
            ))}

            <Button onClick={() => go("feedback")}>提交反馈</Button>
            <GhostButton onClick={() => go("report")}>返回报告</GhostButton>
          </section>
        )}

        {state.step === "feedback" && (
          <section className="card space-y-5 p-5">
            <p className="text-sm text-slate-600">请简单评价这份报告是否有帮助。</p>

            <Tags
              label="满意度"
              options={["1分", "2分", "3分", "4分", "5分"]}
              values={state.feedbacks[0]?.rating ? [state.feedbacks[0].rating] : []}
              onChange={(v) => {
                const rating = v[v.length - 1] || "";
                setState((s) => ({
                  ...s,
                  feedbacks: [{ ...(s.feedbacks[0] || {}), rating }],
                }));
              }}
            />

            <Select
              label="是否有帮助"
              value={state.feedbacks[0]?.helpful || ""}
              options={["是", "一般", "否"]}
              onChange={(v) =>
                setState((s) => ({
                  ...s,
                  feedbacks: [{ ...(s.feedbacks[0] || {}), helpful: v }],
                }))
              }
            />

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">其他建议</span>
              <textarea
                value={state.feedbacks[0]?.comment || ""}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    feedbacks: [{ ...(s.feedbacks[0] || {}), comment: e.target.value }],
                  }))
                }
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <Button
              onClick={() => {
                alert("反馈已保存到本地浏览器。");
                go("admin");
              }}
            >
              提交反馈
            </Button>
          </section>
        )}

        {state.step === "admin" && (
          <section className="space-y-4">
            <div className="card p-5">
              <h2 className="font-semibold">本地数据后台</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mock 版数据只保存在当前浏览器 localStorage 中。后续接 Supabase 后，才会保存到云端数据库。
              </p>
            </div>

            <pre className="card max-h-[500px] overflow-auto p-4 text-xs leading-5">
              {JSON.stringify(state, null, 2)}
            </pre>

            <Button onClick={() => go("home")}>返回首页</Button>

            <GhostButton
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setState(emptyState);
              }}
            >
              清空本地数据
            </GhostButton>
          </section>
        )}
      </div>
    </main>
  );
}