import PdfButton from '@/components/PdfButton';
import Template from '@/components/Templates';

const CoverLetterPreview = ({ coverLetter }) => {

  const data = {
    name: coverLetter.name,
    email: coverLetter.email,
    contact: coverLetter.contact,
    companyName: coverLetter.companyName,
    jobTitle: coverLetter.jobTitle,
    content: coverLetter.content
  }

  return (
    <div className='py-4 px-2 space-y-4'>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2 md:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {coverLetter?.jobTitle} <span className="text-slate-400 mx-1">at</span> {coverLetter?.companyName}
          </h1>
          <p className="text-slate-500 font-medium">
            Review and export your professional cover letter.
          </p>
        </div>

        <PdfButton
          data={data}
          user={coverLetter?.name}
          fileName={`${coverLetter?.name?.replace(/\s+/g, "_")}_CoverLetter.pdf`}
          activeStyle={'letter'}
        />
      </div>

      <div id='hideScrollbar' className='md:col-span-2 max-h-[42%] p-4 md:p-8 rounded-xl bg-gray-700 border-4 border-slate-300 overflow-hidden overflow-y-auto'>
        <Template letterData={data} mode={'letter'} />
      </div>
    </div>
  )
}

export default CoverLetterPreview