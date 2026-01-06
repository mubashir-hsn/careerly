const ResumeTemplate = ({ data, template, user }) => {
    const { contactInfo, summary, experience, education, projects, skills } = data;
    const userSkills = skills.split(',');

    const renderHeader = () => {
        const links = [
            contactInfo.email,
            contactInfo.mobile,
            contactInfo.twitter?.replace(/^https?:\/\//, ''),
            contactInfo.linkedin?.replace(/^https?:\/\//, '')
        ].filter(Boolean);

        switch (template) {
            case 'minimalist':
                return (
                    <header className="text-center mb-10 pb-6 border-b border-slate-100">
                        <h1 className="text-3xl font-extrabold uppercase tracking-[0.2em] text-slate-900 mb-2">{user?.fullName}</h1>
                        <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.3em] mb-4">{contactInfo?.jobTitle || 'Full Satck Developer'}</p>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9px] text-slate-500 font-mono uppercase">
                            {links.map((link, idx) => (
                                <span key={idx} className="flex items-center">
                                    {link}
                                    {idx < links.length - 1 && <span className="mx-3 text-slate-200">/</span>}
                                </span>
                            ))}
                        </div>
                    </header>
                );
            case 'executive':
                return (
                    <header className="mb-10 border-l-[3px] border-slate-900 pl-8 py-1">
                        <h1 className="text-4xl font-['Playfair_Display'] font-bold text-slate-900 leading-none mb-2">{user?.fullName}</h1>
                        <p className="text-xl text-slate-600 italic font-serif opacity-80 mb-4">
                            {contactInfo?.jobTitle || 'Full Satck Developer'}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {links.map((link, idx) => <span key={idx} className="border-b border-transparent hover:border-slate-300 transition-colors">{link}</span>)}
                        </div>
                    </header>
                );
            case 'academic':
                return (
                    <header className="mb-12 text-center">
                        <h1 className="text-2xl font-serif font-bold underline underline-offset-8 mb-4 tracking-tight uppercase text-slate-900">{user?.fullName}</h1>
                        <p className="text-sm italic text-slate-500 font-serif mb-4">{contactInfo?.jobTitle || 'Full Satck Developer'}</p>
                        <div className="text-[9px] text-slate-400 space-x-3 font-mono uppercase tracking-widest">
                            {links.map((link, idx) => (
                                <span key={idx}>
                                    {link} {idx < links.length - 1 && <span className="text-slate-200 mx-1">•</span>}
                                </span>
                            ))}
                        </div>
                    </header>
                );
            case 'classic':
                return (
                    <header className="text-center mb-10 border-b-2 border-slate-900 pb-6">
                        <h1 className="text-4xl font-['Playfair_Display'] font-bold text-slate-900 uppercase mb-2 tracking-tight">{user?.fullName}</h1>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
                            {links.map((link, idx) => (
                                <span key={idx} className="flex items-center">
                                    {link}
                                    {idx < links.length - 1 && <span className="mx-2 text-slate-400 font-bold">•</span>}
                                </span>
                            ))}
                        </div>
                    </header>
                );
            case 'technical':
                return (
                    <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-200 pb-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
                                {user?.fullName}</h1>
                            <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-sm">
                                {contactInfo?.jobTitle || 'Full Satck Developer'}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end text-[10px] font-mono text-slate-500 mt-4 md:mt-0 leading-relaxed">
                            {links.map((link, idx) => <span key={idx}>{link}</span>)}
                        </div>
                    </header>
                );
            default: // modern
                return (
                    <header className="mb-10 bg-[#f1f5f9] -m-12 p-12 border-b border-slate-200">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">{user?.fullName}</h1>
                        <p className="text-xl text-indigo-600 font-extrabold uppercase tracking-widest flex items-center gap-4">
                            {contactInfo?.jobTitle || 'Full Satck Developer'}
                            <span className="h-0.5 w-12 bg-indigo-200 rounded-full"></span>
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-slate-500 text-[10px] mt-8 font-bold uppercase tracking-[0.15em]">
                            <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm"><i className="fa-solid fa-envelope text-indigo-400 text-[10px]"></i>{contactInfo.email}</span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm"><i className="fa-solid fa-phone text-indigo-400 text-[10px]"></i>{contactInfo.phone}</span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm"><i className="fa-solid fa-location-dot text-indigo-400 text-[10px]"></i>{contactInfo.location}</span>
                            {contactInfo.website && <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm"><i className="fa-solid fa-globe text-indigo-400 text-[10px]"></i>{contactInfo.website.replace(/^https?:\/\//, '')}</span>}
                        </div>
                    </header>
                );
        }
    };

    const sectionHeaderClass = (() => {
        switch (template) {
            case 'executive':
                return "text-xl font-['Playfair_Display'] font-bold border-b border-slate-200 mb-6 pb-2 text-slate-900 flex items-center gap-4";
            case 'academic':
                return "text-base font-serif font-bold border-b-2 border-slate-900 mb-5 pb-1 uppercase tracking-widest text-slate-900";
            case 'classic':
                return "text-lg font-['Playfair_Display'] font-bold uppercase border-b border-slate-300 mb-4 pb-1 text-slate-900 tracking-wide";
            case 'technical':
                return "text-xs font-mono font-black uppercase tracking-[0.3em] border-l-4 border-indigo-600 mb-6 pl-4 text-slate-900";
            default: // modern & minimalist
                return "text-xs font-black uppercase tracking-[0.4em] border-b-2 border-slate-100 mb-6 pb-2 text-slate-400";
        }
    })();

    return (
        <div id="resume-pdf" className=" bg-white p-12 shadow-2xl max-w-[900px] mx-auto min-h-[11in] text-slate-800 leading-relaxed text-[10.5pt] transition-all duration-700">
            {renderHeader()}

            {summary && (
                <section className="mb-10">
                    <h2 className={sectionHeaderClass}>
                        {template === 'executive' && <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>}
                        Profile Summary
                    </h2>
                    <p className="text-justify leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{summary}</p>
                </section>
            )}

            {experience.length > 0 && (
                <section className="mb-10">
                    <h2 className={sectionHeaderClass}>
                        {template === 'executive' && <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>}
                        Professional Experience
                    </h2>
                    <div className="space-y-8">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`text-sm font-black uppercase tracking-tight text-slate-900 ${template === 'technical' ? 'font-mono' : ''}`}>{exp?.organization}</span>
                                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded">{exp?.startDate} – {exp?.endDate}</span>
                                </div>
                                <div className="text-indigo-600 font-bold mb-3 uppercase text-[9px] tracking-[0.2em]">{exp?.title}</div>
                                <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-slate-50 pl-4">{exp?.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education.length > 0 && (
                <section className="mb-10">
                    <h2 className={sectionHeaderClass}>
                        {template === 'executive' && <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>}
                        Education
                    </h2>
                    <div className="space-y-6">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`text-sm font-black text-slate-900 ${template === 'technical' ? 'font-mono' : ''}`}>{edu?.organization}</span>
                                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">{edu?.startDate} – {edu?.endDate}</span>
                                </div>
                                <div className="text-slate-500 italic text-[10pt] font-medium">{edu?.title}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {userSkills.length > 0 && (
                <section className="mb-10">
                    <h2 className={sectionHeaderClass}>
                        {template === 'executive' && <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>}
                        Technical Competencies
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {userSkills.map((skill, i) => (
                            <span key={i} className={`px-3 py-1 rounded text-[10px] border font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors ${template === 'technical' ? 'bg-indigo-50 border-indigo-100 text-indigo-900 font-mono' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {projects.length > 0 && (
                <section className="mb-10">
                    <h2 className={sectionHeaderClass}>
                        {template === 'executive' && <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>}
                        Strategic Projects
                    </h2>
                    <div className="space-y-6">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`text-sm font-black text-slate-900 tracking-tight ${template === 'technical' ? 'font-mono' : ''}`}>{proj?.title}</span>
                                    {/* <span className="font-mono text-[9px] text-indigo-600 uppercase font-black bg-indigo-50 px-2 py-0.5 rounded">{proj.technologies}</span> */}
                                </div>
                                <div className="flex gap-4 mb-2 no-print">
                                    {proj?.githubLink && <a href={proj?.githubLink || '#'} target="_blank" className="text-[8px] text-slate-400 hover:text-indigo-600 uppercase font-black tracking-widest transition-colors"><i className="fa-brands fa-github mr-1"></i>Repository</a>}
                                    {proj?.liveLink && <a href={proj?.liveLink || '#'} target="_blank" className="text-[8px] text-slate-400 hover:text-indigo-600 uppercase font-black tracking-widest transition-colors"><i className="fa-solid fa-link mr-1"></i>Deployment</a>}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-slate-50 pl-4">{proj?.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ResumeTemplate;

