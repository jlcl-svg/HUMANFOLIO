import React, { useState } from 'react';
import { Project, ProjectPhase, StageData, User } from '../types';
import { ArrowLeft, CheckCircle2, AlertCircle, FileText, ImageIcon, HelpCircle, Info, Edit2, Trash2, Tag, X } from 'lucide-react';
import HumanityChart from './HumanityChart';

interface Props {
  project: Project;
  onBack: () => void;
  onUpdateProject: (p: Project) => void;
  currentUser: User;
  onEditProject: () => void;
  onDeleteProject: () => void;
}

const ProjectDetail: React.FC<Props> = ({ project, onBack, onUpdateProject, currentUser, onEditProject, onDeleteProject }) => {
  const [activeTab, setActiveTab] = useState<ProjectPhase>(ProjectPhase.INITIATION);
  const [isVoting, setIsVoting] = useState(false);
  const [currentVote, setCurrentVote] = useState(project.stages[activeTab].myRating || 0);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const isOwner = currentUser.id === project.authorId;
  const currentStageData = project.stages[activeTab];

  const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVote(parseInt(e.target.value));
  };

  const submitVote = () => {
    const newPeerRating = Math.round((currentStageData.peerRating * 4 + currentVote) / 5);
    
    const updatedStage: StageData = {
      ...currentStageData,
      myRating: currentVote,
      peerRating: newPeerRating
    };

    const updatedStages = { ...project.stages, [activeTab]: updatedStage };
    
    // Recalculate total score
    const totalScore = (Object.values(updatedStages) as StageData[]).reduce((acc, s) => acc + s.peerRating, 0);

    onUpdateProject({
      ...project,
      stages: updatedStages,
      totalHumanityScore: totalScore
    });
    setIsVoting(false);
  };

  const getRatingLabel = (score: number) => {
      if (score <= 6) return { label: "Sintético / IA", color: "text-red-500" };
      if (score <= 13) return { label: "Híbrido / Editado", color: "text-amber-500" };
      return { label: "Orgânico / Humano", color: "text-green-600" };
  };

  const ratingInfo = getRatingLabel(currentVote);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in relative">
      {/* Lightbox */}
      {viewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setViewImage(null)}
        >
          <img src={viewImage} alt="Full view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>
      )}

      <button onClick={onBack} className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 text-sm font-medium transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Feed
      </button>

      {isOwner && (
        <div className="mb-8 flex justify-end gap-3">
            <button 
                onClick={onEditProject}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            >
                <Edit2 size={16} /> Editar Projeto
            </button>
            <button 
                onClick={onDeleteProject}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
            >
                <Trash2 size={16} /> Excluir
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Meta Info */}
        <div className="lg:col-span-4 space-y-6">
            {/* Cover Image Preview in Detail */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                    className="h-48 bg-gray-200 cursor-zoom-in group relative"
                    onClick={() => project.coverImage && setViewImage(project.coverImage)}
                >
                    {project.coverImage ? (
                        <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">Sem Capa</div>
                    )}
                </div>
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <p className="text-gray-500 text-sm mb-4">Autor: {project.author}</p>
                    
                    {/* Tags Display */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-gray-700">Índice de Humanidade</span>
                            <span className="text-3xl font-bold text-primary">{project.totalHumanityScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                                className={`h-full rounded-full ${project.totalHumanityScore > 75 ? 'bg-success' : 'bg-warning'}`} 
                                style={{ width: `${project.totalHumanityScore}%` }}
                            ></div>
                        </div>
                         <div className="mt-4 flex items-center gap-2">
                            {project.totalHumanityScore > 80 ? (
                                <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                                     <CheckCircle2 size={14} /> Projeto Orgânico
                                </div>
                            ) : (
                                 <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
                                     <AlertCircle size={14} /> Sinais de Automação
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Métricas por Etapa</h3>
                         <HumanityChart stages={project.stages} />
                    </div>
                </div>
          </div>
        </div>

        {/* Right Column: Stages */}
        <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 mb-8 gap-6 scrollbar-hide">
                {Object.values(ProjectPhase).map((phase) => (
                    <button
                        key={phase}
                        onClick={() => {
                            setActiveTab(phase);
                            setIsVoting(false);
                            setCurrentVote(project.stages[phase].myRating || 0);
                        }}
                        className={`text-sm font-medium whitespace-nowrap pb-4 border-b-2 transition-all ${
                            activeTab === phase 
                            ? 'text-primary border-primary' 
                            : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300'
                        }`}
                    >
                        {phase}
                    </button>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{activeTab}</h2>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                            Avaliação dos Pares: {currentStageData.peerRating}/20
                        </div>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-10">
                    {currentStageData.description || <span className="italic text-gray-400">Nenhum registro adicionado para esta etapa.</span>}
                </div>

                <div className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText size={16}/> Evidências e Rascunhos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {currentStageData.evidenceLinks.length > 0 ? (
                            currentStageData.evidenceLinks.map((link, idx) => (
                                <div 
                                    key={idx} 
                                    className="group aspect-square bg-gray-50 rounded-lg border border-gray-100 overflow-hidden relative cursor-zoom-in hover:shadow-md transition-all"
                                    onClick={() => setViewImage(link)}
                                >
                                    <img src={link} alt="evidence" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <ImageIcon className="text-white" size={20} />
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="col-span-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                                Nenhuma evidência anexada.
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating Action */}
                <div className="mt-auto bg-gray-50 -mx-8 -mb-8 p-8 border-t border-gray-100 rounded-b-2xl">
                    {!isVoting ? (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Validar Humanidade</p>
                                <p className="text-xs text-gray-500">Avalie se este processo reflete uma construção humana real.</p>
                            </div>
                            <button 
                                onClick={() => setIsVoting(true)}
                                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-all shadow-sm"
                            >
                                Avaliar Processo
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                                <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                <div className="text-sm text-blue-900 space-y-2">
                                    <p className="font-semibold">O que procurar em um processo humano?</p>
                                    <ul className="list-disc pl-4 space-y-1 text-blue-800/80 text-xs">
                                        <li><strong className="font-semibold">Erros Naturais:</strong> Iterações, mudanças de ideia, rascunhos descartados.</li>
                                        <li><strong className="font-semibold">Contexto Pessoal:</strong> Relatos de dificuldades reais, não apenas sucessos.</li>
                                        <li><strong className="font-semibold">Imperfeição Visual:</strong> Fotos de cadernos, post-its, mesas bagunçadas.</li>
                                        <li><strong className="font-semibold">Linguagem:</strong> Uso de gírias, dúvidas, ou estrutura não linear.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-medium text-gray-900">Nível de Humanidade Percebida</label>
                                <span className={`text-xl font-bold ${ratingInfo.color}`}>{currentVote}/20 <span className="text-xs font-normal text-gray-500 ml-1">({ratingInfo.label})</span></span>
                            </div>
                            
                            <input 
                                type="range" 
                                min="0" 
                                max="20" 
                                value={currentVote} 
                                onChange={handleVoteChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                            />
                            
                            <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-6">
                                <span>0 (Sintético)</span>
                                <span>10 (Misto)</span>
                                <span>20 (Humano)</span>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={submitVote}
                                    className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Confirmar Avaliação
                                </button>
                                <button 
                                    onClick={() => setIsVoting(false)}
                                    className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;