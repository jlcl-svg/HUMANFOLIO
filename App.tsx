import React, { useState, useEffect } from 'react';
import { User, Project, ProjectPhase } from './types';
import AuthGate from './components/AuthGate';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import UserProfile from './components/UserProfile';
import AddProjectModal from './components/AddProjectModal';
import ConfirmationModal from './components/ConfirmationModal';
import SuccessModal from './components/SuccessModal';

// Mock Data
const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Elena R.',
        email: 'elena@design.com',
        password: 'password123',
        role: 'Designer de Mobiliário',
        bio: 'Fascinada pela imperfeição dos materiais naturais. Busco o erro como método.',
        location: 'São Paulo, BR',
        isVerifiedHuman: true,
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        education: [
            { id: 'e1', institution: 'FAU USP', degree: 'Design', startYear: '2018', endYear: '2022'}
        ],
        experience: [
            { id: 'ex1', company: 'Estúdio Oca', role: 'Assistente', startYear: '2022', endYear: 'Atual', description: 'Trabalho com madeira maciça.'}
        ],
        followers: 124,
        following: []
    },
    {
        id: 'u2',
        name: 'Marcus V.',
        email: 'marcus@tech.com',
        password: 'password123',
        role: 'UX Researcher',
        bio: 'Explorando interfaces que envelhecem digitalmente.',
        location: 'Lisboa, PT',
        isVerifiedHuman: true,
        education: [],
        experience: [],
        followers: 89,
        following: []
    }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Cadeira "Falha"',
    author: 'Elena R.',
    authorId: 'u1',
    coverImage: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=600',
    description: 'Um projeto sobre aceitar o erro na marcenaria. Comecei tentando fazer uma cadeira perfeita, mas a madeira empenou. Decidi seguir o empenamento.',
    tags: ['#marcenaria', '#imperfeição', '#madeira', '#processo'],
    totalHumanityScore: 82,
    verified: true,
    createdAt: '2024-05-12',
    stages: {
      [ProjectPhase.INITIATION]: {
        phase: ProjectPhase.INITIATION,
        description: 'Eu estava frustrada com a perfeição dos móveis gerados por IA. Queria algo que machucasse de olhar. Fiz três rascunhos em guardanapos sujos de café.',
        evidenceLinks: ['https://images.unsplash.com/photo-1513346940221-18f4601d88ce?auto=format&fit=crop&q=80&w=400', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400'],
        peerRating: 18,
        lastUpdated: '2024-01-10'
      },
      [ProjectPhase.PLANNING]: {
        phase: ProjectPhase.PLANNING,
        description: 'Comprei madeira de demolição. Não medi nada com precisão digital, usei apenas meu palmo.',
        evidenceLinks: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'],
        peerRating: 16,
        lastUpdated: '2024-02-15'
      },
      [ProjectPhase.EXECUTION]: {
        phase: ProjectPhase.EXECUTION,
        description: 'Cortei o dedo no processo. O sangue manchou a perna esquerda da cadeira. Deixei lá. A lixa 80 rasgou duas vezes.',
        evidenceLinks: ['https://images.unsplash.com/photo-1622396636133-74325d97d023?auto=format&fit=crop&q=80&w=400'],
        peerRating: 19,
        lastUpdated: '2024-03-20'
      },
      [ProjectPhase.CONTROL]: {
        phase: ProjectPhase.CONTROL,
        description: 'Sentei e ela balançou. Pensei em corrigir com calço, mas o balanço me lembrava minha avó.',
        evidenceLinks: [],
        peerRating: 15,
        lastUpdated: '2024-04-01'
      },
      [ProjectPhase.CLOSURE]: {
        phase: ProjectPhase.CLOSURE,
        description: 'A cadeira não serve para sentar por mais de 10 minutos. É um sucesso absoluto.',
        evidenceLinks: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400'],
        peerRating: 14,
        lastUpdated: '2024-05-12'
      }
    }
  },
  {
    id: 'p2',
    title: 'Interface Híbrida',
    author: 'Marcus V.',
    authorId: 'u2',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    description: 'Uma interface que se degrada quanto mais o usuário a ignora. Baseado em entropia biológica.',
    tags: ['#ui', '#ux', '#entropia', '#digital'],
    totalHumanityScore: 45,
    verified: false,
    createdAt: '2024-06-01',
    stages: {
      [ProjectPhase.INITIATION]: {
        phase: ProjectPhase.INITIATION,
        description: 'O conceito é explorar a decadência digital.',
        evidenceLinks: [],
        peerRating: 5, 
        lastUpdated: '2024-06-01'
      },
      [ProjectPhase.PLANNING]: {
        phase: ProjectPhase.PLANNING,
        description: 'Roadmap definido em sprints quinzenais seguindo metodologia ágil padrão.',
        evidenceLinks: [],
        peerRating: 8,
        lastUpdated: '2024-06-05'
      },
      [ProjectPhase.EXECUTION]: {
        phase: ProjectPhase.EXECUTION,
        description: 'Código limpo, arquitetura hexagonal. Tudo compilou na primeira vez.',
        evidenceLinks: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'],
        peerRating: 4, 
        lastUpdated: '2024-06-20'
      },
      [ProjectPhase.CONTROL]: {
        phase: ProjectPhase.CONTROL,
        description: 'Testes unitários com cobertura de 100%.',
        evidenceLinks: [],
        peerRating: 10,
        lastUpdated: '2024-07-01'
      },
      [ProjectPhase.CLOSURE]: {
        phase: ProjectPhase.CLOSURE,
        description: 'Deploy realizado.',
        evidenceLinks: [],
        peerRating: 18,
        lastUpdated: '2024-07-10'
      }
    }
  }
];

type ViewState = 'DASHBOARD' | 'PROJECT_DETAIL' | 'USER_PROFILE';

function App() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
        const savedUsers = localStorage.getItem('humanfolio_users');
        return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
    } catch (e) {
        return MOCK_USERS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
        const savedProjects = localStorage.getItem('humanfolio_projects');
        return savedProjects ? JSON.parse(savedProjects) : MOCK_PROJECTS;
    } catch (e) {
        return MOCK_PROJECTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const savedUser = localStorage.getItem('humanfolio_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch(e) {
        return null;
    }
  });
  
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'humanfolio_users' && e.newValue) {
        setUsers(JSON.parse(e.newValue));
      }
      if (e.key === 'humanfolio_projects' && e.newValue) {
        setProjects(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('humanfolio_users', JSON.stringify(users));
    } catch (e) {
        setSuccessMessage('Erro: Armazenamento cheio. Não foi possível salvar dados.');
    }
  }, [users]);

  useEffect(() => {
    try {
        localStorage.setItem('humanfolio_projects', JSON.stringify(projects));
    } catch (e) {
        setSuccessMessage('Erro: Armazenamento cheio. Não foi possível salvar o projeto.');
    }
  }, [projects]);

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem('humanfolio_current_user', JSON.stringify(currentUser));
        const updatedSelf = users.find(u => u.id === currentUser.id);
        if (updatedSelf && JSON.stringify(updatedSelf) !== JSON.stringify(currentUser)) {
            setCurrentUser(updatedSelf);
        }
    } else {
        localStorage.removeItem('humanfolio_current_user');
    }
  }, [currentUser, users]);

  const handleLogin = (newUser: User) => {
    const existingIndex = users.findIndex(u => u.email === newUser.email);
    let updatedUsers = [...users];
    if (existingIndex === -1) {
        updatedUsers.push(newUser);
    } 
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setView('DASHBOARD');
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('humanfolio_current_user');
      setIsLogoutConfirmOpen(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const requestDeleteProject = (projectId: string) => {
      setProjectToDeleteId(projectId);
      setIsDeleteProjectModalOpen(true);
  };

  const confirmDeleteProject = () => {
      if (projectToDeleteId) {
          setProjects(prev => prev.filter(p => p.id !== projectToDeleteId));
          setProjectToDeleteId(null);
          setIsDeleteProjectModalOpen(false);
          setView('DASHBOARD');
          setSuccessMessage('Projeto excluído com sucesso.');
      }
  };

  const handleEditProject = (project: Project) => {
      setProjectToEdit(project);
      setIsAddProjectModalOpen(true);
  };

  const handleSaveProject = (newProject: Project) => {
    const exists = projects.find(p => p.id === newProject.id);
    if (exists) {
        setProjects(prev => prev.map(p => p.id === newProject.id ? newProject : p));
    } else {
        setProjects([newProject, ...projects]);
    }
    setIsAddProjectModalOpen(false);
    setProjectToEdit(undefined);
    setSuccessMessage(`${newProject.title} publicado com sucesso!`);
  };

  const handleUpdateProfile = (updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
  };

  const goToProject = (project: Project) => {
      setSelectedProjectId(project.id);
      setView('PROJECT_DETAIL');
  };

  const goToProfile = (userId: string) => {
      setSelectedUserId(userId);
      setView('USER_PROFILE');
  };

  const goToMyProfile = () => {
      if (currentUser) {
          setSelectedUserId(currentUser.id);
          setView('USER_PROFILE');
      }
  };

  const goToFeed = () => {
      setView('DASHBOARD');
  };

  const openNewProjectModal = () => {
      setProjectToEdit(undefined);
      setIsAddProjectModalOpen(true);
  };

  if (!currentUser) {
    return <AuthGate onLogin={handleLogin} mockUsers={users} />;
  }

  const renderContent = () => {
      switch (view) {
          case 'PROJECT_DETAIL':
              const project = projects.find(p => p.id === selectedProjectId);
              if (!project) return <div>Projeto não encontrado</div>;
              return (
                  <ProjectDetail 
                    project={project} 
                    onBack={goToFeed}
                    onUpdateProject={handleUpdateProject}
                    currentUser={currentUser}
                    onEditProject={() => handleEditProject(project)}
                    onDeleteProject={() => requestDeleteProject(project.id)}
                  />
              );
          case 'USER_PROFILE':
              const userToView = users.find(u => u.id === selectedUserId);
              if (!userToView) return <div>Usuário não encontrado</div>;
              const userProjects = projects.filter(p => p.authorId === userToView.id);
              return (
                  <UserProfile 
                    user={userToView}
                    currentUser={currentUser}
                    userProjects={userProjects}
                    isOwnProfile={currentUser.id === userToView.id}
                    onBack={goToFeed}
                    onLogout={handleLogoutClick}
                    onUpdateProfile={handleUpdateProfile}
                    onSelectProject={goToProject}
                  />
              );
          case 'DASHBOARD':
          default:
              return (
                <Dashboard 
                    projects={projects} 
                    onSelectProject={goToProject}
                    onViewProfile={goToMyProfile}
                    onViewAuthor={goToProfile}
                    onLogout={handleLogoutClick}
                    onNewProject={openNewProjectModal}
                    userParams={{ 
                        name: currentUser.name, 
                        photoUrl: currentUser.photoUrl,
                        role: currentUser.role
                    }}
                />
              );
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {renderContent()}
      
      <AddProjectModal 
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onSave={handleSaveProject}
        currentUser={{ id: currentUser.id, name: currentUser.name }}
        projectToEdit={projectToEdit}
      />
      
      <ConfirmationModal 
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Tem certeza que deseja sair?"
        message="Você precisará fazer login novamente para acessar sua conta."
        confirmLabel="Sair"
        confirmColor="red"
      />

      <ConfirmationModal 
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        onConfirm={confirmDeleteProject}
        title="Excluir Projeto"
        message="Tem certeza que deseja apagar este projeto permanentemente? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
        confirmColor="red"
      />

      <SuccessModal 
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage(null)}
        message={successMessage || ''}
      />
    </div>
  );
}

export default App;