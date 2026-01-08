import React from 'react';

const ResumeTemplate = ({ data, user }) => {
    const { contactInfo, summary, experience, education, projects, skills } = data;
    const userSkills = skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [];

    const formatUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    };

    const renderHeader = () => {
        const links = [
            contactInfo?.email ? { label: contactInfo.email, href: `mailto:${contactInfo.email}` } : null,
            contactInfo?.mobile ? { label: contactInfo.mobile, href: `tel:${contactInfo.mobile}` } : null,
            contactInfo?.twitter ? { label: contactInfo.twitter.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.twitter) } : null,
            contactInfo?.linkedin ? { label: contactInfo.linkedin.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.linkedin) } : null,
            contactInfo?.portfolio ? { label: contactInfo.portfolio.replace(/^https?:\/\//, ''), href: formatUrl(contactInfo.portfolio) } : null,
        ].filter(Boolean);

        return (
            <header className="mb-4 text-center">
                {/* Main Heading - Georgia */}
                <h1 className="text-[24px] font-serif font-semibold underline underline-offset-[6px] mb-1 uppercase text-[#0f172a] tracking-tight">
                    {user?.fullName || "Your Name"}
                </h1>
                <p className="text-[14px] capitalize italic text-black font-serif mb-1.5">
                    {contactInfo?.profession || ''}
                </p>
                {/* Contact Bar - Inter */}
                <div className="text-[10px] text-black font-medium flex justify-center items-center flex-wrap gap-y-1 font-sans uppercase">
                    {links.map((link, idx) => (
                        <React.Fragment key={idx}>
                            <a href={link.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                {link.label}
                            </a>
                            {idx < links.length - 1 && (
                                <span className="mx-1.5 font-bold text-black">•</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </header>
        );
    };

    // Global Section Header Style
    const sectionHeaderClass = "text-[15px] font-serif font-bold border-b-[1.5px] border-[#cbd5e1] mt-4 mb-2 pb-0.5 uppercase tracking-wider text-[#0f172a]";

    return (
        <div 
            id="resume-pdf" 
            className="bg-white p-[35px_45px] shadow-2xl max-w-[210mm] mx-auto min-h-[297mm] text-[#334155] leading-[1.5] font-sans text-[10.5pt]"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {renderHeader()}

            {/* Profile Summary */}
            {summary && (
                <section className="mb-2">
                    <h2 className={sectionHeaderClass}>Profile Summary</h2>
                    <p className="text-justify text-[12.5px] text-[#475569] font-normal whitespace-pre-wrap m-0">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <section className="mb-2">
                    <h2 className={sectionHeaderClass}>Professional Experience</h2>
                    <div className="space-y-3">
                        {experience.map((exp, idx) => (
                            <div key={idx} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-[13.5px] font-semibold text-[#1e293b]">{exp?.organization}</span>
                                    <span className="text-[9px] font-semibold text-[#4f46e5] bg-[#f0f4ff] px-1.5 py-0.5 rounded">
                                        {exp?.startDate} – {exp?.endDate}
                                    </span>
                                </div>
                                <div className="text-[#4f46e5] font-semibold uppercase text-[10px] tracking-widest mb-1">
                                    {exp?.title}
                                </div>
                                <p className="text-[#475569] text-[12.5px] border-l-2 border-[#e2e8f0] pl-3 m-0">
                                    {exp?.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <section className="mb-2">
                    <h2 className={sectionHeaderClass}>Education</h2>
                    <div className="space-y-2">
                        {education.map((edu, idx) => (
                            <div key={idx} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-[13.5px] font-semibold text-[#1e293b]">{edu?.organization}</span>
                                    <span className="text-[9px] font-semibold text-[#4f46e5] bg-[#f0f4ff] px-1.5 py-0.5 rounded">
                                        {edu?.startDate} – {edu?.endDate}
                                    </span>
                                </div>
                                <div className="text-[#64748b] italic text-[12px] font-medium">{edu?.title}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {userSkills.length > 0 && (
                <section className="mb-3">
                    <h2 className={sectionHeaderClass}>Technical Competencies</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {userSkills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-[4px] text-[10px] border border-[#e2e8f0] font-semibold text-[#334155] uppercase">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <section className="mb-2">
                    <h2 className={sectionHeaderClass}>Strategic Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj, idx) => (
                            <div key={idx} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-[13.5px] font-semibold text-[#1e293b] tracking-wide">
                                        {proj?.title}
                                    </span>
                                </div>
                                <div className="flex gap-3 my-1">
                                    {proj?.githubLink && (
                                        <a href={formatUrl(proj.githubLink)} target="_blank" rel="noopener noreferrer" style={{color: '#4f46e5'}} className="text-[9px] text-[#4f46e5] font-bold uppercase cursor-pointer flex items-center gap-1">
                                            🔗 GitHub
                                        </a>
                                    )}
                                    {proj?.liveLink && (
                                        <a href={formatUrl(proj.liveLink)} target="_blank" rel="noopener noreferrer" className="text-[9px] text-[#4f46e5] font-bold uppercase cursor-pointer flex items-center gap-1">
                                            🌐 Live Demo
                                        </a>
                                    )}
                                </div>
                                <p className="text-[#475569] text-[12.5px] border-l-2 border-[#e2e8f0] pl-3 m-0">
                                    {proj?.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ResumeTemplate;