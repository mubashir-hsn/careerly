import puppeteer from 'puppeteer';

export async function POST(req) {
    try {
        const { data, user, activeStyle } = await req.json();
        const { contactInfo, summary, experience, education, projects, skills } = data;
        const userSkills = Array.isArray(skills) ? skills : skills?.split(',') || [];

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

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

        const templates = {

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
                <div class="bg-white p-[35px_45px] text-[#334155] leading-[1.5] font-sans text-[10.5pt]">
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

        const finalHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
                <style>
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
                    a { text-decoration: none; color: inherit; }
                    * { box-sizing: border-box; }
                </style>
            </head>
            <body>${templates[activeStyle]}</body>
            </html>
        `;

        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
        await browser.close();

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${user.fullName}_Resume.pdf"`,
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// import puppeteer from 'puppeteer';

// export async function POST(req) {
//     const { data, user } = await req.json();
//     const { contactInfo, summary, experience, education, projects, skills } = data;

//     const userSkills = skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [];

//     const formatUrl = (url) => {
//         if (!url) return '';
//         return url.startsWith('http') ? url : `https://${url}`;
//     };

//     const links = [
//         contactInfo?.email ? { label: contactInfo.email, href: `mailto:${contactInfo.email}` } : null,
//         contactInfo?.mobile ? { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` } : null,
//         contactInfo?.twitter ? { label: contactInfo.twitter.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.twitter) } : null,
//         contactInfo?.linkedin ? { label: contactInfo.linkedin.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.linkedin) } : null,
//         contactInfo?.portfolio ? { label: contactInfo.portfolio.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.portfolio) } : null,
//     ].filter(Boolean);

//     const html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8" />
//         <title>Resume - ${user?.fullName}</title>
//         <style>
//             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@500&display=swap');

//             * { box-sizing: border-box; -webkit-print-color-adjust: exact; }

//             body {
//                 margin: 0;
//                 padding: 0;
//                 background: white;
//                 font-family: 'Inter', sans-serif;
//                 color: #334155;
//                 line-height: 1.5;
//             }

//             #resume-pdf {
//                 width: 210mm;
//                 min-height: 297mm;
//                 margin: 0 auto;
//                 padding: 35px 45px;
//                 background: white;
//             }

//             .user-name { 
//                 font-family: 'Georgia', serif; 
//                 font-size: 24px; 
//                 font-weight: 600; 
//                 text-decoration: underline; 
//                 text-underline-offset: 6px; 
//                 margin: 0;
//                 text-transform: uppercase; 
//                 color: #0f172a;
//                 text-align: center;
//             }

//             .section-header { 
//                 font-family: 'Georgia', serif; 
//                 font-size: 15px; 
//                 font-weight: bold; 
//                 border-bottom: 1.5px solid #cbd5e1; 
//                 margin: 15px 0 8px 0; 
//                 padding-bottom: 3px; 
//                 text-transform: uppercase; 
//                 letter-spacing: 0.05em;
//                 color: #0f172a;
//             }

//             .header { text-align: center; margin-bottom: 15px; }
            
//             .profession { 
//                 font-family: 'Georgia', serif; 
//                 color: rgb(0,0,0); 
//                 font-size: 15px; 
//                 font-weight: 400; 
//                 margin-bottom: 4px; 
//                 font-style: italic;
//                 letter-spacing: 0.025em;
//                 text-transform: capitalize; 
//             }

//             .contact-bar { 
//                 font-family: 'Inter', sans-serif; 
//                 font-size: 10px; 
//                 color: rgb(30,30,30); 
//                 font-weight: 500;  
//                 font-style: normal;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 gap: 5px;
//                 line-height:16px;
//                 text-transform: uppercase
//             }
//             .contact-bar a{
//                 color: rgb(30,30,30);
//                 text-decoration: none;
//                 cursor: pointer;
//             }

//             .dot-separator { color: rgb(30,30,30); margin: 0 5px; font-weight: 500; }

//             .summary-text { 
//                 text-align: justify; 
//                 font-size: 12.5px;
//                 color: #475569;
//                 margin: 0;
//             }

//             .exp-item, .edu-item, .proj-item { margin-bottom: 10px; page-break-inside: avoid; }
//             .flex-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
//             .org-name { font-size: 13.5px; font-weight: 600; color: #1e293b; }
            
//             .date-badge { 
//                 font-family: 'Inter', sans-serif; 
//                 font-size: 9px; 
//                 font-weight: 600; 
//                 color: #4f46e5;
//                 background: #f0f4ff; 
//                 padding: 1px 6px; 
//                 border-radius: 3px; 
//             }
            
//             .role-title { 
//                 color: #4f46e5; 
//                 font-weight: 600; 
//                 text-transform: uppercase; 
//                 font-size: 10px; 
//                 letter-spacing: 0.1em; 
//                 margin-bottom: 3px; 
//             }

//             .description { 
//                 font-size: 12.5px; 
//                 color: #475569; 
//                 border-left: 2px solid #e2e8f0; 
//                 padding-left: 12px; 
//                 margin-top: 3px;
//                 margin-bottom: 0;
//             }

//             .skills-container { display: flex; flex-wrap: wrap; gap: 6px; }
//             .skill-pill { 
//                 padding: 3px 10px; 
//                 border-radius: 4px; 
//                 font-size: 10px; 
//                 border: 1px solid #e2e8f0; 
//                 font-weight: 600; 
//                 color: #334155;
//             }

//             .project-links { display: flex; gap: 10px; margin: 4px 0; }
            
           
//             .link-item { 
//                 font-size: 9px; 
//                 text-decoration: none; 
//                 color: #4f46e5; 
//                 font-weight: 700; 
//                 text-transform: uppercase; 
//                 display: flex;
//                 align-items: center;
//                 gap: 4px;
//                 cursor: pointer;
//             }
//             .link-item:hover { text-decoration: underline; }

//             @media print {
//                 #resume-pdf { padding: 10mm 15mm; }
//             }
//         </style>
//     </head>
//     <body>
//         <div id="resume-pdf">
//             <header class="header">
//                 <h1 class="user-name">${user?.fullName || "Name"}</h1>
//                 <p class="profession">${contactInfo?.profession || ''}</p>
//                 <div class="contact-bar">
//                     ${
//                         links.map((link, idx) => `
//                          <span>
//                              <a href=${link.href} target="_blank">
//                                  ${link.label}
//                              </a>
//                              ${idx < links.length - 1 ? '<span class="dot-separator">•</span>' : ''}
//                          </span>
//                         `).join('')
//                    }
//                 </div>
//             </header>

//             ${summary ? `
//                 <section class="section">
//                     <h2 class="section-header">Profile Summary</h2>
//                     <p class="summary-text">${summary}</p>
//                 </section>
//             ` : ''}

//             ${experience?.length > 0 ? `
//                 <section class="section">
//                     <h2 class="section-header">Professional Experience</h2>
//                     ${experience.map(exp => `
//                         <div class="exp-item">
//                             <div class="flex-row">
//                                 <span class="org-name">${exp?.organization}</span>
//                                 <span class="date-badge">${exp?.startDate} – ${exp?.endDate}</span>
//                             </div>
//                             <div class="role-title">${exp?.title}</div>
//                             <p class="description">${exp?.description}</p>
//                         </div>
//                     `).join('')}
//                 </section>
//             ` : ''}

//             ${education?.length > 0 ? `
//                 <section class="section">
//                     <h2 class="section-header">Education</h2>
//                     ${education.map(edu => `
//                         <div class="edu-item">
//                             <div class="flex-row">
//                                 <span class="org-name">${edu?.organization}</span>
//                                 <span class="date-badge">${edu?.startDate} – ${edu?.endDate}</span>
//                             </div>
//                             <div style="color: #64748b; font-style: italic; font-size: 12px;">${edu?.title}</div>
//                         </div>
//                     `).join('')}
//                 </section>
//             ` : ''}

//             ${userSkills.length > 0 ? `
//                 <section class="section">
//                     <h2 class="section-header">Technical Competencies</h2>
//                     <div class="skills-container">
//                         ${userSkills.map(skill => `<span class="skill-pill">${skill.trim()}</span>`).join('')}
//                     </div>
//                 </section>
//             ` : ''}

//             ${projects?.length > 0 ? `
//                 <section class="section">
//                     <h2 class="section-header">Strategic Projects</h2>
//                     ${projects.map(proj => `
//                         <div class="proj-item">
//                             <div class="flex-row">
//                                 <span class="org-name">${proj?.title}</span>
//                             </div>
//                             <div class="project-links">
//                                 ${proj?.githubLink ? `<a href="${proj.githubLink.startsWith('http') ? proj.githubLink : 'https://' + proj.githubLink}" target="_blank" class="link-item">🔗 GitHub</a>` : ''}
//                                 ${proj?.liveLink ? `<a href="${proj.liveLink.startsWith('http') ? proj.liveLink : 'https://' + proj.liveLink}" target="_blank" class="link-item">🌐 Live Demo</a>` : ''}
//                             </div>
//                             <p class="description">${proj?.description}</p>
//                         </div>
//                     `).join('')}
//                 </section>
//             ` : ''}
//         </div>
//     </body>
//     </html>
//     `;

//     try {
//         const browser = await puppeteer.launch({
//             args: ['--no-sandbox', '--disable-setuid-sandbox'],
//             headless: "new"
//         });
//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: 'networkidle0' });

//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             margin: { top: '0', bottom: '0', left: '0', right: '0' }
//         });

//         await browser.close();
//         return new Response(pdfBuffer, {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': 'attachment; filename=resume.pdf'
//             }
//         });
//     } catch (error) {
//         return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//     }
// }