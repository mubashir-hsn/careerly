import { existsSync } from "node:fs";
import puppeteer from "puppeteer";

const getBrowserExecutablePath = () => {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  for (const candidate of candidates) {
    try {
      if (process.platform === "win32" && existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // Fall back to Puppeteer's default resolution if fs access fails.
    }
  }

  return undefined;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const withProtocol = (url = "") => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const renderLinks = (contactInfo = {}, activeStyle = "ats") => {
  const links = [
    contactInfo.email && { label: contactInfo.email, href: `mailto:${contactInfo.email}` },
    contactInfo.mobile && { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` },
    contactInfo.linkedin && { label: activeStyle === "executive" ? "LinkedIn" : activeStyle === "ats" ? "LinkedIn" : "LinkedIn", href: withProtocol(contactInfo.linkedin) },
    contactInfo.twitter && { label: "Twitter", href: withProtocol(contactInfo.twitter) },
    contactInfo.portfolio && { label: activeStyle === "modern" ? "Portfolio Website" : "Portfolio", href: withProtocol(contactInfo.portfolio) },
  ].filter(Boolean);

  const separator = activeStyle === 'academic' ? '•' : '|';

  return links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}" style="color: inherit; text-decoration: none;">${escapeHtml(link.label)}</a>`,
    )
    .join(`<span style="opacity:.5; margin: 0 8px;">${separator}</span>`);
};

const renderExperience = (experience = [], accent = "#4f46e5") =>
  experience
    .map(
      (exp) => `
        <div style="margin-bottom: 16px;">
          <div style="display:flex; justify-content:space-between; gap:12px; font-weight:700; color:#111827;">
            <span>${escapeHtml(exp?.organization)}</span>
            <span style="color:${accent}; font-size:12px;">${escapeHtml(exp?.startDate)} - ${escapeHtml(exp?.endDate)}</span>
          </div>
          <div style="margin:4px 0 6px; font-style:italic; color:#4b5563;">${escapeHtml(exp?.title)}</div>
          <div style="white-space:pre-wrap; line-height:1.55;">${escapeHtml(exp?.description)}</div>
        </div>
      `,
    )
    .join("");

const renderEducation = (education = [], accent = "#4f46e5") =>
  education
    .map(
      (edu) => `
        <div style="margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; gap:12px; font-weight:700; color:#111827;">
            <span>${escapeHtml(edu?.organization)}</span>
            <span style="color:${accent}; font-size:12px;">${escapeHtml(edu?.startDate)} - ${escapeHtml(edu?.endDate)}</span>
          </div>
          <div style="margin-top:4px; font-style:italic; color:#4b5563;">${escapeHtml(edu?.title)}</div>
        </div>
      `,
    )
    .join("");

const renderProjects = (projects = [], accent = "#4f46e5") =>
  projects
    .map((project) => {
      const projectLinks = [
        project?.githubLink && {
          label: "GitHub",
          href: withProtocol(project.githubLink),
        },
        project?.liveLink && {
          label: "Live Demo",
          href: withProtocol(project.liveLink),
        },
      ]
        .filter(Boolean)
        .map(
          (link) =>
            `<a href="${escapeHtml(link.href)}" style="color:${accent}; text-decoration:none; font-size:11px; font-weight:700;">${escapeHtml(link.label)}</a>`,
        )
        .join('<span style="opacity:.45;">|</span>');

      return `
        <div style="margin-bottom: 14px;">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; font-weight:700; color:#111827;">
            <span>${escapeHtml(project?.title)}</span>
            <span style="display:flex; gap:8px; flex-wrap:wrap;">${projectLinks}</span>
          </div>
          <div style="margin-top:4px; white-space:pre-wrap; line-height:1.55;">${escapeHtml(project?.description)}</div>
        </div>
      `;
    })
    .join("");

const resumeThemeByStyle = {
  ats: {
    accent: "#111827",
    headerBorder: "#111827",
    headingFont: "Arial, Helvetica, sans-serif",
    bodyFont: "Arial, Helvetica, sans-serif",
    titleTransform: "none",
    sectionRule: "#111827",
    chipsBg: "#f3f4f6",
    chipsFg: "#111827",
  },
  academic: {
    accent: "#4f46e5",
    headerBorder: "#cbd5e1",
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "Arial, Helvetica, sans-serif",
    titleTransform: "uppercase",
    sectionRule: "#cbd5e1",
    chipsBg: "#ffffff",
    chipsFg: "#334155",
  },
  corporate: {
    accent: "#4f46e5",
    headerBorder: "#4f46e5",
    headingFont: "Arial, Helvetica, sans-serif",
    bodyFont: "Arial, Helvetica, sans-serif",
    titleTransform: "uppercase",
    sectionRule: "#e2e8f0",
    chipsBg: "#1e293b",
    chipsFg: "#ffffff",
  },
  executive: {
    accent: "#a16207",
    headerBorder: "#f4f4f5",
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "Georgia, 'Times New Roman', serif",
    titleTransform: "none",
    sectionRule: "#d4d4d8",
    chipsBg: "#ffffff",
    chipsFg: "#3f3f46",
  },
  modern: {
    accent: "#4f46e5",
    sidebarBg: "#0f172a",
    headingFont: "Arial, Helvetica, sans-serif",
    bodyFont: "Arial, Helvetica, sans-serif",
  },
};

const renderResumeHtml = ({ data = {}, activeStyle = "ats" }) => {
  const { contactInfo = {}, summary, experience, education, projects, skills } = data;
  const theme = resumeThemeByStyle[activeStyle] || resumeThemeByStyle.ats;
  const skillItems = normalizeList(skills);

  if (activeStyle === "modern") {
    const firstName = contactInfo?.name?.split(" ")[0] || "";
    const lastName = contactInfo?.name?.split(" ").slice(1).join(" ") || "";

    return `
      <div style="background:#ffffff; min-height:297mm; display:flex; color:#334155; font-family:${theme.bodyFont};">
        <!-- Sidebar -->
        <div style="width:32%; background:${theme.sidebarBg}; color:#ffffff; padding:35px 20px; display:flex; flex-direction:column; gap:30px; border-right:1px solid #1e293b;">
          <div>
            <h2 style="font-size:11px; font-weight:900; color:#818cf8; text-transform:uppercase; letter-spacing:.25em; margin-bottom:15px;">Contact</h2>
            <div style="display:flex; flex-direction:column; gap:12px; font-size:11px;">
              ${contactInfo?.email ? `
                <div style="display:flex; flex-direction:column;">
                    <span style="color:#64748b; font-weight:900; text-transform:uppercase; font-size:8px; letter-spacing:.05em;">Email</span>
                    <a href="mailto:${escapeHtml(contactInfo.email)}" style="color:#e2e8f0; font-weight:600; text-decoration:none;">${escapeHtml(contactInfo.email)}</a>
                </div>` : ""}
              ${contactInfo?.mobile ? `
                <div style="display:flex; flex-direction:column;">
                    <span style="color:#64748b; font-weight:900; text-transform:uppercase; font-size:8px; letter-spacing:.05em;">Phone</span>
                    <a href="tel:${escapeHtml(contactInfo.mobile)}" style="color:#e2e8f0; font-weight:600; text-decoration:none;">${escapeHtml(contactInfo.mobile)}</a>
                </div>` : ""}
              ${contactInfo?.linkedin ? `
                <div style="display:flex; flex-direction:column;">
                    <span style="color:#64748b; font-weight:900; text-transform:uppercase; font-size:8px; letter-spacing:.05em;">LinkedIn</span>
                    <a href="${withProtocol(contactInfo.linkedin)}" style="color:#e2e8f0; font-weight:600; text-decoration:none;">linkedin.com/in</a>
                </div>` : ""}
              ${contactInfo?.portfolio ? `
                <div style="display:flex; flex-direction:column;">
                    <span style="color:#64748b; font-weight:900; text-transform:uppercase; font-size:8px; letter-spacing:.05em;">Portfolio</span>
                    <a href="${withProtocol(contactInfo.portfolio)}" style="color:#e2e8f0; font-weight:600; text-decoration:none;">Portfolio Website</a>
                </div>` : ""}
            </div>
          </div>

          <div>
            <h2 style="font-size:11px; font-weight:900; color:#818cf8; text-transform:uppercase; letter-spacing:.25em; margin-bottom:15px;">Education</h2>
            ${education?.map(edu => `
              <div style="margin-bottom:15px;">
                <div style="font-size:12px; font-weight:800; color:#ffffff; line-height:1.2; font-style:italic;">${escapeHtml(edu?.organization)}</div>
                <div style="font-size:10px; color:#94a3b8; font-weight:600; margin-top:3px;">${escapeHtml(edu?.title)}</div>
                <div style="font-size:9px; color:#818cf8; font-weight:900; margin-top:4px;">
                  ${escapeHtml(edu?.startDate)} - ${escapeHtml(edu?.endDate)}
                </div>
              </div>
            `).join("")}
          </div>

          <div>
            <h2 style="font-size:11px; font-weight:900; color:#818cf8; text-transform:uppercase; letter-spacing:.25em; margin-bottom:15px;">Expertise</h2>
            <div style="display:flex; flex-wrap:wrap; gap:5px;">
              ${skillItems.map(skill => `<span style="padding:3px 6px; background:rgba(255,255,255,0.05); border:1px solid #1e293b; color:#cbd5e1; font-size:9px; font-weight:800; border-radius:4px; text-transform:uppercase;">${escapeHtml(skill)}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div style="flex:1; padding:35px 40px; background:#ffffff;">
          <header style="margin-bottom:30px;">
            <h1 style="font-size:34px; font-weight:900; color:#0f172a; margin:0; text-transform:uppercase; letter-spacing:-0.03em; line-height:1;">
              ${escapeHtml(firstName)} <span style="color:${theme.accent};">${escapeHtml(lastName)}</span>
            </h1>
            <div style="font-size:15px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:.2em; margin-top:8px;">
              ${escapeHtml(contactInfo?.profession)}
            </div>
          </header>

          ${summary ? `
            <section style="margin-bottom:25px;">
              <h2 style="display:flex; align-items:center; gap:12px; font-size:15px; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:.15em; margin-bottom:12px;">
                Profile <span style="height:1px; flex:1; background:#f1f5f9;"></span>
              </h2>
              <p style="font-size:12.5px; line-height:1.6; color:#475569; text-align:justify; margin:0;">${escapeHtml(summary)}</p>
            </section>
          ` : ""}

          <section style="margin-bottom:25px;">
            <h2 style="display:flex; align-items:center; gap:12px; font-size:15px; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:.15em; margin-bottom:15px;">
              Experience <span style="height:1px; flex:1; background:#f1f5f9;"></span>
            </h2>
            <div style="display:flex; flex-direction:column; gap:20px;">
              ${experience?.map(exp => `
                <div style="position:relative; padding-left:20px; border-left:1px solid #f1f5f9;">
                  <div style="position:absolute; left:-4px; top:6px; width:7px; height:7px; background:${theme.accent}; border-radius:50%;"></div>
                  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                    <h3 style="font-size:14px; font-weight:900; color:#1e293b; margin:0; text-transform:uppercase; letter-spacing:-0.02em;">${escapeHtml(exp?.title)}</h3>
                    <span style="font-size:10px; font-weight:900; color:${theme.accent}; text-transform:uppercase; background:#f0f4ff; padding:1px 8px; border-radius:12px;">${escapeHtml(exp?.startDate)} - ${escapeHtml(exp?.endDate)}</span>
                  </div>
                  <div style="font-size:12px; font-weight:800; color:#64748b; margin-bottom:6px;">${escapeHtml(exp?.organization)}</div>
                  <div style="font-size:12.5px; line-height:1.55; color:#475569;">${escapeHtml(exp?.description)}</div>
                </div>
              `).join("")}
            </div>
          </section>

          <section>
            <h2 style="display:flex; align-items:center; gap:12px; font-size:15px; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:.15em; margin-bottom:15px;">
              Projects <span style="height:1px; flex:1; background:#f1f5f9;"></span>
            </h2>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${projects?.map(proj => `
                <div style="padding:12px; background:#fbfcfe; border:1px solid #f1f5f9; border-radius:10px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <h3 style="font-size:13.5px; font-weight:900; color:#1e293b; margin:0; text-transform:uppercase; letter-spacing:-0.02em;">${escapeHtml(proj?.title)}</h3>
                    <div style="display:flex; gap:12px; font-size:10px; font-weight:900; color:${theme.accent}; text-transform:uppercase;">
                      ${proj?.githubLink ? `<a href="${withProtocol(proj.githubLink)}" style="color:inherit; text-decoration:none;">GitHub</a>` : ""}
                      ${proj?.liveLink ? `<a href="${withProtocol(proj.liveLink)}" style="color:inherit; text-decoration:none;">Live</a>` : ""}
                    </div>
                  </div>
                  <div style="font-size:12px; color:#64748b; line-height:1.5;">${escapeHtml(proj?.description)}</div>
                </div>
              `).join("")}
            </div>
          </section>
        </div>
      </div>
        </div>
      </div>
    `;
  }

  const renderSection = (title, content, marginTop = "18px") => {
    if (!content) return "";
    return `
      <section style="margin-top: ${marginTop};">
        <h2 style="margin:0 0 10px; padding-bottom:6px; font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:${activeStyle === "ats" ? ".12em" : ".12em"}; color:#111827; border-bottom:2px solid ${theme.sectionRule}; font-family:${theme.headingFont};">
          ${escapeHtml(title)}
        </h2>
        ${content}
      </section>
    `;
  };

  // --- STYLE-SPECIFIC RENDERING ---

  if (activeStyle === "ats") {
    return `
      <div style="background:#ffffff; min-height:297mm; padding:45px 55px; color:#374151; font-family:${theme.bodyFont}; font-size:10pt; line-height:1.4;">
        <header style="margin-bottom:20px;">
          <h1 style="margin:0; font-size:26px; font-weight:700; color:#111827; tracking-tight;">${escapeHtml(contactInfo?.name)}</h1>
          <div style="font-size:11px; color:#4b5563; margin-top:4px; font-weight:500; border-top:1px solid #f3f4f6; padding-top:8px; text-transform:uppercase;">
            ${renderLinks(contactInfo, "ats")}
          </div>
        </header>

        ${summary ? `
          <section style="margin-bottom:16px;">
            <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; uppercase tracking-widest;">Summary</h2>
            <p style="font-size:10.5pt; line-height:1.6; margin:0;">${escapeHtml(summary)}</p>
          </section>
        ` : ""}

        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; uppercase tracking-widest;">Experience</h2>
          ${experience?.map(exp => `
            <div style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; font-weight:700; color:#111827;">
                <span style="font-size:11pt;">${escapeHtml(exp?.organization)}</span>
                <span style="font-size:10pt; font-weight:500;">${escapeHtml(exp?.startDate)} — ${escapeHtml(exp?.endDate)}</span>
              </div>
              <div style="font-style:italic; font-weight:500; color:#4b5563; margin-bottom:4px;">${escapeHtml(exp?.title)}</div>
              <p style="font-size:10.5pt; margin:0;">${escapeHtml(exp?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; uppercase tracking-widest;">Projects</h2>
          ${projects?.map(proj => `
            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; font-weight:700; color:#111827;">
                <span>${escapeHtml(proj?.title)}</span>
                <div style="display:flex; gap:12px; font-size:9px;">
                  ${proj?.githubLink ? `<a href="${withProtocol(proj.githubLink)}" style="text-decoration:underline;">GitHub</a>` : ""}
                  ${proj?.liveLink ? `<a href="${withProtocol(proj.liveLink)}" style="text-decoration:underline;">Live Demo</a>` : ""}
                </div>
              </div>
              <p style="font-size:10.5pt; margin:0;">${escapeHtml(proj?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; uppercase tracking-widest;">Education</h2>
          ${education?.map(edu => `
            <div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; font-weight:700; color:#111827;">
                <span>${escapeHtml(edu?.organization)}</span>
                <span style="font-size:10pt; font-weight:500;">${escapeHtml(edu?.startDate)} — ${escapeHtml(edu?.endDate)}</span>
              </div>
              <div style="color:#4b5563; font-style:italic;">${escapeHtml(edu?.title)}</div>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; uppercase tracking-widest;">Skills</h2>
          <p style="font-size:10.5pt; font-weight:500; tracking-tight; margin:0;">${skillItems.join(' • ')}</p>
        </section>
      </div>
    `;
  }

  if (activeStyle === "academic") {
    return `
      <div style="background:#ffffff; min-height:297mm; padding:35px 45px; color:#334155; font-family:${theme.bodyFont}; font-size:10.5pt;">
        <header style="text-align:center; margin-bottom:16px;">
          <h1 style="font-family:${theme.headingFont}; font-size:24px; font-weight:600; text-decoration:underline; text-underline-offset:6px; margin:0 0 4px; uppercase text-transform:uppercase; color:#0f172a;">${escapeHtml(contactInfo?.name)}</h1>
          <p style="font-family:${theme.headingFont}; font-size:14px; font-style:italic; color:#000000; margin:0 0 6px;">${escapeHtml(contactInfo?.profession)}</p>
          <div style="font-size:10px; font-weight:500; display:flex; justify-content:center; flex-wrap:wrap; text-transform:uppercase; color:#000000;">
            ${renderLinks(contactInfo, "academic")}
          </div>
        </header>

        ${summary ? `
          <section style="margin-bottom:8px;">
            <h2 style="font-family:${theme.headingFont}; font-size:15px; font-weight:700; border-bottom:1.5px solid #cbd5e1; margin:16px 0 8px; padding-bottom:2px; text-transform:uppercase; color:#0f172a;">Profile Summary</h2>
            <p style="text-align:justify; font-size:12.5px; color:#475569; margin:0;">${escapeHtml(summary)}</p>
          </section>
        ` : ""}

        <section style="margin-bottom:8px;">
          <h2 style="font-family:${theme.headingFont}; font-size:15px; font-weight:700; border-bottom:1.5px solid #cbd5e1; margin:16px 0 8px; padding-bottom:2px; text-transform:uppercase; color:#0f172a;">Education</h2>
          ${education?.map(edu => `
            <div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; font-weight:600; color:#1e293b;">
                <span style="font-size:13.5px;">${escapeHtml(edu?.organization)}</span>
                <span style="color:#4f46e5; font-size:10px;">${escapeHtml(edu?.startDate)} – ${escapeHtml(edu?.endDate)}</span>
              </div>
              <div style="color:#64748b; font-style:italic; font-size:12px;">${escapeHtml(edu?.title)}</div>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:8px;">
          <h2 style="font-family:${theme.headingFont}; font-size:15px; font-weight:700; border-bottom:1.5px solid #cbd5e1; margin:16px 0 8px; padding-bottom:2px; text-transform:uppercase; color:#0f172a;">Experience</h2>
          ${experience?.map(exp => `
            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; font-weight:600; color:#1e293b;">
                <span style="font-size:13.5px;">${escapeHtml(exp?.organization)}</span>
                <span style="font-size:9px; background:#f0f4ff; color:#4f46e5; padding:2px 6px; border-radius:4px;">${escapeHtml(exp?.startDate)} – ${escapeHtml(exp?.endDate)}</span>
              </div>
              <div style="color:#4f46e5; text-transform:uppercase; font-size:10px; font-weight:700; margin-bottom:4px; letter-spacing:0.05em;">${escapeHtml(exp?.title)}</div>
              <p style="font-size:12.5px; border-left:2px solid #e2e8f0; padding-left:12px; text-align:justify; margin:0;">${escapeHtml(exp?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:8px;">
          <h2 style="font-family:${theme.headingFont}; font-size:15px; font-weight:700; border-bottom:1.5px solid #cbd5e1; margin:16px 0 8px; padding-bottom:2px; text-transform:uppercase; color:#0f172a;">Projects</h2>
          ${projects?.map(proj => `
            <div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-weight:600; color:#1e293b;">${escapeHtml(proj?.title)}</span>
                <div style="display:flex; gap:8px; font-size:9px; font-weight:700; color:#4f46e5;">
                  ${proj?.githubLink ? `<a href="${withProtocol(proj.githubLink)}" style="text-decoration:none;">GitHub</a>` : ""}
                  ${proj?.liveLink ? `<a href="${withProtocol(proj.liveLink)}" style="text-decoration:none;">Live</a>` : ""}
                </div>
              </div>
              <p style="font-size:12px; color:#475569; font-style:italic; margin:0;">${escapeHtml(proj?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:12px;">
          <h2 style="font-family:${theme.headingFont}; font-size:15px; font-weight:700; border-bottom:1.5px solid #cbd5e1; margin:16px 0 8px; padding-bottom:2px; text-transform:uppercase; color:#0f172a;">Skills</h2>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${skillItems.map(skill => `
              <span style="padding:4px 10px; border-radius:8px; font-size:10px; border:1px solid #e2e8f0; font-weight:600; text-transform:uppercase; color:#334155;">${escapeHtml(skill)}</span>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  if (activeStyle === "corporate") {
    return `
      <div style="background:#ffffff; min-height:297mm; padding:35px 45px; color:#334155; font-family:${theme.bodyFont}; font-size:10.5pt;">
        <header style="border-left:8px solid #4f46e5; padding-left:20px; margin-bottom:24px;">
          <h1 style="font-size:24px; font-weight:900; text-transform:uppercase; tracking-tighter; color:#0f172a; margin:0;">${escapeHtml(contactInfo?.name)}</h1>
          <p style="font-size:14px; font-weight:700; color:#4f46e5; text-transform:uppercase; margin:0 0 8px;">${escapeHtml(contactInfo?.profession)}</p>
          <div style="font-size:10px; font-weight:700; text-transform:uppercase; color:#64748b;">
            ${renderLinks(contactInfo, "corporate")}
          </div>
        </header>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:15px; font-weight:900; margin:16px 0 8px; padding-bottom:4px; text-transform:uppercase; color:#1e293b; border-bottom:2px solid #e2e8f0;">Experience</h2>
          ${experience?.map(exp => `
            <div style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-size:13.5px; font-weight:700; color:#0f172a; text-decoration:underline; text-decoration-color:#cbd5e1; text-underline-offset:4px;">${escapeHtml(exp?.organization)}</span>
                <span style="font-size:9px; font-weight:700; color:#4f46e5; text-transform:uppercase;">${escapeHtml(exp?.startDate)} – ${escapeHtml(exp?.endDate)}</span>
              </div>
              <div style="color:#64748b; font-size:10px; font-weight:700; text-transform:uppercase; font-style:italic; margin:4px 0;">${escapeHtml(exp?.title)}</div>
              <p style="font-size:12.5px; border-left:2px solid #f1f5f9; padding-left:12px; margin:0;">${escapeHtml(exp?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:15px; font-weight:900; margin:16px 0 8px; padding-bottom:4px; text-transform:uppercase; color:#1e293b; border-bottom:2px solid #e2e8f0;">Projects</h2>
          ${projects?.map(proj => `
            <div style="margin-bottom:12px; border-left:2px solid #4f46e5; padding-left:12px;">
              <div style="display:flex; justify-content:space-between; font-weight:700; color:#1e293b; font-size:13.5px;">
                <span>${escapeHtml(proj?.title)}</span>
                <div style="display:flex; gap:8px; font-size:9px; text-transform:uppercase;">
                  ${proj?.githubLink ? `<a href="${withProtocol(proj.githubLink)}" style="color:#4f46e5; text-decoration:none;">GitHub</a>` : ""}
                  ${proj?.liveLink ? `<a href="${withProtocol(proj.liveLink)}" style="color:#4f46e5; text-decoration:none;">Live</a>` : ""}
                </div>
              </div>
              <p style="font-size:12.5px; margin:4px 0 0;">${escapeHtml(proj?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:15px; font-weight:900; margin:16px 0 8px; padding-bottom:4px; text-transform:uppercase; color:#1e293b; border-bottom:2px solid #e2e8f0;">Education</h2>
          ${education?.map(edu => `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <div>
                <div style="font-weight:700; color:#1e293b;">${escapeHtml(edu?.organization)}</div>
                <div style="font-size:12px; font-style:italic;">${escapeHtml(edu?.title)}</div>
              </div>
              <div style="font-size:10px; font-weight:700; color:#4f46e5; text-transform:uppercase;">${escapeHtml(edu?.startDate)} – ${escapeHtml(edu?.endDate)}</div>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <h2 style="font-size:15px; font-weight:900; margin:16px 0 8px; padding-bottom:4px; text-transform:uppercase; color:#1e293b; border-bottom:2px solid #e2e8f0;">Skills</h2>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${skillItems.map(skill => `
              <span style="padding:4px 10px; font-size:10px; background:#1e293b; font-weight:700; color:#ffffff; text-transform:uppercase;">${escapeHtml(skill)}</span>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  if (activeStyle === "executive") {
    return `
      <div style="background:#ffffff; min-height:297mm; padding:35px 45px; color:#3f3f46; font-family:${theme.bodyFont}; font-size:10.5pt;">
        <header style="text-align:center; margin-bottom:32px;">
          <h1 style="font-size:28px; font-weight:300; tracking-tight; color:#18181b; margin:0 0 4px;">${escapeHtml(contactInfo?.name)}</h1>
          <div style="font-family:${theme.bodyFont}; font-size:11px; text-transform:uppercase; letter-spacing:0.3em; color:#a1a1aa; margin-bottom:12px;">${escapeHtml(contactInfo?.profession)}</div>
          <div style="display:flex; justify-content:center; gap:8px; font-size:10px; color:#71717a; border-top:1px solid #f4f4f5; border-bottom:1px solid #f4f4f5; padding:8px 0; text-transform:uppercase;">
            ${renderLinks(contactInfo, "executive")}
          </div>
        </header>

        <section style="margin-bottom:16px;">
          <div style="display:flex; align-items:center; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; font-size:15px; color:#334155; margin:24px 0 16px; text-align:center;">
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-right:16px;"></div>
            History
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-left:16px;"></div>
          </div>
          ${experience?.map(exp => `
            <div style="margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:4px;">
                <div style="font-size:14px; font-weight:700; color:#18181b;">${escapeHtml(exp?.title)}</div>
                <div style="font-family:${theme.bodyFont}; font-size:10px; font-weight:700; color:#a16207; letter-spacing:0.1em;">${escapeHtml(exp?.startDate)} — ${escapeHtml(exp?.endDate)}</div>
              </div>
              <div style="font-size:12px; color:#71717a; font-weight:600; text-transform:uppercase; margin-bottom:8px;">${escapeHtml(exp?.organization)}</div>
              <p style="font-size:12.5px; text-align:justify; line-height:1.6; margin:0;">${escapeHtml(exp?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <div style="display:flex; align-items:center; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; font-size:15px; color:#334155; margin:24px 0 16px; text-align:center;">
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-right:16px;"></div>
            Key Projects
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-left:16px;"></div>
          </div>
          ${projects?.map(proj => `
            <div style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-weight:700; color:#18181b; font-style:italic;">${escapeHtml(proj?.title)}</span>
                <div style="display:flex; gap:12px; font-size:9px; font-weight:700; color:#a16207; text-transform:uppercase;">
                  ${proj?.githubLink ? `<a href="${withProtocol(proj.githubLink)}" style="text-decoration:none;">Repo</a>` : ""}
                  ${proj?.liveLink ? `<a href="${withProtocol(proj.liveLink)}" style="text-decoration:none;">Live</a>` : ""}
                </div>
              </div>
              <p style="font-size:12px; font-style:italic; border-right:2px solid #f4f4f5; padding-right:16px; text-align:right; margin:0;">${escapeHtml(proj?.description)}</p>
            </div>
          `).join("")}
        </section>

        <section style="margin-bottom:16px;">
          <div style="display:flex; align-items:center; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; font-size:15px; color:#334155; margin:24px 0 16px; text-align:center;">
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-right:16px;"></div>
            Education
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-left:16px;"></div>
          </div>
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;">
            ${education?.map(edu => `
              <div style="border-left:1px solid #d4d4d8; padding-left:16px;">
                <div style="font-weight:700; color:#18181b; font-size:13px;">${escapeHtml(edu?.organization)}</div>
                <div style="font-size:11px; font-style:italic; color:#a16207;">${escapeHtml(edu?.title)}</div>
                <div style="font-size:9px; font-weight:700; color:#a1a1aa; margin-top:4px;">${escapeHtml(edu?.startDate)} — ${escapeHtml(edu?.endDate)}</div>
              </div>
            `).join("")}
          </div>
        </section>

        <section style="margin-bottom:16px;">
          <div style="display:flex; align-items:center; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; font-size:15px; color:#334155; margin:24px 0 16px; text-align:center;">
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-right:16px;"></div>
            Expertise
            <div style="flex:1; border-bottom:1px solid #d4d4d8; margin-left:16px;"></div>
          </div>
          <div style="text-align:center; font-size:11.5px; text-transform:uppercase; letter-spacing:0.15em; line-height:2;">
            ${skillItems.map((skill, index) => `
              <span>${escapeHtml(skill)}${index < skillItems.length - 1 ? ' <span style="color:#d4d4d8; margin:0 8px;">/</span>' : ""}</span>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  const skillMarkup = ``; // Fallback for other styles (though we've handled them above)

  return ``; // Final fallback (we've handled everything above)
};

const renderCoverLetterHtml = ({ data = {} }) => {
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
    <div style="background:#ffffff; min-height:297mm; padding:48px 62px; color:#334155; font-family:Arial, Helvetica, sans-serif; border-top:8px solid #1e293b;">
      <header style="display:flex; justify-content:space-between; gap:20px; align-items:flex-start; margin-bottom:32px; padding-bottom:18px; border-bottom:1px solid #cbd5e1;">
        <div>
          <h1 style="margin:0; font-size:30px; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:-0.04em; line-height:1;">
            ${escapeHtml(data?.name)}
          </h1>
          ${data?.jobTitle
      ? `<div style="margin-top:10px; font-size:13px; font-weight:800; color:#4f46e5; text-transform:uppercase; letter-spacing:.18em;">
                  ${escapeHtml(data.jobTitle)}
                </div>`
      : ""
    }
        </div>
        <div style="text-align:right; font-size:11px; line-height:1.5; color:#64748b;">
          ${data?.email ? `<div style="font-weight:700; color:#0f172a;">${escapeHtml(data.email)}</div>` : ""}
          ${data?.contact ? `<div style="font-weight:700; color:#0f172a;">${escapeHtml(data.contact)}</div>` : ""}
        </div>
      </header>

      <div style="margin-bottom:28px;">
        <div style="margin-bottom:18px; font-size:12.5px; font-weight:700; color:#1e293b;">${escapeHtml(today)}</div>
        <div style="font-size:12.5px; line-height:1.5;">
          <div style="margin-bottom:4px; font-size:10px; font-weight:900; letter-spacing:.18em; text-transform:uppercase; color:#64748b;">To</div>
          <div style="font-size:15px; font-weight:700; color:#0f172a;">Hiring Manager</div>
          <div style="color:#475569;">${escapeHtml(data?.companyName || "[Target Company Name]")}</div>
        </div>
      </div>

      <div style="margin-bottom:24px; padding:12px 14px; background:#f8fafc; border-left:4px solid #1e293b;">
        <div style="font-size:13.5px; font-weight:800; color:#0f172a;">
          RE: Application for ${escapeHtml(data?.jobTitle || "the Position")}
        </div>
      </div>

      <div style="font-size:13px; line-height:1.75; color:#334155;">
        <div style="margin-bottom:14px; font-weight:700; color:#0f172a;">Dear Hiring Manager,</div>
        <div style="white-space:pre-wrap; text-align:justify;">
          ${escapeHtml(data?.content || "Please provide cover letter content.")}
        </div>
      </div>

      <div style="margin-top:42px;">
        <div style="margin-bottom:8px; color:#64748b;">Sincerely,</div>
        <div style="font-family:Georgia, 'Times New Roman', serif; font-style:italic; font-size:26px; color:#1e293b; margin-bottom:8px;">
          ${escapeHtml(data?.name)}
        </div>
        <div style="width:150px; height:1.5px; background:#1e293b; opacity:.2; margin-bottom:12px;"></div>
        <div style="font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:.16em; color:#0f172a;">
          ${escapeHtml(data?.name)}
        </div>
        ${data?.jobTitle
      ? `<div style="font-size:11px; font-weight:700; text-transform:uppercase; color:#64748b; margin-top:4px;">
                ${escapeHtml(data.jobTitle)}
              </div>`
      : ""
    }
      </div>
    </div>
  `;
};

export async function POST(req) {
  let browser;

  try {
    const body = await req.json();
    const { user, activeStyle, data } = body || {};

    browser = await puppeteer.launch({
      headless: true,
      executablePath: getBrowserExecutablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const safeName =
      activeStyle === "letter"
        ? data?.name || "Cover_Letter"
        : data?.contactInfo?.name || user?.fullName || "Resume";

    const fileName =
      activeStyle === "letter"
        ? `${safeName.replace(/\s+/g, "_")}_Cover_Letter.pdf`
        : `${safeName.replace(/\s+/g, "_")}_Resume.pdf`;

    const contentHtml =
      activeStyle === "letter"
        ? renderCoverLetterHtml({ data })
        : renderResumeHtml({ data, activeStyle });

    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            @page { size: A4; margin: 0; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #ffffff;
              color: #111827;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            a { color: inherit; }
          </style>
        </head>
        <body>${contentHtml}</body>
      </html>
    `;

    await page.setContent(finalHtml, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: error?.message || "PDF generation failed",
      },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
