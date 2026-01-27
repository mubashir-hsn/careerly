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
      <div className='flex justify-between items-center gap-3'>
        <h1 className='font-bold capitalize text-2xl md:text-3xl gradient-subtitle pl-3 md:pl-0'>
          {coverLetter?.jobTitle}
          <span className='lowercase px-1'>at</span>
          <span className='text-blue-500'>{coverLetter?.companyName}</span>
        </h1>

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