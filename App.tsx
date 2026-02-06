import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Grid, Disc, Activity, ArrowLeft, ArrowRight } from 'lucide-react';
import { CONTENT } from './constants';
import { Project, ViewState } from './types';

// Types
type Language = 'RU' | 'EN';

// --- COMPONENTS ---

// 1. Radar Cursor — removed, using default cursor

// 2. Navigation
const NavBar = ({ 
  lang, 
  setLang, 
  ui 
}: { 
  lang: Language, 
  setLang: (l: Language) => void,
  ui: typeof CONTENT.RU.UI 
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-void/90 backdrop-blur-sm border-b border-concrete mix-blend-difference text-white">
      <div className="flex justify-between items-stretch h-16">
        <div className="flex items-center px-4 md:px-8 border-r border-concrete min-w-[200px]">
           <span className="font-display font-bold text-xl tracking-tight">VODICHKA CREW</span>
           {/* Minimal Green Detail: Small dot */}
           <div className="w-1.5 h-1.5 bg-radar rounded-full ml-2 animate-pulse" />
        </div>

        <div className="hidden md:flex flex-1 justify-end items-center px-8 gap-8">
           {/* Language Switcher updated */}
           <div className="font-mono text-xs flex gap-2">
             <button 
               onClick={() => setLang('RU')}
               className={`transition-colors ${lang === 'RU' ? 'text-radar' : 'text-zinc-600 hover:text-white'}`}
               data-interactive="true"
             >
               RU
             </button>
             <span className="text-zinc-700">//</span>
             <button 
               onClick={() => setLang('EN')}
               className={`transition-colors ${lang === 'EN' ? 'text-radar' : 'text-zinc-600 hover:text-white'}`}
               data-interactive="true"
             >
               EN
             </button>
           </div>
        </div>
        
        <div className="md:hidden flex items-center px-4 border-l border-concrete">
             <button 
             onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
             className="font-mono text-xs hover:text-radar transition-colors mr-4"
             data-interactive="true"
           >
             {lang}
           </button>
          <button className="text-white">
            <Grid size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

// 4. Hero Slideshow — surveillance-feed background cycling through project media
const HeroSlideshow = ({ images }: { images: string[] }) => {
  const [state, setState] = useState({
    topUrl: images[0] || '',
    bottomUrl: images.length > 1 ? images[1] : images[0] || '',
    showTop: true,
  });
  const indexRef = useRef(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % images.length;
      const nextUrl = images[indexRef.current];

      setState(prev => {
        if (prev.showTop) {
          // top visible → load next into bottom, reveal bottom
          return { ...prev, bottomUrl: nextUrl, showTop: false };
        } else {
          // bottom visible → load next into top, reveal top
          return { ...prev, topUrl: nextUrl, showTop: true };
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) return null;

  const isVideo = (url: string) => /\.mp4|\.webm|\.ogg/i.test(url);

  const MediaLayer = ({ url, visible }: { url: string; visible: boolean }) => (
    <div className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {isVideo(url) ? (
        <video key={url} src={url} muted loop playsInline autoPlay className="w-full h-full object-cover grayscale brightness-75 scale-110" />
      ) : (
        <img key={url} src={url} alt="" className="w-full h-full object-cover grayscale brightness-75 scale-110" />
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Double-buffer layers for cross-fade */}
      <MediaLayer url={state.bottomUrl} visible={!state.showTop} />
      <MediaLayer url={state.topUrl} visible={state.showTop} />

      {/* Layer 1: Solid color overlay */}
      <div className="absolute inset-0 bg-zinc-950/50 mix-blend-multiply" />
      {/* Layer 2: Top-to-bottom gradient (fade top edge) */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-transparent" />
      {/* Layer 3: Bottom-to-top gradient (fade bottom edge) */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
      {/* Layer 4: Radial vignette (darken corners) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_100%)]" />
    </div>
  );
};

// 4b. Hero Section
const Hero = ({ ui, projects }: { ui: typeof CONTENT.RU.UI; projects: Project[] }) => {
  // Only use video URLs (no static images)
  const heroImages = projects.map(p => p.previewVideoUrl).filter((url): url is string => !!url && /\.mp4|\.webm|\.ogg/i.test(url));

  return (
    <header className="relative min-h-[50vh] md:min-h-[70vh] flex flex-col justify-start pt-24 md:pt-32 p-4 md:p-12 border-b border-concrete overflow-hidden">
      {/* Background Slideshow */}
      <HeroSlideshow images={heroImages} />

      {/* Main Flex Container for Title and Monitor Alignment */}
      <div className="relative z-20 flex flex-col md:flex-row justify-between items-start w-full mb-8">
        
        {/* Title */}
        <h1 className="font-display font-bold text-[13vw] md:text-[7rem] lg:text-[9rem] leading-[0.85] tracking-tight text-white select-none mix-blend-screen md:max-w-[70%]">
          VODICHKA<br/>CREW
        </h1>

      </div>

      <div className="max-w-xl relative z-10">
         {/* Green border accent on the left */}
         <p className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-relaxed border-l-2 border-radar pl-4 bg-void/50 backdrop-blur-sm pr-4 py-2">
           {ui.hero_manifesto}
         </p>
      </div>
    </header>
  );
};

// 5. Project List
const ProjectList = ({ 
  onSelect, 
  projects, 
  ui 
}: { 
  onSelect: (p: Project) => void, 
  projects: Project[],
  ui: typeof CONTENT.RU.UI 
}) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // Floating Preview Window
  const PreviewWindow = () => {
    if (!hoveredProject) return null;
    return (
      <div className="fixed top-32 right-8 z-50 pointer-events-none hidden lg:block animate-in fade-in zoom-in-95 duration-200">
        {/* Minimal Green Border for preview */}
        <div className="bg-void border border-radar/50 p-1 w-[480px]">
           <div className="flex justify-between items-center mb-1 border-b border-zinc-800 pb-1 px-1">
             <span className="font-mono text-[10px] text-white tracking-widest uppercase">{hoveredProject.title}</span>
             <span className="font-mono text-[10px] text-zinc-500">{hoveredProject.status}</span>
           </div>
           <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
              {hoveredProject.hoverVideoUrl ? (
                <video
                  src={hoveredProject.hoverVideoUrl}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover contrast-125"
                />
              ) : hoveredProject.previewVideoUrl ? (
                <video
                  src={hoveredProject.previewVideoUrl}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover contrast-125"
                />
              ) : (
                <img src={hoveredProject.imageUrl} className="w-full h-full object-cover contrast-125" alt="preview" />
              )}
              <div className="absolute inset-0 bg-white mix-blend-overlay opacity-5"></div>
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur px-2 py-1">
                 <span className="font-mono text-[10px] text-white">{hoveredProject.title}</span>
              </div>
           </div>
           <div className="mt-1 flex justify-between px-1 pt-1">
              <span className="font-mono text-[10px] text-zinc-500">{ui.project_year}: {hoveredProject.year}</span>
              {/* Dynamic Status display */}
              <span className="font-mono text-[10px] text-zinc-500">{ui.project_status}: {hoveredProject.status}</span>
           </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative border-b border-concrete bg-void min-h-screen">
      <PreviewWindow />

      <div className="relative z-10">
        <div className="flex items-center justify-between p-4 border-b border-concrete bg-concrete/40 backdrop-blur-sm sticky top-16 z-20">
          <h2 className="font-mono text-xs text-white tracking-widest flex items-center gap-2">
            <Activity size={12} className="text-radar" /> {ui.project_list_title}
          </h2>
          <span className="font-mono text-xs text-zinc-500">{ui.project_count}: {projects.length}</span>
        </div>

        <div className="flex flex-col">
          {projects.map((project) => (
            <div 
              key={project.id}
              data-interactive="true"
              onClick={() => onSelect(project)}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group relative border-b border-zinc-900 transition-colors duration-200 cursor-pointer"
            >
              {/* Updated Layout: Space Evenly */}
              <div className="flex flex-col md:flex-row items-start md:items-center py-8 px-4 md:px-12 gap-6 md:gap-8 relative z-10">
                
                {/* 1. ID + Mobile Arrow */}
                <div className="w-full md:w-20 flex justify-between items-center md:block">
                    <div className="font-mono text-xs text-zinc-600 transition-colors duration-300">
                        {project.code}
                    </div>
                    {/* Arrow visible on mobile next to ID */}
                    <div className="md:hidden">
                       <ArrowUpRight size={24} className="text-radar" />
                    </div>
                </div>

                {/* 2. Title */}
                <div className="w-full md:w-auto md:flex-1">
                    {/* NEW: Mobile/Tablet Brand Label */}
                    <div className="lg:hidden font-mono text-[10px] text-zinc-500 mb-2 uppercase tracking-wider">
                        [{project.category}]
                    </div>

                    <h3 className="font-display font-bold text-2xl md:text-5xl uppercase text-zinc-400 group-hover:text-white transition-all duration-300 origin-left">
                    {project.title}
                    </h3>
                </div>

                {/* 3. Thumbnail (Large on Mobile, Small on Desktop) */}
                <div className="w-full md:w-auto flex justify-center md:justify-start">
                    <div className="w-full aspect-video md:w-32 md:h-16 bg-zinc-900 border border-zinc-800 overflow-hidden transition-colors duration-300 relative">
                        {project.previewVideoUrl ? (
                          <video
                            src={project.previewVideoUrl}
                            muted
                            loop
                            playsInline
                            autoPlay
                            className="w-full h-full object-cover opacity-80 md:opacity-50 group-hover:opacity-100 transition-all duration-500"
                          />
                        ) : (
                        <img 
                        src={project.imageUrl} 
                        alt="thumb" 
                            className="w-full h-full object-cover opacity-80 md:opacity-50 group-hover:opacity-100 transition-all duration-500" 
                        />
                        )}
                    </div>
                </div>

                {/* 4. Category (Tag) - Desktop Only */}
                <div className="hidden lg:block w-40 font-mono text-[10px] text-zinc-500 uppercase tracking-wider text-right">
                    [{project.category}]
                </div>

                {/* 5. Arrow - Desktop Only */}
                <div className="hidden md:block w-10 flex justify-end">
                    <ArrowUpRight size={24} className="text-radar group-hover:rotate-45 transition-transform duration-300" />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7. About Section
const AboutSection = ({ ui }: { ui: typeof CONTENT.RU.UI }) => {
  return (
    <section className="bg-void py-24 md:py-32 border-b border-concrete relative overflow-hidden">
       {/* Decor text */}
       <div className="absolute top-1/2 left-0 -translate-y-1/2 font-display font-bold text-[20vw] leading-none text-zinc-900 whitespace-nowrap opacity-10 select-none pointer-events-none">
          VODICHKA
       </div>

       <div className="container mx-auto px-4 md:px-12 relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="md:w-1/3">
             <div className="inline-block border border-radar px-3 py-1 font-mono text-[10px] text-radar uppercase mb-6">
                {ui.about_tag}
             </div>
             <h2 className="font-display font-bold text-4xl md:text-5xl uppercase leading-tight" dangerouslySetInnerHTML={{ __html: ui.about_title }} />
          </div>
          <div className="md:w-2/3 md:pl-12 border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0">
             <p className="font-mono text-sm md:text-base text-zinc-300 leading-loose mb-8" dangerouslySetInnerHTML={{ __html: ui.about_text_1 }} />
             <p className="font-mono text-sm md:text-base text-zinc-500 leading-loose" dangerouslySetInnerHTML={{ __html: ui.about_text_2 }} />
          </div>
       </div>
    </section>
  );
};

// 8. Project Detail Overlay
const ProjectDetail = ({ 
  project,
  projects,
  onClose,
  onSelect,
  ui 
}: { 
  project: Project, 
  projects: Project[],
  onClose: () => void,
  onSelect: (p: Project) => void,
  ui: typeof CONTENT.RU.UI 
}) => {
  if (!project) return null;

  // Navigation Logic
  const currentIndex = projects.findIndex(p => p.id === project.id);
  // Disable loop: only allow next/prev if not at boundaries
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;

  const handleNext = () => {
    if (nextProject) onSelect(nextProject);
  };
  const handlePrev = () => {
    if (prevProject) onSelect(prevProject);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-void text-white overflow-y-auto animate-in fade-in duration-300">
      <div className="min-h-screen flex flex-col relative pb-20"> {/* Add padding bottom for nav bar */}
        {/* Header */}
        <div className="fixed top-0 left-0 w-full p-4 flex justify-between items-center bg-void/90 backdrop-blur border-b border-concrete z-10">
           <div className="font-mono text-xs text-zinc-500 flex items-center gap-4">
             <span>{project.code}</span>
             <span className="text-zinc-700">//</span>
             <span>{ui.detail_review}</span>
           </div>
           <button 
            onClick={onClose}
            data-interactive="true" 
            className="font-mono text-xs border border-concrete px-6 py-2 hover:bg-white hover:text-black uppercase transition-colors"
          >
             {ui.detail_close}
           </button>
        </div>

        {/* Content */}
        <div className="pt-24 px-4 md:px-12 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-12">
               <div>
                 <h1 className="font-display font-bold text-4xl md:text-6xl uppercase leading-[0.85] mb-4">{project.title}</h1>
                 <div className="font-mono text-xs text-radar flex items-center gap-2 mb-4">
                   <Disc size={12} className="animate-spin" /> {project.status}
                 </div>
               </div>

               <div className="space-y-8">
                  {/* Task Block - Highlighted, No Terminal Icon */}
                  {project.task && (
                     <div className="bg-zinc-900/50 border border-radar/30 p-6 relative overflow-hidden group">
                       <label className="block font-mono text-[10px] text-radar mb-3 uppercase tracking-widest">{ui.detail_task}</label>
                       <div className="font-display text-xl md:text-2xl leading-tight text-white">{project.task}</div>
                     </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-6 border-t border-concrete pt-6">
                      <div>
                        <label className="block font-mono text-[10px] text-zinc-600 mb-1">{ui.detail_year}</label>
                         {/* Highlighted Year */}
                        <div className="font-display text-4xl text-zinc-200">{project.year}</div>
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-zinc-600 mb-1">{ui.detail_client}</label>
                        <div className="font-mono text-lg">{project.client}</div>
                      </div>
                  </div>

                 {/* Description only if no Task (Old format support) */}
                 {!project.task && (
                   <>
                    <div className="border-t border-concrete pt-4">
                     <label className="block font-mono text-[10px] text-zinc-600 mb-1">{ui.detail_specs}</label>
                     <ul className="font-mono text-sm text-zinc-400 space-y-1">
                       {project.specs.map(s => <li key={s}>:: {s}</li>)}
                     </ul>
                   </div>
                   <p className="font-mono text-sm leading-relaxed text-zinc-300 border-l-2 border-radar pl-4">
                     {project.description}
                   </p>
                   </>
                 )}
               </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="w-full aspect-video bg-zinc-900 border border-concrete relative group overflow-hidden">
                {project.fullVideoUrl ? (
                  <video
                    src={project.fullVideoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                ) : (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                )}
              </div>

               {/* Right Column Content: Redesigned Idea */}
               {project.idea && (
                 <div className="mt-8">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                      <label className="font-mono text-xs text-zinc-500 uppercase tracking-[0.2em]">{ui.detail_idea}</label>
                      <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                   </div>
                   
                   <div className="bg-zinc-900/20 p-8 border-l border-zinc-800">
                     <p className="font-mono text-base md:text-lg leading-loose text-zinc-300 whitespace-pre-line">
                       {project.idea}
                     </p>
                   </div>
                 </div>
               )}
               
               {project.extraVideoUrl && (
                 <div className="mt-10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                      <label className="font-mono text-xs text-zinc-500 uppercase tracking-[0.2em]">ФИНАЛ</label>
                      <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                     <div className="lg:col-span-7 w-full aspect-video bg-zinc-900 border border-concrete overflow-hidden">
                       <video
                         src={project.extraVideoUrl}
                         controls
                         playsInline
                         className="w-full h-full object-cover"
                       />
                     </div>
                     {project.extraVideoText && (
                       <div className="lg:col-span-5 font-mono text-sm md:text-base text-zinc-300 leading-relaxed border-l border-zinc-800 pl-4">
                         {project.extraVideoText}
                       </div>
                     )}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Navigation Bar (Bottom Fixed inside Modal) */}
        <div className="fixed bottom-0 left-0 w-full bg-void border-t border-concrete p-4 flex justify-between items-center z-20">
            <button 
                onClick={handlePrev}
                disabled={!prevProject}
                data-interactive={!!prevProject}
                className={`flex items-center gap-4 group transition-colors ${!prevProject ? 'opacity-0 pointer-events-none' : 'text-zinc-500 hover:text-white'}`}
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <div className="hidden md:block text-left">
                    <div className="font-mono text-[10px] uppercase">Previous</div>
                    <div className="font-display text-sm truncate max-w-[150px]">{prevProject?.title}</div>
                </div>
            </button>

            {/* Pagination / Current Index Display */}
            <div className="font-mono text-xs text-zinc-600">
                {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </div>

            <button 
                onClick={handleNext}
                disabled={!nextProject}
                data-interactive={!!nextProject}
                className={`flex items-center gap-4 group transition-colors text-right ${!nextProject ? 'opacity-0 pointer-events-none' : 'text-zinc-500 hover:text-white'}`}
            >
                <div className="hidden md:block">
                    <div className="font-mono text-[10px] uppercase">Next</div>
                    <div className="font-display text-sm truncate max-w-[150px]">{nextProject?.title}</div>
                </div>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

      </div>
    </div>
  );
};

// 9. Final Block (Footer)
const FinalBlock = ({ ui }: { ui: typeof CONTENT.RU.UI }) => {
  return (
    <footer className="relative bg-black text-white z-10 min-h-[50vh] flex flex-col justify-center py-16 border-t border-zinc-900 overflow-hidden">
       
       <div className="container mx-auto px-4 md:px-12 relative z-10 h-full flex flex-col justify-between flex-1">
         
         {/* Top part of footer: Side Headline */}
         <div className="mb-12 flex-1 flex items-center">
            <h2 className="font-display font-bold text-5xl md:text-[5rem] leading-[0.9] text-white/90 mix-blend-screen uppercase max-w-4xl">
              {ui.footer_slogan}
            </h2>
         </div>

         {/* Bottom part: Contacts */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-auto bg-black/40 backdrop-blur-sm p-4 md:p-0 rounded md:rounded-none md:bg-transparent">
            <div className="flex flex-col gap-4">
               <a href="mailto:vodichkacrew@gmail.com" className="font-mono text-lg md:text-2xl hover:text-radar transition-colors" data-interactive="true">
                 vodichkacrew@gmail.com
               </a>
               <a href="https://t.me/Razmik_kocharyan" className="font-mono text-lg md:text-2xl hover:text-radar transition-colors">
                 tg: @Razmik_kocharyan
               </a>
            </div>

            <div className="font-mono text-xs text-zinc-500 uppercase">
              2026 MOSCOW
            </div>
         </div>
       </div>
    </footer>
  );
};

// --- MAIN APP ---

const App = () => {
  const [lang, setLang] = useState<Language>('RU');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const content = CONTENT[lang];
  const ui = content.UI;

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  return (
    <div className="bg-void min-h-screen text-white relative selection:bg-radar selection:text-black animate-in fade-in duration-1000">
      
      <NavBar lang={lang} setLang={setLang} ui={ui} />

      <main className="pt-16">
        <Hero ui={ui} projects={content.PROJECTS} />
        <ProjectList onSelect={handleProjectSelect} projects={content.PROJECTS} ui={ui} />
        <AboutSection ui={ui} />
      </main>

      <FinalBlock ui={ui} />

      {selectedProject && (
        <ProjectDetail 
            project={selectedProject} 
            projects={content.PROJECTS} // Pass full list for navigation
            onSelect={handleProjectSelect} // Pass selection handler for navigation
            onClose={handleCloseProject} 
            ui={ui} 
        />
      )}
    </div>
  );
};

export default App;