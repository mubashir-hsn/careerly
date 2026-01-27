import puppeteer from 'puppeteer';

export async function POST(req) {
    try {
        const body = await req.json();
        const { user, activeStyle, data } = body;

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        let contentHtml = "";
        let fileName = ""

        // --- CONDITION: COVER LETTER ---
        if (activeStyle === 'letter') {
            const today = new Date().toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            fileName = `${data?.name || 'Document'}_Cover_Letter.pdf`;

            contentHtml = `
<div class="bg-white p-[45px_65px] min-h-[297mm] text-[#334155] border-t-8 border-[#1e293b] flex flex-col font-['Inter']">
    <header class="flex justify-between items-start mb-8 border-b pb-6">
        <div>
            <h1 class="text-[30px] font-black text-[#0f172a] uppercase tracking-tighter leading-none">
                ${data?.name}
            </h1>
            <p class="text-[13px] font-bold text-[#4f46e5] uppercase mt-2 tracking-widest">
                ${data?.jobTitle || ""}
            </p>
        </div>
        <div class="text-right text-[11px] font-medium space-y-1 text-[#64748b]">
            ${data?.email ? `<p class="text-[#0f172a] font-bold">${data.email}</p>` : ''}
            ${data?.contact ? `<p class="text-[#0f172a] font-bold">${data.contact}</p>` : ''}
        </div>
    </header>

    <div class="mb-8">
        <p class="text-[12.5px] font-bold text-[#1e293b] mb-5">${today}</p>
        <div class="text-[12.5px]">
            <p class="font-black uppercase text-[#64748b] text-[10px] mb-1 tracking-widest">To</p>
            <p class="font-bold text-[#0f172a] text-[15px] leading-tight">Hiring Manager</p>
            <p class="text-[#475569] font-normal">${data?.companyName || "[Target Company Name]"}</p>
        </div>
    </div>

    <div class="mb-6 py-3 px-4 bg-[#f8fafc] border-l-4 border-[#1e293b]">
        <p class="text-[13.5px] font-bold text-[#0f172a]">
            RE: Application for ${data?.jobTitle || "the Position"}
        </p>
    </div>

    <div class="text-[13px] leading-[1.7] text-[#334155] space-y-5">
        <p class="font-bold text-[#0f172a]">Dear Hiring Manager,</p>
        <div style="white-space: pre-wrap; text-align: justify; font-weight: 400;">
            ${data?.content || "Please provide cover letter content."}
        </div>
    </div>

    <div class="mt-auto pt-8 flex flex-col items-start">
        <p class="text-[#64748b] font-medium mb-2 text-[15px]">Sincerely,</p>
        <div>
            <p style="font-family: 'Georgia', 'Inter'; font-style: italic; font-weight: 500; font-size: 26px; color: #1e293b; line-height: 1; padding: 5px 0;">
                ${data?.name}
            </p>
            <div style="width: 150px; height: 1.5px; background: #1e293b; margin-bottom: 12px; opacity: 0.2;"></div>
            <p class="font-black text-[13px] uppercase tracking-widest text-[#0f172a]">
                ${data?.name}
            </p>
            <p class="text-[11px] text-[#64748b] font-semibold uppercase tracking-tight">
                ${data?.jobTitle}
            </p>
        </div>
    </div>
</div>`;
        }

        // --- CONDITION: RESUME ---
        else {

            const { contactInfo, summary, experience, education, projects, skills } = data || {};
            const userSkills = Array.isArray(skills) ? skills : skills?.split(',') || [];
            fileName = `${user?.fullName}_Resume.pdf`;

            // Helper to format URLs for clicking
            const fUrl = (url) => (!url ? '#' : url.startsWith('http') ? url : `https://${url}`);

            // Helper for Header Links 
            const getHeaderLinks = (variant) => {
                const links = [
                    contactInfo?.email && `<a href="mailto:${contactInfo.email}">${contactInfo.email}</a>`,
                    contactInfo?.mobile && `<span>${contactInfo.mobile}</span>`,
                    contactInfo?.linkedin && `<a href="${fUrl(contactInfo.linkedin)}">LinkedIn</a>`,
                    contactInfo?.twitter && `<a href="${fUrl(contactInfo.twitter)}">Twitter</a>`,
                    contactInfo?.portfolio && `<a href="${fUrl(contactInfo.portfolio)}">Portfolio</a>`,
                ].filter(Boolean);

                const separator = variant === 'academic' ? ' • ' : ' | ';
                return links.join(`<span style="opacity: 0.5; margin: 0 8px;">${separator}</span>`);
            };

            // Helper for Project Links
            const getProjectLinks = (proj, colorClass = "text-[#4f46e5]") => {
                const links = [];
                if (proj.githubLink) links.push(`<a href="${fUrl(proj.githubLink)}" class="${colorClass}">GitHub</a>`);
                if (proj.liveLink) links.push(`<a href="${fUrl(proj.liveLink)}" class="${colorClass}">Live Demo</a>`);

                return links.length > 0 ? `<div class="flex gap-3 text-[9px] font-bold uppercase">${links.join(' | ')}</div>` : '';
            };


            const resumeTemplates = {

                ats: `
            <div class="bg-white p-[45px_55px] font-sans text-[10pt] text-[#374151]">
                <header class="mb-5 border-b border-gray-900 pb-2">
                    <h1 class="text-[26px] font-bold text-[#111827] tracking-tight">${user?.fullName}</h1>
                    <div class="text-[11px] flex flex-wrap gap-4 font-medium uppercase mt-1">
                        ${getHeaderLinks('ats')}
                    </div>
                </header>
                ${summary ? `
                   <section class="mb-4">
                      <h2 class="text-[14px] font-bold border-b border-gray-900 mb-1 uppercase tracking-widest">Professional Summary</h2>
                      <p class="leading-relaxed">${summary}</p>
                    </section>` : ''}

                <section class="mb-4">
                    <h2 class="text-[14px] font-bold border-b border-gray-900 mb-2 mt-4 uppercase tracking-widest">Experience</h2>
                    ${experience?.map(exp => `
                      <div class="mb-4">
                         <div class="flex justify-between font-bold text-black">
                             <span>${exp.organization}</span><span>${exp.startDate} — ${exp.endDate}</span>
                         </div>
                          <div class="italic text-[#4B5563]">${exp.title}</div>
                          <p class="text-[10.5pt]">${exp.description}</p>
                      </div>`).join('')}
                </section>

                <section class="mb-4"><h2 class="text-[14px] font-bold border-b border-gray-900 mb-2 mt-4 uppercase tracking-widest">Technical Projects</h2>
                        ${projects?.map(proj => `
                            <div class="mb-3">
                                <div class="flex justify-between font-bold text-black">
                                    <span>${proj.title}</span>
                                    ${getProjectLinks(proj, "text-black underline")}
                                </div>
                                <p>${proj.description}</p>
                            </div>
                        `).join('')}
                    </section>
                <section class="mb-4">
                    <h2 class="text-[14px] font-bold border-b border-gray-900 mb-2 mt-4 uppercase tracking-widest">Education</h2>
                    ${education?.map(edu => `
                       <div class="mb-2">
                          <div class="flex justify-between font-bold text-black">
                             <span>${edu.organization}</span><span>${edu.startDate} — ${edu.endDate}</span>
                          </div>
                           <div class="italic text-[#4B5563]">${edu.title}</div>
                        </div>`).join('')
                    }
                </section>

                <section>
                    <h2 class="text-[14px] font-bold border-b border-gray-900 mb-2 mt-4 uppercase tracking-widest">Core Skills</h2>
                    <p class="font-medium">${userSkills.join('  •  ')}</p>
                </section>
            </div>`,

                academic: `
                <div class="bg-white p-[35px_45px] text-[#334155] leading-normal font-sans text-[10.5pt]">
                    <header class="mb-4 text-center">
                        <h1 class="text-[24px] font-serif font-semibold underline underline-offset-[6px] mb-1 uppercase text-[#0f172a]">${user?.fullName}</h1>
                        <p class="text-[14px] italic text-black font-serif mb-1.5">${contactInfo?.profession}</p>
                        <div class="text-[10px] text-black font-medium flex justify-center uppercase">
                            ${getHeaderLinks('academic')}
                        </div>
                    </header>

                    ${summary ? `<section class="mb-2"><h2 class="text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-1 uppercase text-[#0f172a]">Profile Summary</h2><p class="text-justify text-[12.5px] text-[#475569]">${summary}</p></section>` : ''}

                    <section class="mb-2">
                        <h2 class="text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase text-[#0f172a]">Education</h2>
                        ${education?.map(edu => `<div class="mb-2"><div class="flex justify-between font-semibold"><span>${edu.organization}</span><span class="text-[#4f46e5] text-[9pt]">${edu.startDate} – ${edu.endDate}</span></div><div class="text-[#64748b] italic text-[12px]">${edu.title}</div></div>`).join('')}
                    </section>

                    <section class="mb-2">
                        <h2 class="text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase text-[#0f172a]">Experience</h2>
                        ${experience?.map(exp => `<div class="mb-3"><div class="flex justify-between font-semibold"><span>${exp.organization}</span><span class="text-[9pt] bg-[#f0f4ff] text-[#4f46e5] px-1.5 py-0.5 rounded">${exp.startDate} – ${exp.endDate}</span></div><div class="text-[#4f46e5] uppercase font-bold text-[10px] tracking-wider">${exp.title}</div><p class="text-[12.5px] border-l-2 border-[#e2e8f0] pl-3 text-justify">${exp.description}</p></div>`).join('')}
                    </section>

                    <section class="mb-2"><h2 class="text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase text-[#0f172a]">Projects</h2>
                        ${projects?.map(proj => `
                            <div class="mb-2">
                                <div class="flex justify-between items-baseline font-semibold text-[#1e293b]">
                                    <span>${proj.title}</span>
                                    ${getProjectLinks(proj)}
                                </div>
                                <p class="text-[14px] text-[#475569] italic">${proj.description}</p>
                            </div>
                        `).join('')}
                    </section>

                    <section>
                        <h2 class="text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase text-[#0f172a]">Technical Skills</h2>
                        <div class="flex flex-wrap gap-1.5">${userSkills.map(s => `<span class="px-2.5 py-1 border border-[#e2e8f0] text-[10px] uppercase font-semibold text-[#334155]">${s.trim()}</span>`).join('')}</div>
                    </section>
                </div>`,

                corporate: `
                <div class="bg-white p-[35px_45px] text-[#334155] font-sans text-[10.5pt]">
                    <header class="mb-6 border-l-8 border-[#4f46e5] pl-5">
                        <h1 class="text-[24px] font-black uppercase text-[#0f172a] tracking-tighter">${user?.fullName}</h1>
                        <p class="text-[14px] font-bold text-[#4f46e5] uppercase">${contactInfo?.profession}</p>
                        <div class="text-[10px] text-[#64748b] flex flex-wrap gap-y-1 font-bold uppercase mt-2">
                            ${getHeaderLinks('corporate')}
                        </div>
                    </header>
                    <section class="mb-4">
                        <h2 class="text-[15px] font-black border-b-2 border-[#e2e8f0] mb-3 uppercase text-[#1e293b]">Experience</h2>
                        ${experience?.map(exp => `
                            <div class="mb-4">
                               <div class="flex justify-between font-bold">
                                  <span>${exp.organization}</span>
                                  <span class="text-[#4f46e5] text-[9pt]">${exp.startDate} – ${exp.endDate}</span>
                                </div>
                                <div class="text-[#64748b] text-[10px] font-bold italic uppercase mb-1">${exp.title}</div>
                                <p class="text-[12.5px] border-l-2 border-[#f1f5f9] pl-3">${exp.description}</p>
                            </div>`).join('')
                    }
                    </section>
                    <section class="mb-4"><h2 class="text-[15px] font-black border-b-2 border-[#e2e8f0] mb-3 uppercase text-[#1e293b]">Key Projects</h2>
                        ${projects?.map(proj => `
                            <div class="mb-3 border-l-2 border-[#4f46e5] pl-3">
                                <div class="flex justify-between font-bold">
                                    <span>${proj.title}</span>
                                    ${getProjectLinks(proj)}
                                </div>
                                <p class="text-[12.5px] mt-1">${proj.description}</p>
                            </div>
                        `).join('')}
                    </section>
                    <section class="mb-4">
                        <h2 class="text-[15px] font-black border-b-2 border-[#e2e8f0] mb-3 uppercase text-[#1e293b]">Education</h2>
                        ${education?.map(edu => `
                           <div class="flex justify-between mb-2">
                              <div>
                                 <div class="font-bold">${edu.organization}</div>
                                 <div class="text-[12px] italic text-[#4f46e5] font-bold">${edu.title}</div>
                              </div>
                              <div class="font-bold text-[#4f46e5] text-[10px] uppercase">${edu.startDate} – ${edu.endDate}</div>
                          </div>`).join('')
                    }
                    </section>
                    <section>
                       <h2 class="text-[15px] font-black border-b-2 border-[#e2e8f0] mb-3 uppercase text-[#1e293b]">Skills</h2>
                       <div class="flex flex-wrap gap-1.5">
                         ${userSkills.map(s => `
                              <span class="px-2.5 py-1 text-[10px] bg-[#1e293b] text-white font-bold uppercase">${s.trim()}</span>
                              `).join('')
                    }
                      </div>
                   </section>
                </div>`,

                executive: `
                <div class="bg-white p-[35px_45px] font-serif text-[10.5pt] text-[#3f3f46]">
                    <header class="text-center mb-8">
                        <h1 class="text-[28px] font-light text-[#18181b]">${user?.fullName}</h1>
                        <div class="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a1a1aa] mb-2">${contactInfo?.profession}</div>
                        <div class="flex justify-center gap-x-1 text-[10px] font-sans border-y py-2 uppercase border-[#f4f4f5]">
                            ${getHeaderLinks('executive')}
                        </div>
                    </header>
                    
                    <section class="mb-3">
                       <h2 class="text-[15px] font-bold text-center mb-4 uppercase tracking-[0.15em] flex items-center before:flex-1 before:border-b before:mr-4 after:flex-1 after:border-b after:ml-4">Experience</h2>
                        ${experience?.map(exp => `
                        <div class="mb-2">
                          <div class="flex justify-between font-bold text-[#18181b]">
                             <span>${exp.title}</span>
                             <span class="text-[#a16207] text-[9pt] tracking-widest">${exp.startDate} — ${exp.endDate}</span>
                          </div>
                          <div class="text-[12px] uppercase mb-2 text-[#71717a] font-sans font-bold">${exp.organization}</div>
                          <p class="text-[12.5px] leading-relaxed text-justify">${exp.description}</p>
                        </div>`).join('')}
                    </section>
                   
                    <section class="mb-3">
                       <h2 class="text-[15px] font-bold text-center mb-4 uppercase tracking-[0.15em] flex items-center before:flex-1 before:border-b before:mr-4 after:flex-1 after:border-b after:ml-4">Strategic Projects</h2>
                        ${projects?.map(proj => `
                            <div class="mb-2">
                                <div class="flex justify-between font-bold italic">
                                    <span>${proj.title}</span>
                                    ${getProjectLinks(proj, "text-[#a16207]")}
                                </div>
                                <p class="text-[12px] italic pr-4 border-r-2 border-[#f4f4f5] text-right">${proj.description}</p>
                            </div>
                        `).join('')}
                    </section>

                    <section class="mb-3">
                       <h2 class="text-[15px] font-bold text-center mb-4 uppercase tracking-[0.15em] flex items-center before:flex-1 before:border-b before:mr-4 after:flex-1 after:border-b after:ml-4">Academic Credentials</h2>
                        <div class="grid grid-cols-2 gap-4">
                        ${education?.map(edu => `
                               <div class="border-l border-gray-200 pl-4">
                                  <div class="font-bold text-[#18181b] text-[13px]">${edu.organization}</div>
                                  <div class="text-[11px] italic text-[#a16207]">${edu.title}</div>
                                  <div class="text-[9px] font-sans text-[#a1a1aa]">${edu.startDate} — ${edu.endDate}</div>
                                </div>`).join('')
                    }</div>
                    </section>

                    <section>
                      <h2 class="text-[15px] font-bold text-center mb-4 uppercase tracking-[0.15em] flex items-center before:flex-1 before:border-b before:mr-4 after:flex-1 after:border-b after:ml-4">Expertise</h2>
                      <div class="text-center text-[11.5px] uppercase tracking-widest">
                          ${userSkills.map((s, i) => `
                             <span>${s.trim()}${i < userSkills.length - 1 ? ' <span style="color:#d4d4d8; margin: 0 8px;">/</span> ' : ''}</span>
                             `).join('')
                    }
                        </div>
                    </section>
                </div>`,

            };
            contentHtml = resumeTemplates[activeStyle] || resumeTemplates.ats;
        }

        const finalHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
                <style>
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                    a { text-decoration: none; color: inherit; }
                    * { box-sizing: border-box; }
                </style>
            </head>
            <body>${contentHtml}</body>
            </html>
        `;

        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}