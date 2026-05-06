import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScoreBadge from "./ScoreBadge";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Target, 
  Wrench, 
  Zap, 
  Lightbulb,
  Check,
  Plus
} from "lucide-react";

const CategoryHeader = ({ title, categoryScore }) => {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case "tone & style": return <Zap className="w-5 h-5 text-indigo-500" />;
      case "content": return <Target className="w-5 h-5 text-blue-500" />;
      case "structure": return <Sparkles className="w-5 h-5 text-purple-500" />;
      case "skills": return <Wrench className="w-5 h-5 text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-center gap-4 py-1">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-xs group-hover:bg-white transition-colors">
        {getIcon()}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <p className="text-lg font-black text-slate-900 tracking-tight">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
    </div>
  );
};

const CategoryContent = ({ tips, matchedSkills, missingSkills, skillImprovementAdvice, recommendedNewSkillsAndTools }) => (
  <div className="flex flex-col gap-8 w-full py-4 px-2">
    
    {/* Summary grid for desktop */}
    {tips && tips.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <div 
            key={i} 
            className={cn(
              "flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg h-full",
              tip.type === "good" 
                ? "bg-emerald-50/30 border-emerald-100 group/tip hover:bg-emerald-50" 
                : "bg-amber-50/30 border-amber-100 group/tip hover:bg-amber-50"
            )}
          >
            <div className={cn(
              "shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover/tip:scale-110",
              tip.type === "good" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
            )}>
              {tip.type === "good" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="space-y-1.5 flex-1">
              <p className={cn(
                "text-sm font-black uppercase tracking-widest",
                tip.type === "good" ? "text-emerald-700" : "text-amber-700"
              )}>
                {tip.tip}
              </p>
              <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                {tip.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Skills matched/missing grid */}
    {(matchedSkills?.length > 0 || missingSkills?.length > 0) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matchedSkills && matchedSkills.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Perfect Match</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
               <div className="flex flex-wrap gap-2">
                 {matchedSkills.map((skill, i) => (
                   <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black border border-emerald-100/50">
                      <Check className="w-3 h-3 shrink-0" />
                      {skill}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {missingSkills && missingSkills.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Opportunities for Growth</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
               <div className="flex flex-wrap gap-2">
                 {missingSkills.map((skill, i) => (
                   <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-black border border-rose-100/50">
                      <Plus className="w-3 h-3 shrink-0 rotate-45" />
                      {skill}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Skill Improvement Advice */}
    {skillImprovementAdvice && skillImprovementAdvice.length > 0 && (
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          Strategic Growth Path
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {skillImprovementAdvice.map((item, i) => (
            <div key={i} className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700" />
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-white/10 rounded-xl text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
                      Priority Target
                    </span>
                    <p className="text-2xl font-black text-white tracking-tight">{item.skill}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">The Challenge</p>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed italic">&quot;{item.reason}&quot;</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">The Strategy</p>
                      <p className="text-sm font-bold text-white leading-relaxed">{item.howToImprove}</p>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Recommended New Skills & Tools */}
    {recommendedNewSkillsAndTools && recommendedNewSkillsAndTools.length > 0 && (
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
           <Zap className="w-6 h-6 text-indigo-600" />
           Recommended Tools & Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedNewSkillsAndTools.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-black text-slate-900 tracking-tight">{item.name}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed pl-11">
                {item.whyImportant}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const Details = ({ feedback }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Accordion type="single" collapsible className="space-y-6">
        <AccordionItem value="tone-style" className="border-0 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all px-8 overflow-hidden">
          <AccordionTrigger className="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-400 py-6 hover:no-underline group">
            <CategoryHeader title="Tone & Style" categoryScore={feedback.aiFeedback.toneAndStyle.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.aiFeedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="content" className="border-0 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all px-8 overflow-hidden">
          <AccordionTrigger className="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-400 py-6 hover:no-underline group">
            <CategoryHeader title="Content" categoryScore={feedback.aiFeedback.content.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.aiFeedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="structure" className="border-0 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all px-8 overflow-hidden">
          <AccordionTrigger className="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-400 py-6 hover:no-underline group">
            <CategoryHeader title="Structure" categoryScore={feedback.aiFeedback.structure.score} />
          </AccordionTrigger>
          <AccordionContent>
            <CategoryContent tips={feedback.aiFeedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border-0 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all px-8 overflow-hidden">
          <AccordionTrigger className="[&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-slate-400 py-6 hover:no-underline group">
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
