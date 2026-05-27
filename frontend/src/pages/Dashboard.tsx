import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, Lock, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface DashboardModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  completed: number;
  locked: boolean;
  firstLessonId?: string;
  firstLessonTitle?: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { learningProfile, setLearningProfile, activeCourseId } = useAppStore();
  const [courseTitle, setCourseTitle] = React.useState('');
  const [modules, setModules] = React.useState<DashboardModule[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/courses');
        const data = await response.json();
        
        if (data && data.length > 0) {
          // If no active course, we will not load modules for the dashboard
          const course = data.find((c: any) => c.id === activeCourseId);
          if (course) {
            setCourseTitle(course.title);
            const mappedModules = course.modules.map((mod: { id: string, title: string, description: string, lessons: unknown[] }, index: number) => ({
              id: mod.id,
              title: mod.title,
              description: mod.description,
              lessons: mod.lessons.length,
              completed: 0, // A ser integrado com progresso real futuro
              progress: index === 0 ? 20 : 0, // Progresso fictício por enquanto
              locked: index > 0, // Deixa apenas o primeiro módulo destrancado
              firstLessonId: (mod.lessons as any)?.[0]?.id,
              firstLessonTitle: (mod.lessons as any)?.[0]?.title
            }));
            setModules(mappedModules);
          } else {
            setModules([]);
          }
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
            Bem-vindo de volta! <span className="animate-bounce inline-block origin-bottom">👋</span>
          </h1>
          <p className="text-muted text-xl max-w-2xl">Sua jornada na <span className="text-primary font-bold">Lógica de Programação</span> está apenas começando. Vamos nessa?</p>
        </div>

        <div className="bg-surface/50 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 shadow-lg shrink-0">
          <button
            onClick={() => setLearningProfile('atypical')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              learningProfile === 'atypical' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
            title="Ideal para manter o foco: Passos curtos e redução de ruído visual."
          >
            Modo Focado
          </button>
          <button
            onClick={() => setLearningProfile('typical')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              learningProfile === 'typical' 
                ? 'bg-primary text-white shadow-md' 
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
            title="Ideal para contexto: Visão panorâmica de toda a lição."
          >
            Modo Amplo
          </button>
        </div>
      </header>

      {/* Dynamic Content */}
      {!activeCourseId || modules.length === 0 ? (
        <div className="bg-surface/30 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center gap-6">
          <BookOpen className="w-16 h-16 text-muted mb-2" />
          <h2 className="text-3xl font-black">Nenhum curso em andamento</h2>
          <p className="text-xl text-muted max-w-lg">Você ainda não selecionou qual tecnologia quer aprender. Acesse a aba de cursos e comece sua jornada agora!</p>
          <button 
            onClick={() => navigate('/courses')}
            className="mt-4 bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
          >
            Explorar Cursos
          </button>
        </div>
      ) : (
        <>
          {/* Continue Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-surface/40 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 overflow-hidden"
          >
            {/* Animated Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/30 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
            
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/30 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Em Progresso
                </span>
                <span className="text-muted text-sm font-semibold tracking-wide">
                  {courseTitle} • {modules.length > 0 ? modules[0].title : 'Módulo 1'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
                 {modules.length > 0 && modules[0].firstLessonTitle ? (
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{modules[0].firstLessonTitle}</span>
                 ) : (
                     'Carregando aula...'
                 )}
              </h2>
            </div>
            
            <button 
              onClick={() => {
                const firstModule = modules[0];
                if (firstModule?.firstLessonId) {
                  navigate(`/lesson/${firstModule.firstLessonId}`);
                }
              }}
              className="z-10 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 text-lg border border-white/10 group-hover:shadow-primary/50"
            >
              <Play className="w-6 h-6 fill-current" />
              Continuar Aula
            </button>
          </motion.div>

          {/* Course Path */}
          <div className="mt-16">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tight">
              Trilha de Conhecimento: {courseTitle}
            </h2>
            
            <div className="space-y-6 relative ml-2 md:ml-6">
              {/* Path Line */}
              <div className="absolute left-[23px] top-10 bottom-10 w-1.5 bg-surface rounded-full z-0">
                {/* Active Path Line overlay */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '10%' }} // Mock percentage based on progress
                  className="w-full bg-gradient-to-b from-success to-primary rounded-full"
                />
              </div>

              {isLoading ? (
                <div className="py-20 text-center text-muted animate-pulse font-bold text-xl">
                  Carregando sua trilha de aprendizado...
                </div>
              ) : modules.map((mod, index) => (
                <motion.div 
                  key={mod.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative z-10 flex gap-6 md:gap-8 ${mod.locked ? 'opacity-50 grayscale-[50%]' : ''}`}
                >
                  {/* Icon / Status */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 mt-1 rounded-2xl flex items-center justify-center shrink-0 border-4 border-background transition-all duration-300 ${
                    mod.progress === 100 
                      ? 'bg-success text-background shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-110' 
                      : mod.locked 
                        ? 'bg-surface text-muted border-surface/50'
                        : 'bg-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] scale-110'
                  }`}>
                    {mod.progress === 100 ? (
                      <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 stroke-[3]" />
                    ) : mod.locked ? (
                      <Lock className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <span className="font-black text-lg md:text-xl">{index + 1}</span>
                    )}
                  </div>

                  {/* Card */}
                  <div 
                    onClick={() => {
                       if (!mod.locked && mod.firstLessonId) {
                          navigate(`/lesson/${mod.firstLessonId}`);
                       }
                    }}
                    className={`bg-surface/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 flex-1 transition-all duration-300 ${!mod.locked && 'hover:border-primary/40 hover:bg-surface/80 hover:shadow-xl hover:-translate-y-1 cursor-pointer group'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <h3 className={`text-xl md:text-2xl font-bold transition-colors ${!mod.locked && 'group-hover:text-primary'}`}>{mod.title}</h3>
                      <span className="text-sm font-bold text-muted bg-background/50 px-4 py-1.5 rounded-xl border border-white/5 whitespace-nowrap">
                        {mod.completed} de {mod.lessons} aulas
                      </span>
                    </div>
                    <p className="text-muted text-lg mb-6 leading-relaxed max-w-3xl">{mod.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-background/50 h-4 rounded-full overflow-hidden p-1 border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full relative overflow-hidden ${mod.progress === 100 ? 'bg-success' : 'bg-primary'}`}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
