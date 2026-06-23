import { db } from "@/lib/prisma";
import puppeteer from "puppeteer";
import { existsSync } from "node:fs";

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
      // Fall back to default
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
    contactInfo.linkedin && { label: "LinkedIn", href: withProtocol(contactInfo.linkedin) },
    contactInfo.twitter && { label: "Twitter", href: withProtocol(contactInfo.twitter) },
    contactInfo.portfolio && { label: "Portfolio", href: withProtocol(contactInfo.portfolio) },
  ].filter(Boolean);

  const separator = activeStyle === "academic" ? "•" : "|";

  return links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}" style="color: inherit; text-decoration: none;">${escapeHtml(link.label)}</a>`
    )
    .join(`<span style="opacity:.5; margin: 0 8px;">${separator}</span>`);
};

// Simplified HTML rendering logic for the PDF download (reuse logic from main generator)
const renderResumeHtml = ({ data = {}, activeStyle = "ats" }) => {
  const { contactInfo = {}, summary, experience = [], education = [], projects = [], skills = "" } = data;
  const skillItems = normalizeList(skills);

  // ATS style rendering
  return `
    <div style="background:#ffffff; min-height:297mm; padding:45px 55px; color:#374151; font-family:Arial, Helvetica, sans-serif; font-size:10pt; line-height:1.4;">
      <header style="margin-bottom:20px;">
        <h1 style="margin:0; font-size:26px; font-weight:700; color:#111827;">${escapeHtml(contactInfo?.name)}</h1>
        <div style="font-size:11px; color:#4b5563; margin-top:4px; font-weight:500; border-top:1px solid #f3f4f6; padding-top:8px; text-transform:uppercase;">
          ${renderLinks(contactInfo, "ats")}
        </div>
      </header>

      ${summary ? `
        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; text-transform:uppercase; tracking-widest;">Summary</h2>
          <p style="font-size:10.5pt; line-height:1.6; margin:0;">${escapeHtml(summary)}</p>
        </section>
      ` : ""}

      ${experience.length > 0 ? `
        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; text-transform:uppercase; tracking-widest;">Experience</h2>
          ${experience.map(exp => `
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
      ` : ""}

      ${projects.length > 0 ? `
        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; text-transform:uppercase; tracking-widest;">Projects</h2>
          ${projects.map(proj => `
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
      ` : ""}

      ${education.length > 0 ? `
        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; text-transform:uppercase; tracking-widest;">Education</h2>
          ${education.map(edu => `
            <div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; font-weight:700; color:#111827;">
                <span>${escapeHtml(edu?.organization)}</span>
                <span style="font-size:10pt; font-weight:500;">${escapeHtml(edu?.startDate)} — ${escapeHtml(edu?.endDate)}</span>
              </div>
              <div style="color:#4b5563; font-style:italic;">${escapeHtml(edu?.title)}</div>
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${skillItems.length > 0 ? `
        <section style="margin-bottom:16px;">
          <h2 style="font-size:14px; font-weight:700; color:#111827; border-bottom:1px solid #111827; margin-bottom:8px; margin-top:16px; text-transform:uppercase; tracking-widest;">Skills</h2>
          <p style="font-size:10.5pt; font-weight:500; tracking-tight; margin:0;">${skillItems.join(" • ")}</p>
        </section>
      ` : ""}
    </div>
  `;
};

export async function GET(req) {
  let browser;

  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return Response.json({ error: "Username parameter is required." }, { status: 400 });
    }

    const portfolio = await db.portfolio.findUnique({
      where: { username: username.toLowerCase().trim(), isPublished: true },
      select: { userId: true },
    });

    if (!portfolio) {
      return Response.json({ error: "Portfolio not found or is private." }, { status: 444 });
    }

    const resume = await db.resume.findUnique({
      where: { userId: portfolio.userId },
    });

    if (!resume || !resume.content) {
      return Response.json({ error: "No resume found for this user." }, { status: 404 });
    }

    const data = JSON.parse(resume.content);

    browser = await puppeteer.launch({
      headless: true,
      executablePath: getBrowserExecutablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const safeName = data?.contactInfo?.name || username || "Resume";
    const fileName = `${safeName.replace(/\s+/g, "_")}_Resume.pdf`;

    const contentHtml = renderResumeHtml({ data, activeStyle: "ats" });

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
    console.error("PDF download API error:", error);
    return Response.json(
      { error: error?.message || "PDF generation failed" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
