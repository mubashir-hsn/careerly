export default function ResumeTemplateServer({ data, template, user }) {
    const { contactInfo, summary, experience, education, projects, skills } = data;
    const userSkills = skills.split(',').map(s => s.trim());
  
    const links = [
      contactInfo.email,
      contactInfo.mobile,
      contactInfo.twitter?.replace(/^https?:\/\//, ''),
      contactInfo.linkedin?.replace(/^https?:\/\//, '')
    ].filter(Boolean).join(' | ');
  
    // Count total items to scale font
    const totalItems = summary ? 1 : 0
      + (experience?.length || 0)
      + (education?.length || 0)
      + (projects?.length || 0)
      + (userSkills?.length || 0);
  
    // Dynamic font size scaling
    let baseFontSize = 10.5; // default in pt
    if (totalItems > 20) baseFontSize = 9.5;
    else if (totalItems > 30) baseFontSize = 8.5;
    else if (totalItems > 40) baseFontSize = 8;
  
    const sectionSpacing = baseFontSize > 9 ? '8px' : '4px';
    const smallFont = `font-size:${baseFontSize}pt; line-height:1.15;`;
  
    const renderList = (items, type) => items.map(item => {
      if (!item) return '';
      if (type === "experience") {
        return `<div style="margin-bottom:${sectionSpacing};">
          <strong style="font-size:${baseFontSize}pt;">${item.title}</strong> @ ${item.organization}
          <span style="float:right;font-size:${baseFontSize - 2}pt;color:#6b7280;">${item.startDate} – ${item.endDate}</span>
          <p style="margin:2px 0 0 4px; ${smallFont} color:#374151;">${item.description}</p>
        </div>`;
      }
      if (type === "education") {
        return `<div style="margin-bottom:${sectionSpacing};">
          <strong style="font-size:${baseFontSize}pt;">${item.title}</strong> @ ${item.organization}
          <span style="float:right;font-size:${baseFontSize - 2}pt;color:#6b7280;">${item.startDate} – ${item.endDate}</span>
        </div>`;
      }
      if (type === "projects") {
        return `<div style="margin-bottom:${sectionSpacing};">
          <strong style="font-size:${baseFontSize}pt;">${item.title}</strong>
          <p style="margin:2px 0 0 4px; ${smallFont} color:#374151;">${item.description}</p>
        </div>`;
      }
    }).join('');
  
    const experienceHtml = renderList(experience || [], "experience");
    const educationHtml = renderList(education || [], "education");
    const projectsHtml = renderList(projects || [], "projects");
  
    const skillsHtml = userSkills.map(skill => `
      <span style="display:inline-block;margin:1px 3px;padding:2px 4px;font-size:${baseFontSize - 1}pt;background:#f3f4f6;border-radius:4px;">
        ${skill}
      </span>`).join('');
  
    // Header styles
    const headerStyle = `
      text-align:center;margin-bottom:${sectionSpacing};
      h1{font-size:${baseFontSize + 5}pt;margin:0;font-family:'Playfair Display', serif;font-weight:bold;}
      p{margin:2px 0;color:#6b7280;font-size:${baseFontSize}pt;}
    `;
  
    const sectionTitle = `font-weight:bold;margin:4px 0 2px 0;border-bottom:1px solid #e2e8f0;padding-bottom:2px;font-size:${baseFontSize + 1}pt;`;
  
    return `
      <div style="width:100%; padding:12px; background:white; font-family:'Playfair Display', serif; font-size:${baseFontSize}pt; color:#111827;">
        <div style="${headerStyle}">
          <h1>${user?.fullName}</h1>
          <p>${contactInfo?.jobTitle || 'Full Stack Developer'}</p>
          <p style="font-size:${baseFontSize - 1}pt;color:#6b7280;">${links}</p>
        </div>
  
        ${summary ? `<div style="margin-bottom:${sectionSpacing};">
          <div style="${sectionTitle}">Profile Summary</div>
          <p style="${smallFont} color:#374151;">${summary}</p>
        </div>` : ''}
  
        ${experienceHtml ? `<div style="margin-bottom:${sectionSpacing};">
          <div style="${sectionTitle}">Professional Experience</div>
          ${experienceHtml}
        </div>` : ''}
  
        ${educationHtml ? `<div style="margin-bottom:${sectionSpacing};">
          <div style="${sectionTitle}">Education</div>
          ${educationHtml}
        </div>` : ''}
  
        ${skillsHtml ? `<div style="margin-bottom:${sectionSpacing};">
          <div style="${sectionTitle}">Skills</div>
          <div>${skillsHtml}</div>
        </div>` : ''}
  
        ${projectsHtml ? `<div style="margin-bottom:${sectionSpacing};">
          <div style="${sectionTitle}">Projects</div>
          ${projectsHtml}
        </div>` : ''}
      </div>
    `;
  }
  