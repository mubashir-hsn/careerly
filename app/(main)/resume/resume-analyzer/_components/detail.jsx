import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScoreBadge from "./ScoreBadge";
import { cn } from "@/lib/utils";

const CategoryHeader = ({ title, categoryScore }) => (
  <div className="flex flex-row gap-4 items-center py-2">
    <p className="text-xl">{title}</p>
    <ScoreBadge score={categoryScore} />
  </div>
);

const CategoryContent = ({ tips, matchedSkills, missingSkills, skillImprovementAdvice, recommendedNewSkillsAndTools }) => (
  <div className="flex flex-col gap-4 w-full">

    {/* Tips section */}
    <div className="w-full px-5 py-4 text-justify hidden md:grid md:grid-cols-2 gap-4">
      {tips?.map((tip, i) => (
        <div className="flex flex-row gap-3 items-center justify-start bg-slate-100 rounded-lg p-2" key={i}>
          <img
            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-6"
          />
          <p className="text-[16px] font-semibold text-gray-500 text-justify">{tip.tip}</p>
        </div>
      ))}
    </div>

    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Matched Skills */}
    {matchedSkills && matchedSkills.length > 0 && (
      <div className="bg-green-100 w-full p-3 rounded-md">
        <p className="font-semibold text-green-800 text-lg mb-1">Matched Skills</p>
        <ul className="list-disc list-inside text-green-700">
          {matchedSkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Missing Skills */}
    {missingSkills && missingSkills.length > 0 && (
      <div className="bg-red-100 w-full p-3 rounded-md">
        <p className="font-semibold text-red-800 text-lg mb-1">Missing Skills</p>
        <ul className="list-disc list-inside text-red-700">
          {missingSkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    )}
    </div>

    {/* Skill Improvement Advice */}
    {skillImprovementAdvice && skillImprovementAdvice.length > 0 && (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-yellow-800 mb-2">How To Improve</p>
        {skillImprovementAdvice.map((item, i) => (
          <div key={i} className="mb-3">
            <p><span className="font-semibold">Skill:</span> {item.skill}</p>
            <p><span className="font-semibold">Reason:</span> {item.reason}</p>
            <p><span className="font-semibold">How To Improve:</span> {item.howToImprove}</p>
          </div>
        ))}
      </div>
    )}

    {/* Recommended New Skills & Tools */}
    {recommendedNewSkillsAndTools && recommendedNewSkillsAndTools.length > 0 && (
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
        <p className="text-lg font-semibold text-blue-800 mb-2">Recommended Tools & Skills</p>
        {recommendedNewSkillsAndTools.map((item, i) => (
          <div key={i} className="mb-2">
            <p><span className="font-semibold">Name:</span> {item.name}</p>
            <p><span className="font-semibold">Why Important:</span> {item.whyImportant}</p>
          </div>
        ))}
      </div>
    )}

    {/* Detailed tips area */}
    <div className="flex flex-col gap-4 w-full">
      {tips?.map((tip, i) => (
        <div
          key={i + tip.tip}
          className={cn(
            "flex flex-col gap-2 rounded-2xl p-4",
            tip.type === "good"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-yellow-50 border border-yellow-200 text-yellow-700"
          )}
        >
          <div className="flex flex-row gap-2 items-center">
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt="score"
              className="size-5"
            />
            <p className="font-bold text-justify md:text-lg">{tip.tip}</p>
          </div>
          <p className="font-medium">{tip.explanation}</p>
        </div>
      ))}
    </div>
  </div>
);

const Details = ({ feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion type="single" collapsible className="space-y-4 border-b border-gray-200">

        <AccordionItem value="tone-style">
          <AccordionTrigger className={"[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer"}>
            <CategoryHeader title="Tone & Style" categoryScore={feedback.aiFeedback.toneAndStyle.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.aiFeedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="content">
          <AccordionTrigger className={"[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer"}>
            <CategoryHeader title="Content" categoryScore={feedback.aiFeedback.content.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.aiFeedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="structure">
          <AccordionTrigger className={"[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer"}>
            <CategoryHeader title="Structure" categoryScore={feedback.aiFeedback.structure.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.aiFeedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger className={"[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer"}>
            <CategoryHeader title="Skills" categoryScore={feedback.aiFeedback.skills.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent
              tips={feedback.aiFeedback.skills.tips}
              matchedSkills={feedback.aiFeedback.skills.matchedSkills}
              missingSkills={feedback.aiFeedback.skills.missingSkills}
              skillImprovementAdvice={feedback.aiFeedback.skills.skillImprovementAdvice}
              recommendedNewSkillsAndTools={feedback.aiFeedback.skills.recommendedNewSkillsAndTools}
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default Details;














// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import ScoreBadge from "./ScoreBadge";
// import { cn } from "@/lib/utils";


// // Category header
// const CategoryHeader = ({ title, categoryScore }) => (
//   <div className="flex flex-row gap-4 items-center py-2">
//     <p className="text-xl">{title}</p>
//     <ScoreBadge score={categoryScore} />
//   </div>
// );

// // Category content
// const CategoryContent = ({ tips, matchedSkills, missingSkills }) => (
//   <div className="flex flex-col gap-4 w-full">
//     <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
//       {tips.map((tip, i) => (
//         <div className="flex flex-row gap-2 items-center" key={i}>
//           <img
//             src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
//             alt="score"
//             className="size-5"
//           />
//           <p className="text-xl text-gray-500">{tip.tip}</p>
//         </div>
//       ))}
//     </div>

//     {
//       matchedSkills && <div className="bg-green-100 w-full p-2 rounded-md">
              
//       </div>
//     }

//     {
//       missingSkills && <div className="bg-red-100 p-2 rounded-md">

//       </div>
//     }

//     <div className="flex flex-col gap-4 w-full"> 
//       {tips.map((tip, i) => (
//         <div
//           key={i + tip.tip}
//           className={cn(
//             "flex flex-col gap-2 rounded-2xl p-4",
//             tip.type === "good"
//               ? "bg-green-50 border border-green-200 text-green-700"
//               : "bg-yellow-50 border border-yellow-200 text-yellow-700"
//           )}
//         >
//           <div className="flex flex-row gap-2 items-center">
//             <img
//               src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
//               alt="score"
//               className="size-5"
//             />
//             <p className="text-xl font-semibold">{tip.tip}</p>
//           </div>
//           <p>{tip.explanation}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Details = ({ feedback }) => {
//   return (
//     <div className="flex flex-col gap-4 w-full">
//       <Accordion type="single" collapsible className="space-y-4 border-b border-gray-200">
//         <AccordionItem value="tone-style">
//           <AccordionTrigger className={'[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer'}>
//             <CategoryHeader
//               title="Tone & Style"
//               categoryScore={feedback.toneAndStyle.score}
//             />
//           </AccordionTrigger>
//           <AccordionContent>
//             <CategoryContent tips={feedback.toneAndStyle.tips} />
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="content">
//           <AccordionTrigger className={'[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer'}>
//             <CategoryHeader
//               title="Content"
//               categoryScore={feedback.content.score}
//             />
//           </AccordionTrigger>
//           <AccordionContent>
//             <CategoryContent tips={feedback.content.tips} />
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="structure">
//           <AccordionTrigger className={'[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer'}>
//             <CategoryHeader
//               title="Structure"
//               categoryScore={feedback.structure.score}
//             />
//           </AccordionTrigger>
//           <AccordionContent>
//             <CategoryContent tips={feedback.structure.tips} />
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="skills">
//           <AccordionTrigger className={'[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-600 flex items-center font-normal hover:no-underline hover:cursor-pointer'}>
//             <CategoryHeader
//               title="Skills"
//               categoryScore={feedback.skills.score}
//             />
//           </AccordionTrigger>
//           <AccordionContent>
//             <CategoryContent tips={feedback.skills.tips} />
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// };

// export default Details;
