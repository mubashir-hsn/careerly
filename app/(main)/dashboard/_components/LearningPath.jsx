import React from 'react'
import {
    GraduationCap,
    BookOpen,
    PlayCircle,
    ExternalLink,
} from 'lucide-react';

const LearningPath = ({ learningPaths }) => {
    return (
        <section className="pt-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Personalized Learning Paths
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Curated resources to close skill gaps
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {learningPaths.map((path, idx) => (
                    <div
                        key={idx}
                        className="glass rounded-3xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-indigo-50/60 border-b border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {path.path}
                                </h3>
                                <span className="px-3 py-1 bg-white text-indigo-500 rounded-full text-xs font-bold">
                                    {path.durationMonths} months
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm">
                                {path.outcome}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-8 grow">
                            {/* Courses */}
                            <div>
                                <h4 className="text-sm font-bold text-blue-400 uppercase mb-4 flex items-center gap-2">
                                    <PlayCircle size={16} /> Courses
                                </h4>
                                <div className="space-y-3">
                                    {path.courses.map((course, cIdx) => (
                                        <a
                                            key={cIdx}
                                            href={course.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm"
                                        >
                                            <div>
                                                <div className="text-sm font-semibold text-slate-800">
                                                    {course.title}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {course.platform}
                                                </div>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Books */}
                            <div>
                                <h4 className="text-sm font-bold text-indigo-400 uppercase mb-4 flex items-center gap-2">
                                    <BookOpen size={16} /> Books
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {path.books.map((book, bIdx) => (
                                        <div
                                            key={bIdx}
                                            className="p-4 bg-white border border-slate-100 rounded-2xl"
                                        >
                                            <div className="text-sm font-semibold text-slate-800">
                                                {book.title}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {book.author}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    )
}

export default LearningPath