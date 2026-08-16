import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Globe, 
  ExternalLink, 
  Bot,
  Building
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../types';

export const ResourcesPage: React.FC = () => {
  const { resources, toggleSaveResource, setIsAiModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.skillGap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || res.type === filterType;
    const matchesSaved = !showSavedOnly || res.isSaved;
    return matchesSearch && matchesType && matchesSaved;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Multilingual Resource Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Targeted by Skill Gaps
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Curated Educational Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              High-yield articles, interactive sandboxes, videos, and documentation curated specifically to address your active learning gaps in multiple languages.
            </p>
          </div>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>Ask AI for Resource Summary</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources by skill, topic, or keyword (e.g. Bayes, SQL, Python)..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Formats</option>
                <option value="article">Articles & Guides</option>
                <option value="video">Videos & Lectures</option>
                <option value="course">Structured Courses</option>
                <option value="project">Hands-on Projects</option>
                <option value="documentation">Documentation</option>
              </select>

              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`px-4 py-2 rounded-lg font-medium border transition-colors flex items-center gap-1.5 ${
                  showSavedOnly
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const isSaved = res.isSaved || false;

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {res.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {res.skillGap}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveResource(res.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title={isSaved ? "Remove from saved" : "Save for later"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600 fill-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Building className="w-3 h-3" /> {res.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-500" />
                      <span>{SUPPORTED_LANGUAGES.find(l => l.code === res.language)?.name || 'English'}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                    <span>Explain topic</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
