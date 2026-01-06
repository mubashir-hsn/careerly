import puppeteer from "puppeteer";
import ResumeTemplateServer from "@/components/ResumeTemplateServer";

export async function POST(req) {
    try {
        const body = await req.json();
        const { data, template, user } = body;

        const htmlContent = ResumeTemplateServer({ data, template, user });

        const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
        <title>Resume PDF</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>${htmlContent}</body>
      </html>
    `;

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setContent(fullHtml, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();

        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="resume.pdf"`,
            },
        });
    } catch (err) {
        console.error(err);
        return new Response("Failed to generate PDF", { status: 500 });
    }
}
