import React, { useState, useEffect } from 'react';
import { User, Project } from './types';
import AuthGate from './components/AuthGate';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import UserProfile from './components/UserProfile';
import AddProjectModal from './components/AddProjectModal';
import ConfirmationModal from './components/ConfirmationModal';
import SuccessModal from './components/SuccessModal';

// Firebase Services
import { 
  subscribeToProjects, 
  subscribeToUsers, 
  saveProjectToFirestore, 
  deleteProjectFromFirestore, 
  saveUserToFirestore 
} from './services/firestore';

type ViewState = 'DASHBOARD' | 'PROJECT_DETAIL' | 'USER_PROFILE';

function App() {
  // Estado local sincronizado com Firestore (Single Source of Truth)
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Controle de carregamento individual para garantir sincronia
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  // Estado da sessão (mantido localmente apenas para persistência de login neste dispositivo)
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

  // 1. Sincronização em Tempo Real (Firestore)
  useEffect(() => {
    // Inscrever-se nos Projetos
    const unsubscribeProjects = subscribeToProjects((liveProjects) => {
      setProjects(liveProjects);
      setIsProjectsLoading(false);
    });

    // Inscrever-se nos Usuários
    const unsubscribeUsers = subscribeToUsers((liveUsers) => {
      setUsers(liveUsers);
      setIsUsersLoading(false);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeUsers();
    };
  }, []);

  // 2. Atualizar CurrentUser se os dados dele mudarem no banco (ex: mudou foto em outro pc)
  useEffect(() => {
    if (currentUser && !isUsersLoading) {
        const updatedSelf = users.find(u => u.id === currentUser.id);
        // Só atualiza se houver diferença para evitar loops
        if (updatedSelf && JSON.stringify(updatedSelf) !== JSON.stringify(currentUser)) {
            setCurrentUser(updatedSelf);
            localStorage.setItem('humanfolio_current_user', JSON.stringify(updatedSelf));
        }
    }
  }, [users, currentUser, isUsersLoading]);

  // Handler: Login / Cadastro
  const handleLogin = async (userPayload: User) => {
    // Tenta encontrar usuário no banco de dados real
    const existingUser = users.find(u => u.email === userPayload.email);
    
    if (existingUser) {
        // Login: Usa os dados do Firestore (mais atualizados)
        setCurrentUser(existingUser);
        localStorage.setItem('humanfolio_current_user', JSON.stringify(existingUser));
    } else {
        // Cadastro: Salva o novo usuário no Firestore
        await saveUserToFirestore(userPayload);
        setCurrentUser(userPayload);
        localStorage.setItem('humanfolio_current_user', JSON.stringify(userPayload));
    }
    setView('DASHBOARD');
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('humanfolio_current_user');
      setIsLogoutConfirmOpen(false);
      setView('DASHBOARD');
  };

  // Handler: Atualizar Projeto (Votos, Edições)
  const handleUpdateProject = async (updatedProject: Project) => {
    // Atualização otimista na UI
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    
    try {
      await saveProjectToFirestore(updatedProject);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      setSuccessMessage("Erro de sincronização. Verifique sua conexão.");
    }
  };

  const requestDeleteProject = (projectId: string) => {
      setProjectToDeleteId(projectId);
      setIsDeleteProjectModalOpen(true);
  };

  const confirmDeleteProject = async () => {
      if (projectToDeleteId) {
          await deleteProjectFromFirestore(projectToDeleteId);
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

  const handleSaveProject = async (newProject: Project) => {
    setIsAddProjectModalOpen(false);
    setProjectToEdit(undefined);
    setSuccessMessage("Publicando...");

    try {
      await saveProjectToFirestore(newProject);
      setSuccessMessage(`${newProject.title} publicado com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSuccessMessage("Erro ao publicar projeto. Verifique as configurações do Firebase.");
    }
  };

  const handleUpdateProfile = async (updatedUser: User) => {
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
      await saveUserToFirestore(updatedUser);
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

  const isLoading = isProjectsLoading || isUsersLoading;

  // IMPORTANT: Show loading BEFORE checking for currentUser or rendering AuthGate.
  // This prevents AuthGate from receiving an empty 'users' array and failing login checks.
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen flex-col gap-4 bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 animate-pulse font-medium">Carregando HUMANFOLIO...</p>
        </div>
    );
  }

  if (!currentUser) {
    // Passamos 'users' (do Firestore) para o AuthGate verificar emails duplicados
    return <AuthGate onLogin={handleLogin} mockUsers={users} />;
  }

  const renderContent = () => {
      switch (view) {
          case 'PROJECT_DETAIL':
              const project = projects.find(p => p.id === selectedProjectId);
              if (!project) return <div className="p-10 text-center text-gray-500">Projeto não encontrado ou excluído.</div>;
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
              if (!userToView) return <div className="p-10 text-center text-gray-500">Usuário não encontrado.</div>;
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
        message="Seus dados estão salvos."
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