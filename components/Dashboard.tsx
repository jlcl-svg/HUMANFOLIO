import React from 'react';
import { Project } from '../types';
import { Plus, Search, Filter, ShieldCheck, Clock, User as UserIcon, LogOut, Home } from 'lucide-react';

interface Props {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onViewProfile: () => void; // View my own profile
  onViewAuthor: (authorId: string) => void; // View author profile
  onLogout: () => void;
  onNewProject: () => void;
  userParams: { name: string; photoUrl?: string; role?: string };
}

const Dashboard: React.FC<Props> = ({ projects, onSelectProject, onViewProfile, onViewAuthor, onLogout, onNewProject, userParams }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">H</div>
                <span className="font-bold text-gray-900 hidden lg:block">HUMANFOLIO</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <button 
                    onClick={() => window.location.reload()} // Simple refresh for feed
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                    <Home size={20} /> <span className="hidden lg:block">Feed</span>
                </button>
                <button 
                    onClick={onViewProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                    <UserIcon size={20} /> <span className="hidden lg:block">Meu Perfil</span>
                </button>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div 
                    onClick={onViewProfile}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer mb-2"
                >
                    {userParams.photoUrl ? (
                        <img src={userParams.photoUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                            {userParams.name.charAt(0)}
                        </div>
                    )}
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{userParams.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userParams.role}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="w-full flex items-center justify-center lg:justify-start gap-2 text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs font-medium transition-colors">
                    <LogOut size={16} /> <span className="hidden lg:block">Sair</span>
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 max-w-[1600px]">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Explorar Projetos</h1>
                    <p className="text-gray-500 text-sm">Descubra processos criativos verificados.</p>
                </div>
                
                <div className="flex w-full md:w-auto gap-3">
                     <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                     </div>
                     <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Filter size={16} /> <span className="hidden sm:inline">Filtros</span>
                    </button>
                    <button 
                        onClick={onNewProject}
                        className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-sm active:scale-95"
                    >
                        <Plus size={16} /> Novo
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map(project => (
                    <div 
                        key={project.id} 
                        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full"
                    >
                        {/* Cover Image */}
                        <div 
                            className="h-48 bg-gray-200 relative overflow-hidden cursor-pointer"
                            onClick={() => onSelectProject(project)}
                        >
                            {project.coverImage ? (
                                <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Sem Imagem</div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${project.verified ? 'bg-white/90 text-green-700' : 'bg-white/90 text-gray-600'}`}>
                                    {project.verified ? <ShieldCheck size={10}/> : <Clock size={10}/>}
                                    {project.verified ? "Verificado" : "Pendente"}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-grow flex flex-col">
                            <h3 
                                onClick={() => onSelectProject(project)}
                                className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                {project.title}
                            </h3>
                            
                            <p 
                                onClick={() => onSelectProject(project)}
                                className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-grow cursor-pointer"
                            >
                                {project.description}
                            </p>

                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Score Humano</span>
                                <span className="text-sm font-bold text-blue-600">{project.totalHumanityScore}%</span>
                            </div>
                            
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${project.totalHumanityScore > 75 ? 'bg-green-500' : project.totalHumanityScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                    style={{ width: `${project.totalHumanityScore}%` }}
                                ></div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                                <div 
                                    onClick={(e) => { e.stopPropagation(); onViewAuthor(project.authorId); }}
                                    className="flex items-center gap-2 cursor-pointer group/author"
                                >
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600 font-bold">
                                        {project.author.charAt(0)}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 group-hover/author:text-blue-600 transition-colors">
                                        {project.author}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-300 ml-auto">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;