import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, ArrowRight, ArrowLeft, Check, Image as ImageIcon, Tag } from 'lucide-react';
import { ProjectPhase, StageData, Project } from '../types';
import { compressImage } from '../utils/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  currentUser: { id: string; name: string };
  projectToEdit?: Project;
}

const getEmptyStages = (): Record<ProjectPhase, StageData> => {
  return Object.values(ProjectPhase).reduce((acc, phase) => {
    acc[phase] = {
      phase,
      description: '',
      evidenceLinks: [],
      peerRating: 0,
      lastUpdated: new Date().toISOString()
    };
    return acc;
  }, {} as Record<ProjectPhase, StageData>);
};

const AddProjectModal: React.FC<Props> = ({ isOpen, onClose, onSave, currentUser, projectToEdit }) => {
  const [step, setStep] = useState(1);
  const [activePhase, setActivePhase] = useState<ProjectPhase>(ProjectPhase.INITIATION);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tempTag, setTempTag] = useState('');
  const [stages, setStages] = useState<Record<ProjectPhase, StageData>>(getEmptyStages());
  const [tempLink, setTempLink] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const evidenceInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setTitle(projectToEdit.title);
        setDescription(projectToEdit.description);
        setCoverImage(projectToEdit.coverImage || '');
        setTags(projectToEdit.tags || []);
        setStages(JSON.parse(JSON.stringify(projectToEdit.stages)));
        setStep(1);
      } else {
        resetForm();
      }
    }
  }, [isOpen, projectToEdit]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCoverImage('');
    setTags([]);
    setTempTag('');
    setStages(getEmptyStages());
    setStep(1);
    setActivePhase(ProjectPhase.INITIATION);
    setTempLink('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressedBase64 = await compressImage(e.target.files[0]);
        if (isCover) {
          setCoverImage(compressedBase64);
        } else {
          setStages({
              ...stages,
              [activePhase]: {
                ...stages[activePhase],
                evidenceLinks: [...stages[activePhase].evidenceLinks, compressedBase64]
              }
            });
        }
      } catch (err) {
        console.error("Image compression failed", err);
        alert("Erro ao processar imagem. Tente uma menor.");
      }
    }
  };

  const handleAddTag = () => {
      if (tempTag.trim()) {
          setTags([...tags, tempTag.trim()]);
          setTempTag('');
      }
  };

  const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddEvidenceLink = () => {
    if (tempLink) {
      setStages({
        ...stages,
        [activePhase]: {
          ...stages[activePhase],
          evidenceLinks: [...stages[activePhase].evidenceLinks, tempLink]
        }
      });
      setTempLink('');
    }
  };

  const removeEvidence = (index: number) => {
    const newLinks = [...stages[activePhase].evidenceLinks];
    newLinks.splice(index, 1);
    setStages({
      ...stages,
      [activePhase]: {
        ...stages[activePhase],
        evidenceLinks: newLinks
      }
    });
  };

  const handleStageDescChange = (val: string) => {
    setStages({
      ...stages,
      [activePhase]: {
        ...stages[activePhase],
        description: val
      }
    });
  };

  const handleSubmit = () => {
    const newProject: Project = {
      id: projectToEdit ? projectToEdit.id : 'p-' + Math.random().toString(36).substr(2, 9),
      title,
      description,
      coverImage,
      tags,
      author: projectToEdit ? projectToEdit.author : currentUser.name,
      authorId: projectToEdit ? projectToEdit.authorId : currentUser.id,
      totalHumanityScore: projectToEdit ? projectToEdit.totalHumanityScore : 0,
      verified: projectToEdit ? projectToEdit.verified : false,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
      stages: stages
    };
    onSave(newProject);
    resetForm();
    onClose();
  };

  const isStep1Valid = title.length > 3 && description.length > 10;
  
  const phaseTips: Record<ProjectPhase, string> = {
    [ProjectPhase.INITIATION]: "O nascimento da ideia. Rascunhos de guardanapo, insights repentinos, o problema inicial. Mostre a bagunça do começo.",
    [ProjectPhase.PLANNING]: "A organização do caos. Cronogramas (quebrados?), escolha de materiais, pesquisas de referência. Como você planejou atacar o problema?",
    [ProjectPhase.EXECUTION]: "Mão na massa. Onde as coisas deram errado? Mostre protótipos falhos, serragem, código quebrado, versões descartadas.",
    [ProjectPhase.CONTROL]: "Verificação e ajustes. Testes de usuário, feedbacks duros, correções de rota. O momento de 'voltar para a prancheta'.",
    [ProjectPhase.CLOSURE]: "A entrega (ou abandono). O resultado final, lições aprendidas e o que ficou de fora. A conclusão honesta."
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{projectToEdit ? 'Editar Projeto' : 'Novo Projeto'}</h2>
            <p className="text-sm text-gray-500">Etapa {step} de 2: {step === 1 ? 'Informações Básicas' : 'O Processo'}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-8">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Título do Projeto</label>
                 <input 
                    className="w-full text-3xl font-bold border-b-2 border-gray-200 focus:border-blue-600 outline-none py-2 placeholder-gray-300 transition-colors bg-white text-gray-900"
                    placeholder="Ex: Cadeira Imperfeita"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Resumo / Conceito</label>
                 <textarea 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px] resize-none text-gray-700"
                    placeholder="Qual é a essência deste projeto?..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                 />
               </div>

               <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Palavras-chave (Tags)</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            placeholder="Adicione tags (ex: #marcenaria, #sustentável)"
                            value={tempTag}
                            onChange={e => setTempTag(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                        />
                        <button 
                            onClick={handleAddTag}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-blue-100">
                                <Tag size={10} /> {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Imagem de Capa</label>
                 <div className="flex gap-4">
                   <div className="flex-1 space-y-3">
                      <div className="relative">
                         <input 
                            className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            placeholder="Cole a URL da imagem..."
                            value={coverImage && !coverImage.startsWith('data:') ? coverImage : ''}
                            onChange={e => setCoverImage(e.target.value)}
                        />
                      </div>
                      <div className="text-center text-xs text-gray-400 font-medium">OU</div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                          <Upload size={16} /> Carregar Arquivo (JPG/PNG)
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg" 
                        onChange={(e) => handleFileUpload(e, true)}
                      />
                   </div>
                   <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {coverImage ? (
                        <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                            <ImageIcon size={24} />
                            <span className="text-xs">Pré-visualização</span>
                        </div>
                      )}
                   </div>
                 </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex h-full gap-8">
              <div className="w-64 flex flex-col gap-2 shrink-0 border-r border-gray-100 pr-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Etapas do Processo</h3>
                {Object.values(ProjectPhase).map(phase => (
                  <button
                    key={phase}
                    onClick={() => setActivePhase(phase)}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${
                      activePhase === phase 
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {phase}
                    {stages[phase].description && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{activePhase}</h2>
                  <p className="text-sm text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100 mt-1">
                      {phaseTips[activePhase]}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Relato da Experiência</label>
                    <textarea 
                      className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[200px] resize-none text-gray-800 leading-relaxed shadow-sm"
                      placeholder={`Descreva detalhadamente o que aconteceu na etapa de ${activePhase}...`}
                      value={stages[activePhase].description}
                      onChange={e => handleStageDescChange(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">Evidências (Fotos, Docs, Links)</label>
                    
                    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                                placeholder="Cole a URL da imagem..."
                                value={tempLink}
                                onChange={e => setTempLink(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddEvidenceLink()}
                            />
                            <button 
                                onClick={handleAddEvidenceLink}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                                Adicionar URL
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-xs text-gray-400 font-medium">OU</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        <button 
                             onClick={() => evidenceInputRef.current?.click()}
                             className="w-full py-2 border border-gray-300 border-dashed rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-white transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <Upload size={14} /> Fazer Upload de Arquivo
                        </button>
                        <input 
                            type="file" 
                            ref={evidenceInputRef} 
                            className="hidden" 
                            accept="image/png, image/jpeg" 
                            onChange={(e) => handleFileUpload(e, false)}
                        />
                    </div>

                    {stages[activePhase].evidenceLinks.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                        {stages[activePhase].evidenceLinks.map((link, idx) => (
                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img src={link} alt="evidence" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeEvidence(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                            >
                                <Trash2 size={14} />
                            </button>
                            </div>
                        ))}
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          {step === 2 ? (
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 font-medium"
            >
              <ArrowLeft size={18} /> Voltar
            </button>
          ) : (
            <div></div> 
          )}

          {step === 1 ? (
             <button 
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continuar para o Processo <ArrowRight size={18} />
              </button>
          ) : (
            <button 
                onClick={handleSubmit}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
              >
                <Check size={18} /> {projectToEdit ? 'Salvar Alterações' : 'Publicar Projeto'}
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;