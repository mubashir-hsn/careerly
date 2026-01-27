import React from 'react';

const Template = ({ data, user, activeStyle, mode, letterData }) => {

    if (mode === 'letter') {

        // --- TEMPLATE: PROFESSIONAL COVER LETTER ---
        const today = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return (
            <div className="px-4 overflow-hidden overflow-y-auto max-h-full">
                <div className="shadow-[0_0_50px_rgba(0,0,0,0.1)]">
                    <div id="cover-letter-professional" className="bg-white p-[60px_80px] max-w-[210mm] mx-auto min-h-[297mm] text-[#334155] font-sans shadow-sm border-t-10 border-[#1e293b]">
                        {/* Header: Professional Branding */}
                        <header className="flex justify-between items-start mb-12 border-b pb-8">
                            <div>
                                <h1 className="text-[32px] font-black text-[#0f172a] uppercase tracking-tighter leading-none">
                                    {letterData?.name}
                                </h1>
                                <p className="text-[14px] font-bold text-[#4f46e5] uppercase mt-2 tracking-widest">
                                    {letterData?.jobTitle}
                                </p>
                            </div>
                            <div className="text-right text-[11px] font-medium space-y-1 text-[#64748b]">
                                {letterData?.email && <p className="text-[#0f172a] font-bold">{letterData?.email}</p>}
                                {letterData?.contact && <p className="text-[#0f172a] font-bold">{letterData?.contact}</p>}
                            </div>
                        </header>

                        {/* Date & Company Info */}
                        <div className="mb-10">
                            <p className="text-[13px] font-bold text-[#1e293b] mb-6">{today}</p>

                            <div className="text-[13px]">
                                <p className="font-black uppercase text-[#64748b] text-[10px] mb-1 tracking-widest">To</p>
                                <p className="font-bold text-[#0f172a] text-[15px]">Hiring Manager</p>
                                <p className="text-[#475569]">{letterData?.companyName || "[Target Company Name]"}</p>
                            </div>
                        </div>

                        {/* Subject Line */}
                        <div className="mb-8 py-3 px-4 bg-[#f8fafc] border-l-4 border-[#1e293b]">
                            <p className="text-[14px] font-bold text-[#0f172a]">
                                RE: Application for {letterData?.jobTitle || "the Position"}
                            </p>
                        </div>

                        {/* Main Content */}
                        <div className="text-[13px] leading-[1.8] text-[#334155] space-y-6">
                            <p className="font-bold text-[#0f172a]">Dear Hiring Manager,</p>

                            {/* Content with proper paragraph handling */}
                            <div className="whitespace-pre-wrap text-justify">
                                {letterData?.content || "Please provide your cover letter content to see the preview here. A professional cover letter explains why you are the best fit for the role by highlighting your key achievements and passion for the company."}
                            </div>
                        </div>

                        {/* Sign Off Section */}
                        <div className="mt-16 flex flex-col items-start">
                            <p className="text-[#64748b] font-medium mb-2">Sincerely,</p>

                            <div className="group">
                                {/* Signature  */}
                                <p className="italic font-serif text-[26px] text-[#1e293b] leading-none py-2">
                                    {letterData?.name}
                                </p>

                                {/* Divider line */}
                                <div className="w-40 h-[1.5px] bg-[#1e293b] mb-3 opacity-30"></div>

                                {/* Printed Name */}
                                <p className="font-black text-[13px] uppercase tracking-widest text-[#0f172a]">
                                    {letterData?.name}
                                </p>

                                {/* Add Job Title*/}
                                <p className="text-[11px] text-[#64748b] font-medium uppercase tracking-tighter">
                                    {letterData?.jobTitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    } else {

        const { contactInfo, summary, experience, education, projects, skills } = data;
        const userSkills = skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [];

        const formatUrl = (url) => {
            if (!url) return '';
            return url.startsWith('http') ? url : `https://${url}`;
        };

        const renderContactLinks = (variant) => {
            const links = [
                contactInfo?.email && { label: contactInfo.email, href: `mailto:${contactInfo.email}` },
                contactInfo?.mobile && { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` },
                contactInfo?.linkedin && { label: 'LinkedIn', href: formatUrl(contactInfo.linkedin) },
                contactInfo?.twitter && { label: 'Twitter', href: formatUrl(contactInfo.twitter) },
                contactInfo?.portfolio && { label: 'Portfolio', href: formatUrl(contactInfo.portfolio) },
            ].filter(Boolean);

            return links.map((link, idx) => (
                <React.Fragment key={idx}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {link.label}
                    </a>
                    {idx < links.length - 1 && (
                        <span className="mx-2 opacity-50">{variant === 'academic' ? '•' : '|'}</span>
                    )}
                </React.Fragment>
            ));
        };

        // --- TEMPLATE 1: PREMIUM ATS ---
        const renderATS = () => {
            const sectionHeader = "text-[14px] font-sans font-bold text-[#111827] border-b border-[#111827] mb-2 mt-4 uppercase tracking-widest";
            return (
                <div id="resume-ats" className="bg-white p-[45px_55px] max-w-[210mm] mx-auto min-h-[297mm] text-[#374151] leading-[1.4] font-sans text-[10pt]">
                    <header className="mb-5">
                        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">{user?.fullName}</h1>
                        <div className="text-[11px] text-[#4B5563] flex flex-wrap gap-y-1 mt-1 font-medium border-t border-gray-100 pt-2 uppercase">
                            {renderContactLinks('ats')}
                        </div>
                    </header>

                    {summary && (
                        <section className="mb-4">
                            <h2 className={sectionHeader}>Summary</h2>
                            <p className="text-[10.5pt] leading-relaxed">{summary}</p>
                        </section>
                    )}

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Experience</h2>
                        {experience?.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-baseline font-bold text-[#111827]">
                                    <span className="text-[11pt]">{exp?.organization}</span>
                                    <span className="text-[10pt] font-medium">{exp?.startDate} — {exp?.endDate}</span>
                                </div>
                                <div className="italic font-medium text-[#4B5563] mb-1">{exp?.title}</div>
                                <p className="text-[10.5pt]">{exp?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Projects</h2>
                        {projects?.map((proj, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex justify-between items-baseline font-bold text-[#111827]">
                                    <span>{proj?.title}</span>
                                    <div className="flex gap-3 text-[9px]">
                                        {proj?.githubLink && <a href={formatUrl(proj.githubLink)} className="underline">GitHub</a>}
                                        {proj?.liveLink && <a href={formatUrl(proj.liveLink)} className="underline">Live Demo</a>}
                                    </div>
                                </div>
                                <p className="text-[10.5pt]">{proj?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Education</h2>
                        {education?.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between items-baseline font-bold text-[#111827]">
                                    <span>{edu?.organization}</span>
                                    <span className="text-[10pt] font-medium">{edu?.startDate} — {edu?.endDate}</span>
                                </div>
                                <div className="text-[#4B5563] italic">{edu?.title}</div>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Skills</h2>
                        <p className="text-[10.5pt] font-medium tracking-tight text-[#374151]">
                            {userSkills.map(s => s.trim()).join(' • ')}
                        </p>
                    </section>
                </div>
            );
        };

        // --- TEMPLATE 2: ACADEMIC ---
        const renderAcademic = () => {
            const sectionHeaderClass = "text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase tracking-wider text-[#0f172a]";
            return (
                <div id="resume-academic" className="bg-white p-[35px_45px] max-w-[210mm] mx-auto min-h-[297mm] text-[#334155] leading-normal font-sans text-[10.5pt]">
                    <header className="mb-4 text-center">
                        <h1 className="text-[24px] font-serif font-semibold underline underline-offset-[6px] mb-1 uppercase text-[#0f172a] tracking-tight">{user?.fullName}</h1>
                        <p className="text-[14px] capitalize italic text-black font-serif mb-1.5">{contactInfo?.profession}</p>
                        <div className="text-[10px] text-black font-medium flex justify-center items-center flex-wrap font-sans uppercase">
                            {renderContactLinks('academic')}
                        </div>
                    </header>

                    {summary && (
                        <section className="mb-2">
                            <h2 className={sectionHeaderClass}>Profile Summary</h2>
                            <p className="text-justify text-[12.5px] text-[#475569] font-normal m-0">{summary}</p>
                        </section>
                    )}

                    <section className="mb-2">
                        <h2 className={sectionHeaderClass}>Education</h2>
                        {education?.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between font-semibold text-[#1e293b]">
                                    <span className="text-[13.5px]">{edu?.organization}</span>
                                    <span className="text-[#4f46e5] text-[10px]">{edu?.startDate} – {edu?.endDate}</span>
                                </div>
                                <div className="text-[#64748b] italic text-[12px]">{edu?.title}</div>
                            </div>
                        ))}
                    </section>

                    <section className="mb-2">
                        <h2 className={sectionHeaderClass}>Experience</h2>
                        {experience?.map((exp, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex justify-between font-semibold text-[#1e293b]">
                                    <span className="text-[13.5px]">{exp?.organization}</span>
                                    <span className="text-[9px] bg-[#f0f4ff] text-[#4f46e5] px-1.5 py-0.5 rounded">{exp?.startDate} – {exp?.endDate}</span>
                                </div>
                                <div className="text-[#4f46e5] uppercase text-[10px] font-bold mb-1 tracking-wider">{exp?.title}</div>
                                <p className="text-[12.5px] border-l-2 border-[#e2e8f0] pl-3 text-justify">{exp?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-2">
                        <h2 className={sectionHeaderClass}>Projects</h2>
                        {projects?.map((proj, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-semibold text-[#1e293b]">{proj?.title}</span>
                                    <div className="flex gap-2 text-[9px] font-bold text-[#4f46e5]">
                                        {proj?.githubLink && <a href={formatUrl(proj.githubLink)}>GitHub</a>}
                                        {proj?.liveLink && <a href={formatUrl(proj.liveLink)}>Live</a>}
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#475569] italic">{proj?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-3">
                        <h2 className={sectionHeaderClass}>Skills</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {userSkills.map((skill, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] border border-[#e2e8f0] font-semibold text-[#334155] uppercase">{skill.trim()}</span>
                            ))}
                        </div>
                    </section>
                </div>
            );
        };

        // --- TEMPLATE 3: CORPORATE SLATE ---
        const renderCorporate = () => {
            const sectionHeader = "text-[15px] font-sans font-black mt-4 mb-2 pb-1 uppercase tracking-tighter text-[#1e293b] border-b-2 border-[#e2e8f0]";
            return (
                <div id="resume-corporate" className="bg-white p-[35px_45px] max-w-[210mm] mx-auto min-h-[297mm] text-[#334155] leading-normal font-sans text-[10.5pt]">
                    <header className="mb-6 border-l-8 border-[#4f46e5] pl-5">
                        <h1 className="text-[24px] font-sans font-black tracking-tighter uppercase text-[#0f172a]">{user?.fullName}</h1>
                        <p className="text-[14px] font-bold text-[#4f46e5] uppercase mb-2">{contactInfo?.profession}</p>
                        <div className="text-[10px] text-[#64748b] flex flex-wrap gap-y-1 font-bold uppercase">
                            {renderContactLinks('corporate')}
                        </div>
                    </header>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Experience</h2>
                        {experience?.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[13.5px] font-bold text-[#0f172a] underline decoration-[#cbd5e1] underline-offset-4">{exp?.organization}</span>
                                    <span className="text-[9px] font-bold text-[#4f46e5] uppercase">{exp?.startDate} – {exp?.endDate}</span>
                                </div>
                                <div className="text-[#64748b] text-[10px] font-bold uppercase italic mb-1">{exp?.title}</div>
                                <p className="text-[12.5px] border-l-2 border-[#f1f5f9] pl-3">{exp?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Projects</h2>
                        {projects?.map((proj, i) => (
                            <div key={i} className="mb-3 border-l-2 border-[#4f46e5] pl-3">
                                <div className="flex justify-between font-bold text-[#1e293b] text-[13.5px]">
                                    <span>{proj?.title}</span>
                                    <div className="flex gap-2 text-[9px] uppercase">
                                        {proj?.githubLink && <a href={formatUrl(proj.githubLink)} className="text-[#4f46e5]">Source</a>}
                                        {proj?.liveLink && <a href={formatUrl(proj.liveLink)} className="text-[#4f46e5]">Live</a>}
                                    </div>
                                </div>
                                <p className="text-[12.5px] mt-1">{proj?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Education</h2>
                        {education?.map((edu, i) => (
                            <div key={i} className="flex justify-between mb-2">
                                <div><div className="font-bold text-[#1e293b]">{edu?.organization}</div><div className="text-[12px] italic">{edu?.title}</div></div>
                                <div className="text-[10px] font-bold text-[#4f46e5] uppercase">{edu?.startDate} – {edu?.endDate}</div>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Skills</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {userSkills.map((s, i) => <span key={i} className="px-2.5 py-1 text-[10px] bg-[#1e293b] font-bold text-white uppercase">{s.trim()}</span>)}
                        </div>
                    </section>
                </div>
            );
        };

        // --- TEMPLATE 4: EXECUTIVE CHARCOAL ---
        const renderExecutive = () => {
            const sectionHeader = "text-[15px] font-serif font-bold text-center mt-6 mb-4 text-[#334155] flex items-center before:content-[''] before:flex-1 before:border-b before:mr-4 after:content-[''] after:flex-1 after:border-b after:ml-4 after:border-[#d4d4d8] before:border-[#d4d4d8] uppercase tracking-[0.15em]";
            return (
                <div id="resume-executive" className="bg-white p-[35px_45px] max-w-[210mm] mx-auto min-h-[297mm] text-[#3f3f46] font-serif text-[10.5pt]">
                    <header className="text-center mb-8">
                        <h1 className="text-[28px] font-light tracking-tight text-[#18181b]">{user?.fullName}</h1>
                        <div className="text-[11px] font-sans uppercase tracking-[0.3em] text-[#a1a1aa] mb-3">{contactInfo?.profession}</div>
                        <div className="flex justify-center gap-x-1 text-[10px] font-sans text-[#71717a] border-y border-[#f4f4f5] py-2 uppercase">
                            {renderContactLinks('executive')}
                        </div>
                    </header>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>History</h2>
                        {experience?.map((exp, i) => (
                            <div key={i} className="mb-5">
                                <div className="flex justify-between items-end mb-1">
                                    <div className="text-[14px] font-bold text-[#18181b]">{exp?.title}</div>
                                    <div className="text-[10px] font-sans font-bold text-[#a16207] tracking-widest">{exp?.startDate} — {exp?.endDate}</div>
                                </div>
                                <div className="text-[12px] text-[#71717a] font-sans font-semibold uppercase mb-2">{exp?.organization}</div>
                                <p className="text-[12.5px] text-justify leading-relaxed">{exp?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Key Projects</h2>
                        {projects?.map((proj, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-[#18181b] italic">{proj?.title}</span>
                                    <div className="flex gap-3 text-[9px] font-sans font-bold text-[#a16207] uppercase">
                                        {proj?.githubLink && <a href={formatUrl(proj.githubLink)}>Repo</a>}
                                        {proj?.liveLink && <a href={formatUrl(proj.liveLink)}>Live</a>}
                                    </div>
                                </div>
                                <p className="text-[12px] italic pr-4 border-r-2 border-[#f4f4f5] text-right">{proj?.description}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Education</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {education?.map((edu, i) => (
                                <div key={i} className="border-l border-[#d4d4d8] pl-4">
                                    <div className="font-bold text-[#18181b] text-[13px]">{edu?.organization}</div>
                                    <div className="text-[11px] italic text-[#a16207]">{edu?.title}</div>
                                    <div className="text-[9px] font-sans font-bold text-[#a1a1aa] mt-1">{edu?.startDate} — {edu?.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-4">
                        <h2 className={sectionHeader}>Expertise</h2>
                        <div className="text-center text-[11.5px] font-sans uppercase tracking-widest leading-loose">
                            {userSkills.map((s, i) => <span key={i}>{s.trim()}{i < userSkills.length - 1 && <span className="mx-2 text-[#d4d4d8]">/</span>}</span>)}
                        </div>
                    </section>
                </div>
            );
        };

        return (
            <div className="min-h-screen py-12 px-4">
                <div className="shadow-[0_0_50px_rgba(0,0,0,0.1)]">
                    {mode === 'letter' ? (
                        renderCoverLetter()
                    ) : (
                        <>
                            {activeStyle === 'ats' && renderATS()}
                            {activeStyle === 'academic' && renderAcademic()}
                            {activeStyle === 'corporate' && renderCorporate()}
                            {activeStyle === 'executive' && renderExecutive()}
                        </>
                    )}
                </div>
            </div>
        );

    }
};

export default Template;






// import React from 'react';

// const ResumeTemplate = ({ data, user }) => {
//     const { contactInfo, summary, experience, education, projects, skills } = data;
//     const userSkills = skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [];

//     const formatUrl = (url) => {
//         if (!url) return '';
//         return url.startsWith('http') ? url : `https://${url}`;
//     };

//     const renderHeader = () => {
//         const links = [
//             contactInfo?.email ? { label: contactInfo.email, href: `mailto:${contactInfo.email}` } : null,
//             contactInfo?.mobile ? { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` } : null,
//             contactInfo?.twitter ? { label: contactInfo.twitter.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.twitter) } : null,
//             contactInfo?.linkedin ? { label: contactInfo.linkedin.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.linkedin) } : null,
//             contactInfo?.portfolio ? { label: contactInfo.portfolio.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.portfolio) } : null,
//         ].filter(Boolean);

//         return (
//             <header className="mb-4 text-center">
//                 {/* Main Heading - Georgia */}
//                 <h1 className="text-[24px] font-serif font-semibold underline underline-offset-[6px] mb-1 uppercase text-[#0f172a] tracking-tight">
//                     {user?.fullName || "Your Name"}
//                 </h1>
//                 <p className="text-[14px] capitalize italic text-black font-serif mb-1.5">
//                     {contactInfo?.profession || ''}
//                 </p>
//                 {/* Contact Bar - Inter */}
//                 <div className="text-[10px] text-black font-medium flex justify-center items-center flex-wrap gap-y-1 font-sans uppercase">
//                     {links.map((link, idx) => (
//                         <React.Fragment key={idx}>
//                             <a href={link.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
//                                 {link.label}
//                             </a>
//                             {idx < links.length - 1 && (
//                                 <span className="mx-1.5 font-bold text-black">•</span>
//                             )}
//                         </React.Fragment>
//                     ))}
//                 </div>
//             </header>
//         );
//     };

//     // Global Section Header Style
//     const sectionHeaderClass = "text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase tracking-wider text-[#0f172a]";

//     return (
//         <div
//             id="resume-pdf"
//             className="bg-white p-[35px_45px] shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] text-[#334155] leading-[1.5] font-sans text-[10.5pt]"
//             style={{ fontFamily: "'Inter', sans-serif" }}
//         >
//             {renderHeader()}

//             {/* Profile Summary */}
//             {summary && (
//                 <section className="mb-2">
//                     <h2 className={sectionHeaderClass}>Profile Summary</h2>
//                     <p className="text-justify text-[12.5px] text-[#475569] font-normal whitespace-pre-wrap m-0">
//                         {summary}
//                     </p>
//                 </section>
//             )}

//             {/* Experience */}
//             {experience?.length > 0 && (
//                 <section className="mb-2">
//                     <h2 className={sectionHeaderClass}>Professional Experience</h2>
//                     <div className="space-y-3">
//                         {experience.map((exp, idx) => (
//                             <div key={idx} className="break-inside-avoid">
//                                 <div className="flex justify-between items-baseline mb-0.5">
//                                     <span className="text-[13.5px] font-semibold text-[#1e293b]">{exp?.organization}</span>
//                                     <span className="text-[9px] font-semibold text-[#4f46e5] bg-[#f0f4ff] px-1.5 py-0.5 rounded">
//                                         {exp?.startDate} – {exp?.endDate}
//                                     </span>
//                                 </div>
//                                 <div className="text-[#4f46e5] font-semibold uppercase text-[10px] tracking-widest mb-1">
//                                     {exp?.title}
//                                 </div>
//                                 <p className="text-[#475569] text-[12.5px] border-l-2 border-[#e2e8f0] pl-3 m-0">
//                                     {exp?.description}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             )}

//             {/* Education */}
//             {education?.length > 0 && (
//                 <section className="mb-2">
//                     <h2 className={sectionHeaderClass}>Education</h2>
//                     <div className="space-y-2">
//                         {education.map((edu, idx) => (
//                             <div key={idx} className="break-inside-avoid">
//                                 <div className="flex justify-between items-baseline mb-0.5">
//                                     <span className="text-[13.5px] font-semibold text-[#1e293b]">{edu?.organization}</span>
//                                     <span className="text-[9px] font-semibold text-[#4f46e5] bg-[#f0f4ff] px-1.5 py-0.5 rounded">
//                                         {edu?.startDate} – {edu?.endDate}
//                                     </span>
//                                 </div>
//                                 <div className="text-[#64748b] italic text-[12px] font-medium">{edu?.title}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             )}

//             {/* Skills */}
//             {userSkills.length > 0 && (
//                 <section className="mb-3">
//                     <h2 className={sectionHeaderClass}>Technical Competencies</h2>
//                     <div className="flex flex-wrap gap-1.5">
//                         {userSkills.map((skill, i) => (
//                             <span key={i} className="px-2.5 py-1 rounded-[4px] text-[10px] border border-[#e2e8f0] font-semibold text-[#334155] uppercase">
//                                 {skill.trim()}
//                             </span>
//                         ))}
//                     </div>
//                 </section>
//             )}

//             {/* Projects */}
//             {projects?.length > 0 && (
//                 <section className="mb-2">
//                     <h2 className={sectionHeaderClass}>Strategic Projects</h2>
//                     <div className="space-y-3">
//                         {projects.map((proj, idx) => (
//                             <div key={idx} className="break-inside-avoid">
//                                 <div className="flex justify-between items-baseline mb-0.5">
//                                     <span className="text-[13.5px] font-semibold text-[#1e293b] tracking-wide">
//                                         {proj?.title}
//                                     </span>
//                                 </div>
//                                 <div className="flex gap-3 my-1">
//                                     {proj?.githubLink && (
//                                         <a href={formatUrl(proj.githubLink)} target="_blank" rel="noopener noreferrer" style={{color: '#4f46e5'}} className="text-[9px] text-[#4f46e5] font-bold uppercase cursor-pointer flex items-center gap-1">
//                                             🔗 GitHub
//                                         </a>
//                                     )}
//                                     {proj?.liveLink && (
//                                         <a href={formatUrl(proj.liveLink)} target="_blank" rel="noopener noreferrer" className="text-[9px] text-[#4f46e5] font-bold uppercase cursor-pointer flex items-center gap-1">
//                                             🌐 Live Demo
//                                         </a>
//                                     )}
//                                 </div>
//                                 <p className="text-[#475569] text-[12.5px] border-l-2 border-[#e2e8f0] pl-3 m-0">
//                                     {proj?.description}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             )}
//         </div>
//     );
// };

// export default ResumeTemplate;