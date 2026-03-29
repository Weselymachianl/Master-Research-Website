import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Menu, X, ChevronRight, Github, FileText, Activity, Zap, Layers, 
  Cpu, Network, BarChart3, Mail, Linkedin, BookOpen, Download, Globe
} from 'lucide-react';
import { translations } from './translations';

// Mock data generation based on parameters
const generateData = (experimentType: string, precoding: string, users: number) => {
  const data = [];
  
  if (experimentType === 'probing') {
    // Sum Rate vs Probing Steps (L)
    const steps = [2, 4, 6, 8, 10, 12, 14, 16];
    steps.forEach(L => {
      const baseRate = 10 + (users * 2) + (precoding === 'mrt' ? 0 : 5);
      data.push({
        xValue: L,
        'DQN': baseRate + (L * 0.5),
        'Double DQN': baseRate + (L * 0.6),
        'Dueling DQN': baseRate + (L * 0.7),
        'D3QN': baseRate + (L * 0.8),
        'Curriculum D3QN': baseRate + (L * 0.9),
        'ConvCNP-D3QN': baseRate + (L * 1.2) + (L > 8 ? 2 : 0), // ConvCNP shines with more probing
      });
    });
  } else if (experimentType === 'antenna') {
    // Sum Rate vs Antenna Size (D)
    const sizes = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
    sizes.forEach(D => {
      const baseRate = 15 + (users * 1.5) + (precoding === 'mrt' ? 0 : 4);
      data.push({
        xValue: D,
        'DQN': baseRate + (D * 2),
        'Double DQN': baseRate + (D * 2.2),
        'Dueling DQN': baseRate + (D * 2.5),
        'D3QN': baseRate + (D * 2.8),
        'Curriculum D3QN': baseRate + (D * 3.0),
        'ConvCNP-D3QN': baseRate + (D * 4.0) - (D * D * 0.2), // Diminishing returns but higher peak
      });
    });
  } else {
    // Sum Rate vs Number of Users (K)
    const userCounts = [2, 4, 6, 8, 10, 12];
    userCounts.forEach(K => {
      const baseRate = 5 + (precoding === 'mrt' ? 0 : 8);
      data.push({
        xValue: K,
        'DQN': baseRate + (K * 1.5) - (K * K * 0.05),
        'Double DQN': baseRate + (K * 1.6) - (K * K * 0.04),
        'Dueling DQN': baseRate + (K * 1.8) - (K * K * 0.04),
        'D3QN': baseRate + (K * 2.0) - (K * K * 0.03),
        'Curriculum D3QN': baseRate + (K * 2.2) - (K * K * 0.02),
        'ConvCNP-D3QN': baseRate + (K * 3.0) - (K * K * 0.01), // Handles interference better
      });
    });
  }
  
  return data;
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  
  // Chart state
  const [experimentType, setExperimentType] = useState('probing');
  const [precoding, setPrecoding] = useState('zf');
  const [users, setUsers] = useState(4);

  const t = translations[lang];
  
  const chartData = useMemo(() => generateData(experimentType, precoding, users), [experimentType, precoding, users]);

  const getXAxisLabel = () => {
    if (experimentType === 'probing') return t.results.xAxisL;
    if (experimentType === 'antenna') return t.results.xAxisD;
    return t.results.xAxisK;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.abstract, href: '#abstract' },
    { name: t.nav.methodology, href: '#methodology' },
    { name: t.nav.results, href: '#results' },
    { name: t.nav.code, href: '#code' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white">
      {/* Phase 1: Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg py-3' : 'bg-slate-900 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                <span>{t.nav.logoText1}<span className="text-blue-400">{t.nav.logoText2}</span></span>
              </a>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="flex items-center text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                <Globe className="w-4 h-4 mr-1" />
                {lang === 'en' ? '中文' : 'EN'}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="flex items-center text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                <Globe className="w-4 h-4 mr-1" />
                {lang === 'en' ? '中文' : 'EN'}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 absolute w-full shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Phase 2: Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-blue-600/20 to-transparent rounded-full blur-3xl transform rotate-12 opacity-50"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-800/20 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                {t.hero.tag}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                {t.hero.title1}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t.hero.titleHighlight}</span>{t.hero.title2}
              </h1>
              <h2 className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#abstract" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 group">
                  <FileText className="w-5 h-5 mr-2" />
                  {t.hero.readPaper}
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#code" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all group">
                  <Github className="w-5 h-5 mr-2" />
                  {t.hero.viewGithub}
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-6 mt-16 lg:mt-0">
              {/* 3D/Schematic Hero Image Placeholder */}
              <div className="relative rounded-2xl bg-slate-800/50 border border-slate-700 p-2 shadow-2xl backdrop-blur-sm group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="aspect-[4/3] rounded-xl bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Abstract representation of MISO-FAS */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  <Network className="w-24 h-24 text-blue-500 mb-6 animate-pulse" strokeWidth={1} />
                  <div className="flex space-x-4 mb-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-2 h-16 bg-slate-700 rounded-full relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 w-full bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.2}s` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400 font-mono text-sm">{t.hero.simulation}</p>
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 3: The Problem & Abstract */}
      <section id="abstract" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{t.abstract.title}</h2>
            <div className="mt-4 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="prose prose-lg prose-slate max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{t.abstract.subtitle1}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {t.abstract.p1}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t.abstract.p2}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8">{t.abstract.keyChallenges}</h3>
              <ul className="space-y-8">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">{t.abstract.challenge1Title}</h4>
                    <p className="mt-2 text-slate-600">{t.abstract.challenge1Desc}</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600">
                      <Cpu className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">{t.abstract.challenge2Title}</h4>
                    <p className="mt-2 text-slate-600">{t.abstract.challenge2Desc}</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-100 text-cyan-600">
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">{t.abstract.challenge3Title}</h4>
                    <p className="mt-2 text-slate-600">{t.abstract.challenge3Desc}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 4: System Architecture & Methodology */}
      <section id="methodology" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{t.methodology.title}</h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">{t.methodology.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-48 bg-slate-100 relative flex items-center justify-center border-b border-slate-200 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                <Layers className="w-16 h-16 text-slate-400 group-hover:text-blue-500 transition-colors duration-300 relative z-10" />
                <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-400">{t.methodology.fig1}</div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.methodology.card1Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.methodology.card1Desc}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-48 bg-slate-100 relative flex items-center justify-center border-b border-slate-200 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                <Network className="w-16 h-16 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300 relative z-10" />
                <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-400">{t.methodology.fig2}</div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.methodology.card2Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.methodology.card2Desc}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-48 bg-slate-100 relative flex items-center justify-center border-b border-slate-200 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                <Cpu className="w-16 h-16 text-slate-400 group-hover:text-cyan-500 transition-colors duration-300 relative z-10" />
                <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-400">{t.methodology.fig3}</div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.methodology.card3Title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.methodology.card3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 5: Results & Interactive Data */}
      <section id="results" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{t.results.title}</h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">{t.results.subtitle}</p>
          </div>

          {/* Metric Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
              <div className="text-5xl font-extrabold text-blue-600 mb-2">{t.results.metric1Value}</div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t.results.stat1Title}</div>
              <div className="mt-2 text-xs text-slate-500">{t.results.stat1Desc}</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
              <div className="text-5xl font-extrabold text-indigo-600 mb-2">{t.results.metric2Value}</div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t.results.stat2Title}</div>
              <div className="mt-2 text-xs text-slate-500">{t.results.stat2Desc}</div>
            </div>
            <div className="bg-cyan-50 rounded-2xl p-8 text-center border border-cyan-100">
              <div className="text-5xl font-extrabold text-cyan-600 mb-2">{t.results.metric3Value}</div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t.results.stat3Title}</div>
              <div className="mt-2 text-xs text-slate-500">{t.results.stat3Desc}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
              {t.results.chartTitle}
            </h3>

            {/* Chart Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-xl border border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.results.experimentType}</label>
                <select 
                  value={experimentType}
                  onChange={(e) => setExperimentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="probing">{t.results.expProbing}</option>
                  <option value="antenna">{t.results.expAntenna}</option>
                  <option value="users">{t.results.expUsers}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.results.precoding}</label>
                <select 
                  value={precoding}
                  onChange={(e) => setPrecoding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  <option value="zf">Zero-Forcing (ZF)</option>
                  <option value="mrt">Maximum Ratio Transmission (MRT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.results.users}</label>
                <input 
                  type="range" 
                  min="2" 
                  max="12" 
                  step="2"
                  value={users}
                  onChange={(e) => setUsers(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-3"
                />
                <div className="text-center mt-2 text-sm font-bold text-blue-600">K = {users}</div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="xValue" 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b' }}
                    label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -15, fill: '#64748b' }} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b' }}
                    label={{ value: t.results.yAxis, angle: -90, position: 'insideLeft', fill: '#64748b' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="ConvCNP-D3QN" 
                    name={t.results.legendConvCNP}
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Curriculum D3QN" 
                    name={t.results.legendCurriculum}
                    stroke="#059669" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#059669', strokeWidth: 0 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="D3QN" 
                    name={t.results.legendD3QN}
                    stroke="#d97706" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#d97706', strokeWidth: 0 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Dueling DQN" 
                    name={t.results.legendDuelingDQN}
                    stroke="#dc2626" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Double DQN" 
                    name={t.results.legendDoubleDQN}
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="DQN" 
                    name={t.results.legendDQN}
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-6 text-sm text-slate-500 text-center">
              {t.results.chartCaption}
            </p>
          </div>
        </div>
      </section>

      {/* Phase 6: Author Bio & Final Conversion */}
      <section id="contact" className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Bio Section */}
          <div className="bg-slate-800 rounded-3xl p-8 md:p-12 mb-16 border border-slate-700 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-slate-700 border-4 border-slate-600 flex-shrink-0 overflow-hidden relative">
              {/* Headshot Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{t.contact.name}</h3>
              <p className="text-blue-400 font-medium mb-4">{t.contact.role}</p>
              <p className="text-slate-300 mb-6 leading-relaxed max-w-2xl">
                {t.contact.bio}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t.contact.scholar}
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center">
                  <Linkedin className="w-5 h-5 mr-2" />
                  {t.contact.linkedin}
                </a>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div id="code" className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative z-10">{t.contact.ctaTitle}</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              {t.contact.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <a href="#" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-blue-700 bg-white hover:bg-slate-50 transition-colors shadow-lg">
                <Download className="w-5 h-5 mr-2" />
                {t.contact.download}
              </a>
              <a href="#" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-blue-800 border border-blue-500 hover:bg-blue-900 transition-colors">
                <Github className="w-5 h-5 mr-2" />
                {t.contact.source}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Activity className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-white font-bold tracking-tight">{t.footer.logo}</span>
          </div>
          <div className="text-slate-500 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </div>
          <div className="flex space-x-6">
            <a href="mailto:contact@example.com" className="text-slate-500 hover:text-white transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

