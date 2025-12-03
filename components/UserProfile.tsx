import React, { useState, useRef } from 'react';
import { User, Project, EducationItem, ExperienceItem } from '../types';
import { MapPin, Users, Briefcase, GraduationCap, Plus, LogOut, Edit2, X, Check, ArrowLeft, Camera, Trash2, Link as LinkIcon, Linkedin, Instagram, Globe, Phone } from 'lucide-react';
import { compressImage } from '../utils/image';

interface Props {
  user: User;
  currentUser: User;
  userProjects: Project[];
  isOwnProfile: boolean;
  onFollow?: () => void;
  onLogout?: () => void;
  onUpdateProfile?: (updatedUser: User) => void;
  onBack: () => void;
  onSelectProject: (p: Project) => void;
}

const UserProfile: React.FC<Props> = ({ 
  user, 
  currentUser,
  userProjects, 
  isOwnProfile, 
  onFollow, 
  onLogout, 
  onUpdateProfile,
  onBack,
  onSelectProject
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isFollowing, setIsFollowing] = useState(currentUser.following.includes(user.id));
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newEdu, setNewEdu] = useState<Partial<EducationItem>>({});
  const [newExp, setNewExp] = useState<Partial<ExperienceItem>>({});
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [showAddExp, setShowAddExp] = useState(false);

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editedUser);
    }
    setIsEditing(false);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) onFollow();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImage(e.target.files[0]);
        setEditedUser({ ...editedUser, photoUrl: compressed });
      } catch (err) {
        alert("Erro ao processar imagem.");
      }
    }
  };

  const addEducation = () => {
    if (newEdu.institution && newEdu.degree) {
      setEditedUser({
        ...editedUser,
        education: [...editedUser.education, {
          id: Math.random().toString(36).substr(2, 9),
          institution: newEdu.institution,
          degree: newEdu.degree,
          startYear: newEdu.startYear || '',
          endYear: newEdu.endYear || 'Atual'
        } as EducationItem]
      });
      setNewEdu({});
      setShowAddEdu(false);
    }
  };

  const removeEducation = (id: string) => {
    setEditedUser({
        ...editedUser,
        education: editedUser.education.filter(e => e.id !== id)
    });
  };

  const addExperience = () => {
    if (newExp.company && newExp.role) {
      setEditedUser({
        ...editedUser,
        experience: [...editedUser.experience, {
          id: Math.random().toString(36).substr(2, 9),
          company: newExp.company,
          role: newExp.role,
          description: newExp.description || '',
          startYear: newExp.startYear || '',
          endYear: newExp.endYear || 'Atual'
        } as ExperienceItem]
      });
      setNewExp({});
      setShowAddExp(false);
    }
  };

  const removeExperience = (id: string) => {
    setEditedUser({
        ...editedUser,
        experience: editedUser.experience.filter(e => e.id !== id)
    });
  };

  const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400";
  const editInputClass = "bg-white border border-gray-200 text-gray-900 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} /> Voltar para Feed
        </button>
        {isOwnProfile && (
            <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                <LogOut size={16} /> Sair
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
                {isOwnProfile && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    >
                        <Edit2 size={16} />
                    </button>
                )}
                {isEditing && (
                     <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-full bg-white shadow-sm border border-gray-100"><X size={16}/></button>
                        <button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-50 rounded-full bg-white shadow-sm border border-gray-100"><Check size={16}/></button>
                     </div>
                )}

                <div 
                    className={`w-32 h-32 rounded-full border-4 border-gray-50 shadow-inner mb-4 relative group overflow-hidden ${isEditing ? 'cursor-pointer hover:border-blue-200' : ''}`}
                    onClick={() => isEditing && fileInputRef.current?.click()}
                >
                    {editedUser.photoUrl || user.photoUrl ? (
                        <img 
                            src={isEditing ? editedUser.photoUrl : user.photoUrl} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Users size={32} />
                        </div>
                    )}
                    
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                />

                {isEditing && (
                    <div className="w-full mb-4 px-2">
                         <div className="relative">
                            <LinkIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                            <input 
                                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded bg-gray-50 text-gray-700 outline-none focus:border-blue-500"
                                placeholder="Ou cole a URL da imagem..."
                                value={editedUser.photoUrl || ''}
                                onChange={e => setEditedUser({...editedUser, photoUrl: e.target.value})}
                            />
                         </div>
                    </div>
                )}

                {isEditing ? (
                    <input 
                        className={`${editInputClass} text-xl font-bold text-center w-full mb-2`}
                        value={editedUser.name}
                        onChange={e => setEditedUser({...editedUser, name: e.target.value})}
                        placeholder="Seu Nome"
                    />
                ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                )}

                {isEditing ? (
                    <input 
                        className={`${editInputClass} text-sm text-center w-full mb-4`}
                        value={editedUser.role}
                        onChange={e => setEditedUser({...editedUser, role: e.target.value})}
                        placeholder="Seu Cargo/Título"
                    />
                ) : (
                    <p className="text-sm text-gray-500 font-medium mb-4">{user.role}</p>
                )}
                
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-6 w-full">
                    <MapPin size={12} className="shrink-0" />
                    {isEditing ? (
                        <input 
                            className={`${editInputClass} w-32 text-center`}
                            value={editedUser.location}
                            onChange={e => setEditedUser({...editedUser, location: e.target.value})}
                            placeholder="Cidade, País"
                        />
                    ) : user.location}
                </div>

                {!isOwnProfile && (
                    <button 
                        onClick={handleFollowToggle}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all mb-6 ${
                            isFollowing 
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                )}

                <div className="w-full grid grid-cols-2 gap-2 text-center border-t border-gray-100 pt-6">
                    <div>
                        <span className="block text-lg font-bold text-gray-900">{userProjects.length}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Projetos</span>
                    </div>
                    <div>
                        <span className="block text-lg font-bold text-gray-900">{user.followers + (isFollowing ? 1 : 0)}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Seguidores</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Sobre</h3>
                {isEditing ? (
                    <textarea 
                        className="w-full text-sm text-gray-900 leading-relaxed border border-gray-200 bg-white rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                        value={editedUser.bio}
                        onChange={e => setEditedUser({...editedUser, bio: e.target.value})}
                        placeholder="Escreva um pouco sobre você..."
                    />
                ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">{user.bio || <span className="text-gray-400 italic">Sem biografia.</span>}</p>
                )}
            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Contatos</h3>
                {isEditing ? (
                    <div className="space-y-3">
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                className={`pl-10 ${inputClass}`} 
                                placeholder="Telefone" 
                                value={editedUser.contacts?.phone || ''} 
                                onChange={e => setEditedUser({...editedUser, contacts: {...editedUser.contacts, phone: e.target.value}})} 
                            />
                        </div>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                className={`pl-10 ${inputClass}`} 
                                placeholder="LinkedIn URL" 
                                value={editedUser.contacts?.linkedin || ''} 
                                onChange={e => setEditedUser({...editedUser, contacts: {...editedUser.contacts, linkedin: e.target.value}})} 
                            />
                        </div>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                className={`pl-10 ${inputClass}`} 
                                placeholder="Instagram (@...)" 
                                value={editedUser.contacts?.instagram || ''} 
                                onChange={e => setEditedUser({...editedUser, contacts: {...editedUser.contacts, instagram: e.target.value}})} 
                            />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                className={`pl-10 ${inputClass}`} 
                                placeholder="Website / Portfolio URL" 
                                value={editedUser.contacts?.website || ''} 
                                onChange={e => setEditedUser({...editedUser, contacts: {...editedUser.contacts, website: e.target.value}})} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {user.contacts?.phone && (
                             <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                                <Phone size={16} className="text-blue-500" />
                                <span className="truncate">{user.contacts.phone}</span>
                             </div>
                        )}
                        {user.contacts?.linkedin && (
                             <a href={user.contacts.linkedin.startsWith('http') ? user.contacts.linkedin : `https://${user.contacts.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Linkedin size={16} className="text-blue-700" />
                                <span className="truncate">LinkedIn</span>
                             </a>
                        )}
                        {user.contacts?.instagram && (
                             <a href={user.contacts.instagram.startsWith('http') ? user.contacts.instagram : `https://instagram.com/${user.contacts.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                <Instagram size={16} className="text-pink-600" />
                                <span className="truncate">{user.contacts.instagram}</span>
                             </a>
                        )}
                        {user.contacts?.website && (
                             <a href={user.contacts.website.startsWith('http') ? user.contacts.website : `https://${user.contacts.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Globe size={16} className="text-gray-500" />
                                <span className="truncate">Website</span>
                             </a>
                        )}
                        {!user.contacts?.phone && !user.contacts?.linkedin && !user.contacts?.instagram && !user.contacts?.website && (
                            <p className="col-span-2 text-sm text-gray-400 italic">Nenhum contato registrado.</p>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Briefcase className="text-blue-500" size={20} /> Experiência
                </h2>
                <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-8 pb-2">
                    {(isEditing ? editedUser.experience : user.experience).map((exp) => (
                        <div key={exp.id} className="relative group">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-2 border-white bg-blue-500 ring-2 ring-gray-50"></span>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{exp.role}</h3>
                                    <p className="text-sm font-medium text-gray-700">{exp.company}</p>
                                    <p className="text-xs text-gray-400 mb-2">{exp.startYear} - {exp.endYear}</p>
                                    <p className="text-sm text-gray-500">{exp.description}</p>
                                </div>
                                {isEditing && (
                                    <button onClick={() => removeExperience(exp.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {(isEditing ? editedUser.experience : user.experience).length === 0 && (
                        <p className="text-sm text-gray-400 italic">Nenhuma experiência registrada.</p>
                    )}
                </div>
                {isOwnProfile && isEditing && (
                    <div className="mt-6 pl-10">
                        {!showAddExp ? (
                            <button 
                                onClick={() => setShowAddExp(true)} 
                                className="w-full py-3 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Adicionar experiência
                            </button>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-200 animate-fade-in">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Nova Experiência</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Cargo" className={inputClass} onChange={e => setNewExp({...newExp, role: e.target.value})} />
                                    <input placeholder="Empresa" className={inputClass} onChange={e => setNewExp({...newExp, company: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Início (Ano)" className={inputClass} onChange={e => setNewExp({...newExp, startYear: e.target.value})} />
                                    <input placeholder="Fim (Ano ou Atual)" className={inputClass} onChange={e => setNewExp({...newExp, endYear: e.target.value})} />
                                </div>
                                <textarea 
                                    placeholder="Descrição das atividades..." 
                                    className={`${inputClass} min-h-[80px] resize-y`} 
                                    onChange={e => setNewExp({...newExp, description: e.target.value})} 
                                />
                                <div className="flex gap-3 justify-end pt-2">
                                    <button 
                                        onClick={() => setShowAddExp(false)} 
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={addExperience} 
                                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <h2 className="text-lg font-bold text-gray-900 mt-10 mb-6 flex items-center gap-2">
                    <GraduationCap className="text-green-500" size={20} /> Formação
                </h2>
                <div className="space-y-6 relative border-l-2 border-gray-100 ml-3 pl-8">
                     {(isEditing ? editedUser.education : user.education).map((edu) => (
                        <div key={edu.id} className="relative group">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-2 border-white bg-green-500 ring-2 ring-gray-50"></span>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{edu.institution}</h3>
                                    <p className="text-sm text-gray-700">{edu.degree}</p>
                                    <p className="text-xs text-gray-400">{edu.startYear} - {edu.endYear}</p>
                                </div>
                                {isEditing && (
                                    <button onClick={() => removeEducation(edu.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {(isEditing ? editedUser.education : user.education).length === 0 && (
                        <p className="text-sm text-gray-400 italic">Nenhuma formação registrada.</p>
                    )}
                </div>
                {isOwnProfile && isEditing && (
                    <div className="mt-6 pl-10">
                        {!showAddEdu ? (
                            <button 
                                onClick={() => setShowAddEdu(true)} 
                                className="w-full py-3 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Adicionar formação
                            </button>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-200 animate-fade-in">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Nova Formação</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Instituição" className={inputClass} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} />
                                    <input placeholder="Grau / Curso" className={inputClass} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Início (Ano)" className={inputClass} onChange={e => setNewEdu({...newEdu, startYear: e.target.value})} />
                                    <input placeholder="Fim (Ano)" className={inputClass} onChange={e => setNewEdu({...newEdu, endYear: e.target.value})} />
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button 
                                        onClick={() => setShowAddEdu(false)} 
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={addEducation} 
                                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Portfólio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userProjects.map(project => (
                        <div 
                            key={project.id} 
                            onClick={() => onSelectProject(project)}
                            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="h-40 bg-gray-200 relative overflow-hidden">
                                {project.coverImage ? (
                                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem Imagem</div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    {project.totalHumanityScore}% Humano
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                            </div>
                        </div>
                    ))}
                    {userProjects.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            Nenhum projeto publicado ainda.
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;