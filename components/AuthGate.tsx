import React, { useState, useRef } from 'react';
import { User, EducationItem, ExperienceItem } from '../types';
import { 
  ArrowRight, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Calendar, 
  MapPin, 
  ShieldCheck,
  CreditCard,
  Camera,
  Briefcase,
  GraduationCap,
  Upload,
  Plus,
  Trash2,
  LogIn,
  Linkedin,
  Instagram,
  Globe,
  Phone,
  Link as LinkIcon
} from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
  mockUsers: User[]; // Pass existing users for mock login
}

const AuthGate: React.FC<Props> = ({ onLogin, mockUsers }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Registration State
  const [step, setStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Temporary state for adding list items
  const [tempEdu, setTempEdu] = useState<Partial<EducationItem>>({});
  const [tempExp, setTempExp] = useState<Partial<ExperienceItem>>({});

  const [formData, setFormData] = useState({
    // Step 1: Credenciais
    fullName: '',
    email: '',
    password: '',
    // Step 2: Dados Pessoais
    birthDate: '',
    gender: '',
    cpf: '',
    country: '',
    city: '',
    termsAccepted: false,
    // Step 3: Perfil Profissional
    role: '',
    bio: '',
    education: [] as EducationItem[],
    experience: [] as ExperienceItem[],
    photoUrl: '',
    // Contatos
    phone: '',
    linkedin: '',
    instagram: '',
    website: ''
  });

  const handleLoginSubmit = () => {
    const user = mockUsers.find(u => u.email === loginEmail);
    
    if (!user) {
        setLoginError('Email não encontrado. Por favor, crie uma conta.');
        return;
    }

    // Simple mock auth check (in real app, hash password)
    if (user.password === loginPassword) {
        onLogin(user);
    } else {
        setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addEducationItem = () => {
    if (tempEdu.institution && tempEdu.degree) {
        const newItem: EducationItem = {
            id: Math.random().toString(36).substr(2, 9),
            institution: tempEdu.institution!,
            degree: tempEdu.degree!,
            startYear: tempEdu.startYear || '',
            endYear: tempEdu.endYear || 'Atual'
        };
        setFormData({ ...formData, education: [...formData.education, newItem] });
        setTempEdu({});
    }
  };

  const removeEducationItem = (id: string) => {
      setFormData({...formData, education: formData.education.filter(i => i.id !== id)});
  };

  const addExperienceItem = () => {
    if (tempExp.company && tempExp.role) {
        const newItem: ExperienceItem = {
            id: Math.random().toString(36).substr(2, 9),
            company: tempExp.company!,
            role: tempExp.role!,
            description: tempExp.description || '',
            startYear: tempExp.startYear || '',
            endYear: tempExp.endYear || 'Atual'
        };
        setFormData({ ...formData, experience: [...formData.experience, newItem] });
        setTempExp({});
    }
  };

  const removeExperienceItem = (id: string) => {
    setFormData({...formData, experience: formData.experience.filter(i => i.id !== id)});
  };

  const finishRegister = () => {
    if (!formData.termsAccepted) return;

    // Check for duplicate email
    const emailExists = mockUsers.some(u => u.email === formData.email);
    if (emailExists) {
      setRegisterError("Este e-mail já está cadastrado. Por favor, faça login ou use outro e-mail.");
      setStep(0); // Go back to step 0 to fix email
      return;
    }
    
    onLogin({
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: formData.fullName.split(' ')[0],
      email: formData.email,
      password: formData.password, 
      bio: formData.bio,
      role: formData.role,
      photoUrl: formData.photoUrl,
      education: formData.education,
      experience: formData.experience,
      location: `${formData.city}, ${formData.country}`,
      isVerifiedHuman: true,
      followers: 0,
      following: [],
      contacts: {
        phone: formData.phone,
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        website: formData.website
      }
    });
  };

  const isStep1Valid = formData.fullName.length > 3 && formData.email.includes('@') && formData.password.length >= 8;
  const isStep2Valid = formData.cpf.length >= 11 && formData.birthDate && formData.country && formData.city && formData.gender && formData.termsAccepted;
  // Step 3 is optional
  
  const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all";

  if (isLoginMode) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 animate-fade-in">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">H</div>
                    <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
                    <p className="text-gray-500 text-sm mt-1">Acesse seu portfólio HUMANFOLIO</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase">Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            value={loginEmail}
                            onChange={e => {setLoginEmail(e.target.value); setLoginError('');}}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase">Senha</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            value={loginPassword}
                            onChange={e => {setLoginPassword(e.target.value); setLoginError('');}}
                        />
                    </div>
                    
                    {loginError && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">{loginError}</p>}

                    <button 
                        onClick={handleLoginSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn size={18} /> Entrar
                    </button>
                </div>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Ainda não tem uma conta?{' '}
                        <button onClick={() => {setIsLoginMode(false); setRegisterError('');}} className="text-blue-600 font-semibold hover:underline">
                            Cadastre-se
                        </button>
                    </p>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 font-sans">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 bg-white border-b border-gray-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">HUMANFOLIO</h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        Cadastro. Etapa {step + 1} de 3.
                    </p>
                </div>
                <button onClick={() => setIsLoginMode(true)} className="text-sm text-blue-600 font-medium hover:underline">
                    Já tenho conta
                </button>
            </div>

            {/* Steps Progress */}
            <div className="flex w-full h-1 bg-gray-100">
                <div 
                    className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                    style={{ width: `${((step + 1) / 3) * 100}%` }}
                ></div>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
                {registerError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-medium">
                        {registerError}
                    </div>
                )}

                {step === 0 && (
                    <div className="space-y-5 animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Credenciais de Acesso</h2>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Nome Completo</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Como você quer ser identificado"
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="seu.email@exemplo.com"
                                    value={formData.email}
                                    onChange={e => {setFormData({...formData, email: e.target.value}); setRegisterError('');}}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Crie uma senha forte"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleNext} 
                            disabled={!isStep1Valid}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-sm"
                        >
                            Próxima Etapa <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-5 animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais & Verificação</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Nascimento</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="date" 
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({...formData, birthDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">CPF</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={e => setFormData({...formData, cpf: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Gênero</label>
                            <select 
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                value={formData.gender}
                                onChange={e => setFormData({...formData, gender: e.target.value})}
                            >
                                <option value="">Selecione...</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Não-binário">Não-binário</option>
                                <option value="Outro">Outro</option>
                                <option value="Prefiro não declarar">Prefiro não declarar</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">País</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="Brasil"
                                        value={formData.country}
                                        onChange={e => setFormData({...formData, country: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Cidade</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    placeholder="Sua cidade"
                                    value={formData.city}
                                    onChange={e => setFormData({...formData, city: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={formData.termsAccepted}
                                        onChange={e => setFormData({...formData, termsAccepted: e.target.checked})}
                                    />
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                                    <ShieldCheck size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-tight">
                                    Declaro que li e concordo com os <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e a <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a> da plataforma HUMANFOLIO.
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={handleBack}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Voltar
                            </button>
                            <button 
                                onClick={handleNext} 
                                disabled={!isStep2Valid}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                            >
                                Próxima Etapa <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Seu Perfil (Opcional)</h2>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Pode pular e editar depois</span>
                        </div>

                        {/* Photo & Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 h-24 flex-shrink-0 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group overflow-hidden"
                            >
                                {formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="text-gray-400 group-hover:text-blue-500" size={32} />
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handlePhotoUpload}
                                />
                                <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">Alterar</div>
                             </div>
                             
                             <div className="flex-1 space-y-3">
                                <input 
                                    type="text" 
                                    className={inputClass}
                                    placeholder="Ocupação / Título (ex: Designer de Produto)"
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                />
                                <textarea 
                                    className={`${inputClass} min-h-[80px] resize-none`}
                                    placeholder="Uma breve biografia sobre você..."
                                    value={formData.bio}
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                />
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="text" 
                                        className={`pl-10 ${inputClass}`} 
                                        placeholder="Ou cole a URL da foto de perfil..." 
                                        value={formData.photoUrl.startsWith('data:') ? '' : formData.photoUrl} 
                                        onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                    />
                                </div>
                             </div>
                        </div>

                        {/* Contacts */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contatos</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input className={`pl-10 ${inputClass}`} placeholder="Telefone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input className={`pl-10 ${inputClass}`} placeholder="LinkedIn (URL)" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                                </div>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input className={`pl-10 ${inputClass}`} placeholder="Instagram (@...)" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                                </div>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input className={`pl-10 ${inputClass}`} placeholder="Website (URL)" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                                </div>
                             </div>
                        </div>

                        {/* Education Builder */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Formação Acadêmica</h3>
                             {formData.education.map(edu => (
                                 <div key={edu.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                                     <div>
                                         <span className="font-semibold block">{edu.institution}</span>
                                         <span className="text-gray-500">{edu.degree}</span>
                                     </div>
                                     <button onClick={() => removeEducationItem(edu.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                 </div>
                             ))}
                             
                             <div className="p-4 border border-dashed border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
                                 <input placeholder="Instituição" className={inputClass} value={tempEdu.institution || ''} onChange={e => setTempEdu({...tempEdu, institution: e.target.value})} />
                                 <input placeholder="Grau / Curso" className={inputClass} value={tempEdu.degree || ''} onChange={e => setTempEdu({...tempEdu, degree: e.target.value})} />
                                 <div className="flex gap-2">
                                     <input placeholder="Início" className={inputClass} value={tempEdu.startYear || ''} onChange={e => setTempEdu({...tempEdu, startYear: e.target.value})} />
                                     <input placeholder="Fim" className={inputClass} value={tempEdu.endYear || ''} onChange={e => setTempEdu({...tempEdu, endYear: e.target.value})} />
                                 </div>
                                 <button onClick={addEducationItem} className="text-xs text-blue-600 font-bold uppercase tracking-wide hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Adicionar
                                 </button>
                             </div>
                        </div>

                        {/* Experience Builder */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Experiência Profissional</h3>
                             {formData.experience.map(exp => (
                                 <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                                     <div>
                                         <span className="font-semibold block">{exp.company}</span>
                                         <span className="text-gray-500">{exp.role}</span>
                                     </div>
                                     <button onClick={() => removeExperienceItem(exp.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                 </div>
                             ))}
                             
                             <div className="p-4 border border-dashed border-gray-200 rounded-lg space-y-3 bg-gray-50/50">
                                 <input placeholder="Empresa" className={inputClass} value={tempExp.company || ''} onChange={e => setTempExp({...tempExp, company: e.target.value})} />
                                 <input placeholder="Cargo" className={inputClass} value={tempExp.role || ''} onChange={e => setTempExp({...tempExp, role: e.target.value})} />
                                 <div className="flex gap-2">
                                     <input placeholder="Início" className={inputClass} value={tempExp.startYear || ''} onChange={e => setTempExp({...tempExp, startYear: e.target.value})} />
                                     <input placeholder="Fim" className={inputClass} value={tempExp.endYear || ''} onChange={e => setTempExp({...tempExp, endYear: e.target.value})} />
                                 </div>
                                 <button onClick={addExperienceItem} className="text-xs text-blue-600 font-bold uppercase tracking-wide hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Adicionar
                                 </button>
                             </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button 
                                onClick={handleBack}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Voltar
                            </button>
                            <button 
                                onClick={finishRegister}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                Finalizar Cadastro
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AuthGate;