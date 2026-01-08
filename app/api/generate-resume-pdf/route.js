import puppeteer from 'puppeteer';

export async function POST(req) {
    const { data, user } = await req.json();
    const { contactInfo, summary, experience, education, projects, skills } = data;

    const userSkills = skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [];

    const formatUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    };

    const links = [
        contactInfo?.email ? { label: contactInfo.email, href: `mailto:${contactInfo.email}` } : null,
        contactInfo?.mobile ? { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` } : null,
        contactInfo?.twitter ? { label: contactInfo.twitter.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.twitter) } : null,
        contactInfo?.linkedin ? { label: contactInfo.linkedin.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.linkedin) } : null,
        contactInfo?.portfolio ? { label: contactInfo.portfolio.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.portfolio) } : null,
    ].filter(Boolean);

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Resume - ${user?.fullName}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@500&display=swap');

            * { box-sizing: border-box; -webkit-print-color-adjust: exact; }

            body {
                margin: 0;
                padding: 0;
                background: white;
                font-family: 'Inter', sans-serif;
                color: #334155;
                line-height: 1.5;
            }

            #resume-pdf {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                padding: 35px 45px;
                background: white;
            }

            .user-name { 
                font-family: 'Georgia', serif; 
                font-size: 24px; 
                font-weight: 600; 
                text-decoration: underline; 
                text-underline-offset: 6px; 
                margin: 0;
                text-transform: uppercase; 
                color: #0f172a;
                text-align: center;
            }

            .section-header { 
                font-family: 'Georgia', serif; 
                font-size: 15px; 
                font-weight: bold; 
                border-bottom: 1.5px solid #cbd5e1; 
                margin: 15px 0 8px 0; 
                padding-bottom: 3px; 
                text-transform: uppercase; 
                letter-spacing: 0.05em;
                color: #0f172a;
            }

            .header { text-align: center; margin-bottom: 15px; }
            
            .profession { 
                font-family: 'Georgia', serif; 
                color: rgb(0,0,0); 
                font-size: 15px; 
                font-weight: 400; 
                margin-bottom: 4px; 
                font-style: italic;
                letter-spacing: 0.025em;
                text-transform: capitalize; 
            }

            .contact-bar { 
                font-family: 'Inter', sans-serif; 
                font-size: 10px; 
                color: rgb(30,30,30); 
                font-weight: 500;  
                font-style: normal;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                line-height:16px;
                text-transform: uppercase
            }
            .contact-bar a{
                color: rgb(30,30,30);
                text-decoration: none;
                cursor: pointer;
            }

            .dot-separator { color: rgb(30,30,30); margin: 0 5px; font-weight: 500; }

            .summary-text { 
                text-align: justify; 
                font-size: 12.5px;
                color: #475569;
                margin: 0;
            }

            .exp-item, .edu-item, .proj-item { margin-bottom: 10px; page-break-inside: avoid; }
            .flex-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
            .org-name { font-size: 13.5px; font-weight: 600; color: #1e293b; }
            
            .date-badge { 
                font-family: 'Inter', sans-serif; 
                font-size: 9px; 
                font-weight: 600; 
                color: #4f46e5;
                background: #f0f4ff; 
                padding: 1px 6px; 
                border-radius: 3px; 
            }
            
            .role-title { 
                color: #4f46e5; 
                font-weight: 600; 
                text-transform: uppercase; 
                font-size: 10px; 
                letter-spacing: 0.1em; 
                margin-bottom: 3px; 
            }

            .description { 
                font-size: 12.5px; 
                color: #475569; 
                border-left: 2px solid #e2e8f0; 
                padding-left: 12px; 
                margin-top: 3px;
                margin-bottom: 0;
            }

            .skills-container { display: flex; flex-wrap: wrap; gap: 6px; }
            .skill-pill { 
                padding: 3px 10px; 
                border-radius: 4px; 
                font-size: 10px; 
                border: 1px solid #e2e8f0; 
                font-weight: 600; 
                color: #334155;
            }

            .project-links { display: flex; gap: 10px; margin: 4px 0; }
            
           
            .link-item { 
                font-size: 9px; 
                text-decoration: none; 
                color: #4f46e5; 
                font-weight: 700; 
                text-transform: uppercase; 
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
            }
            .link-item:hover { text-decoration: underline; }

            @media print {
                #resume-pdf { padding: 10mm 15mm; }
            }
        </style>
    </head>
    <body>
        <div id="resume-pdf">
            <header class="header">
                <h1 class="user-name">${user?.fullName || "Name"}</h1>
                <p class="profession">${contactInfo?.profession || ''}</p>
                <div class="contact-bar">
                    ${
                        links.map((link, idx) => `
                         <span>
                             <a href=${link.href} target="_blank">
                                 ${link.label}
                             </a>
                             ${idx < links.length - 1 ? '<span class="dot-separator">•</span>' : ''}
                         </span>
                        `).join('')
                   }
                </div>
            </header>

            ${summary ? `
                <section class="section">
                    <h2 class="section-header">Profile Summary</h2>
                    <p class="summary-text">${summary}</p>
                </section>
            ` : ''}

            ${experience?.length > 0 ? `
                <section class="section">
                    <h2 class="section-header">Professional Experience</h2>
                    ${experience.map(exp => `
                        <div class="exp-item">
                            <div class="flex-row">
                                <span class="org-name">${exp?.organization}</span>
                                <span class="date-badge">${exp?.startDate} – ${exp?.endDate}</span>
                            </div>
                            <div class="role-title">${exp?.title}</div>
                            <p class="description">${exp?.description}</p>
                        </div>
                    `).join('')}
                </section>
            ` : ''}

            ${education?.length > 0 ? `
                <section class="section">
                    <h2 class="section-header">Education</h2>
                    ${education.map(edu => `
                        <div class="edu-item">
                            <div class="flex-row">
                                <span class="org-name">${edu?.organization}</span>
                                <span class="date-badge">${edu?.startDate} – ${edu?.endDate}</span>
                            </div>
                            <div style="color: #64748b; font-style: italic; font-size: 12px;">${edu?.title}</div>
                        </div>
                    `).join('')}
                </section>
            ` : ''}

            ${userSkills.length > 0 ? `
                <section class="section">
                    <h2 class="section-header">Technical Competencies</h2>
                    <div class="skills-container">
                        ${userSkills.map(skill => `<span class="skill-pill">${skill.trim()}</span>`).join('')}
                    </div>
                </section>
            ` : ''}

            ${projects?.length > 0 ? `
                <section class="section">
                    <h2 class="section-header">Strategic Projects</h2>
                    ${projects.map(proj => `
                        <div class="proj-item">
                            <div class="flex-row">
                                <span class="org-name">${proj?.title}</span>
                            </div>
                            <div class="project-links">
                                ${proj?.githubLink ? `<a href="${proj.githubLink.startsWith('http') ? proj.githubLink : 'https://' + proj.githubLink}" target="_blank" class="link-item">🔗 GitHub</a>` : ''}
                                ${proj?.liveLink ? `<a href="${proj.liveLink.startsWith('http') ? proj.liveLink : 'https://' + proj.liveLink}" target="_blank" class="link-item">🌐 Live Demo</a>` : ''}
                            </div>
                            <p class="description">${proj?.description}</p>
                        </div>
                    `).join('')}
                </section>
            ` : ''}
        </div>
    </body>
    </html>
    `;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: "new"
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', bottom: '0', left: '0', right: '0' }
        });

        await browser.close();
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=resume.pdf'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}