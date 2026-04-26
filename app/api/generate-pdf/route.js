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

const renderLinks = (contactInfo = {}) => {
  const links = [
    contactInfo.email && { label: contactInfo.email, href: `mailto:${contactInfo.email}` },
    contactInfo.mobile && { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` },
    contactInfo.linkedin && { label: "LinkedIn", href: withProtocol(contactInfo.linkedin) },
    contactInfo.twitter && { label: "Twitter", href: withProtocol(contactInfo.twitter) },
    contactInfo.portfolio && { label: "Portfolio", href: withProtocol(contactInfo.portfolio) },
  ].filter(Boolean);

  return links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}" style="color: inherit; text-decoration: none;">${escapeHtml(link.label)}</a>`,
    )
    .join('<span style="opacity:.5; margin: 0 8px;">|</span>');
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
};

const renderResumeHtml = ({ data = {}, activeStyle = "ats" }) => {
  const { contactInfo = {}, summary, experience, education, projects, skills } = data;
  const theme = resumeThemeByStyle[activeStyle] || resumeThemeByStyle.ats;
  const skillItems = normalizeList(skills);

  const renderSection = (title, content) => {
    if (!content) return "";
    return `
      <section style="margin-top: 18px;">
        <h2 style="margin:0 0 10px; padding-bottom:6px; font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:.12em; color:#111827; border-bottom:2px solid ${theme.sectionRule}; font-family:${theme.headingFont};">
          ${escapeHtml(title)}
        </h2>
        ${content}
      </section>
    `;
  };

  const skillMarkup =
    activeStyle === "executive"
      ? `<div style="text-align:center; font-size:12px; line-height:1.8; text-transform:uppercase; letter-spacing:.12em;">
          ${skillItems
            .map((skill, index) => `${escapeHtml(skill)}${index < skillItems.length - 1 ? ' <span style="color:#d4d4d8; margin:0 8px;">/</span>' : ""}`)
            .join("")}
        </div>`
      : `<div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${skillItems
            .map(
              (skill) => `
                <span style="padding:6px 10px; font-size:11px; font-weight:700; text-transform:uppercase; border:${activeStyle === "academic" ? "1px solid #e2e8f0" : "none"}; background:${theme.chipsBg}; color:${theme.chipsFg};">
                  ${escapeHtml(skill)}
                </span>
              `,
            )
            .join("")}
        </div>`;

  return `
    <div style="background:#ffffff; min-height:297mm; padding:40px 44px; color:#374151; font-family:${theme.bodyFont};">
      <header style="margin-bottom: 24px; ${activeStyle === "corporate" ? `border-left:8px solid ${theme.headerBorder}; padding-left:18px;` : activeStyle === "ats" ? `border-bottom:2px solid ${theme.headerBorder}; padding-bottom:10px;` : activeStyle === "executive" ? `text-align:center; border-bottom:1px solid ${theme.headerBorder}; padding-bottom:14px;` : `text-align:center; border-bottom:1px solid ${theme.headerBorder}; padding-bottom:12px;`}">
        <h1 style="margin:0; font-size:${activeStyle === "executive" ? "30px" : "28px"}; font-weight:${activeStyle === "executive" ? "400" : "800"}; color:#111827; text-transform:${theme.titleTransform}; letter-spacing:${activeStyle === "executive" ? "normal" : "-0.03em"}; font-family:${theme.headingFont};">
          ${escapeHtml(contactInfo?.name)}
        </h1>
        ${
          contactInfo?.profession
            ? `<div style="margin-top:8px; font-size:13px; font-weight:700; color:${theme.accent}; ${activeStyle === "executive" ? "letter-spacing:.22em; text-transform:uppercase;" : activeStyle === "academic" ? "font-style:italic;" : "text-transform:uppercase;"}">
                ${escapeHtml(contactInfo.profession)}
              </div>`
            : ""
        }
        ${
          renderLinks(contactInfo)
            ? `<div style="margin-top:10px; font-size:11px; color:#4b5563; ${activeStyle === "executive" || activeStyle === "academic" ? "display:flex; justify-content:center; flex-wrap:wrap;" : ""}">
                ${renderLinks(contactInfo)}
              </div>`
            : ""
        }
      </header>

      ${
        summary
          ? renderSection(
              activeStyle === "academic" ? "Profile Summary" : activeStyle === "executive" ? "Executive Summary" : "Professional Summary",
              `<div style="white-space:pre-wrap; line-height:1.65;">${escapeHtml(summary)}</div>`,
            )
          : ""
      }
      ${renderSection("Experience", renderExperience(experience, theme.accent))}
      ${renderSection(activeStyle === "ats" ? "Technical Projects" : activeStyle === "executive" ? "Strategic Projects" : "Projects", renderProjects(projects, theme.accent))}
      ${renderSection(activeStyle === "executive" ? "Academic Credentials" : "Education", renderEducation(education, theme.accent))}
      ${skillItems.length ? renderSection(activeStyle === "executive" ? "Expertise" : "Skills", skillMarkup) : ""}
    </div>
  `;
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
          ${
            data?.jobTitle
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
        ${
          data?.jobTitle
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
