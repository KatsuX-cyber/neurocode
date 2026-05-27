import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Coffee, MonitorPlay, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  _count: { modules: number };
}

export const Courses = () => {
  const navigate = useNavigate();
  const { setActiveCourseId, activeCourseId } = useAppStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getCourseIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('html')) return <MonitorPlay className="w-8 h-8 text-orange-500" />;
    if (t.includes('css')) return <MonitorPlay className="w-8 h-8 text-blue-500" />;
    if (t.includes('java') && !t.includes('script')) return <Coffee className="w-8 h-8 text-red-500" />;
    if (t.includes('javascript') || t.includes('js')) return <Code className="w-8 h-8 text-yellow-400" />;
    return <BookOpen className="w-8 h-8 text-primary" />;
  };

  const handleStartCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Catálogo de Cursos
        </h1>
        <p className="text-muted text-xl max-w-2xl">
          Escolha uma trilha de aprendizado e comece a desenvolver suas habilidades agora mesmo.
        </p>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted animate-pulse font-bold text-xl">
          Carregando cursos disponíveis...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-surface/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col gap-6 hover:bg-surface/80 hover:border-primary/30 transition-all duration-300 ${activeCourseId === course.id ? 'ring-2 ring-primary border-transparent' : ''}`}
            >
              {activeCourseId === course.id && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" />
                  EM ANDAMENTO
                </div>
              )}
              
              <div className="flex items-start gap-5">
                <div className="bg-background/80 p-4 rounded-2xl border border-white/5 shadow-inner">
                  {getCourseIcon(course.title)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h2>
                  <div className="flex gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted bg-background/50 px-3 py-1 rounded-lg border border-white/5">
                      {course.level === 'BASIC' ? 'Iniciante' : 'Avançado'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted bg-background/50 px-3 py-1 rounded-lg border border-white/5">
                      {course._count?.modules || 1} Módulo(s)
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted text-lg leading-relaxed flex-1">
                {course.description}
              </p>

              <button
                onClick={() => handleStartCourse(course.id)}
                className={`mt-auto w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeCourseId === course.id ? 'bg-surface border border-primary/50 text-primary hover:bg-primary/10' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/20 hover:scale-[1.02]'}`}
              >
                {activeCourseId === course.id ? 'Continuar Trilha' : 'Iniciar Trilha'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
