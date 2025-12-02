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
  // Estado local sincronizado com Firestore
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado da sessão (mantido localmente para persistência de login simples)
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
      setIsLoading(false);
    });

    // Inscrever-se nos Usuários
    const unsubscribeUsers = subscribeToUsers((liveUsers) => {
      setUsers(liveUsers);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeUsers();
    };
  }, []);

  // 2. Atualizar CurrentUser se os dados dele mudarem no banco
  useEffect(() => {
    if (currentUser) {
        const updatedSelf = users.find(u => u.id === currentUser.id);
        if (updatedSelf && JSON.stringify(updatedSelf) !== JSON.stringify(currentUser)) {
            // Atualiza o estado local e o localStorage para refletir mudanças (ex: nova foto)
            setCurrentUser(updatedSelf);
            localStorage.setItem('humanfolio_current_user', JSON.stringify(updatedSelf));
        }
    }
  }, [users]);

  // Handler: Login / Cadastro
  const handleLogin = async (userPayload: User) => {
    // Verifica se usuário já existe na lista vinda do Firestore
    const existingUser = users.find(u => u.email === userPayload.email);
    
    if (existingUser) {
        // Login: Usa os dados do Firestore
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
  };

  // Handler: Atualizar Projeto (Votos, Edições)
  const handleUpdateProject = async (updatedProject: Project) => {
    // Atualização otimista local
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    // Salvar no Firestore
    try {
      await saveProjectToFirestore(updatedProject);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      setSuccessMessage("Erro ao sincronizar. Verifique sua conexão.");
    }
  };

  const requestDeleteProject = (projectId: string) => {
      setProjectToDeleteId(projectId);
      setIsDeleteProjectModalOpen(true);
  };

  const confirmDeleteProject = async () => {
      if (projectToDeleteId) {
          // Remover do Firestore
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

  // Handler: Criar ou Salvar Edição de Projeto
  const handleSaveProject = async (newProject: Project) => {
    // Fecha modal imediatamente
    setIsAddProjectModalOpen(false);
    setProjectToEdit(undefined);
    setSuccessMessage("Salvando projeto...");

    try {
      await saveProjectToFirestore(newProject);
      setSuccessMessage(`${newProject.title} publicado com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSuccessMessage("Erro ao publicar projeto. Tente novamente.");
    }
  };

  // Handler: Atualizar Perfil
  const handleUpdateProfile = async (updatedUser: User) => {
      // Atualização otimista
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
      // Salvar no Firestore
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
      {isLoading && projects.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-blue-600 font-bold">Carregando Humanfolio...</div>
        </div>
      ) : (
        renderContent()
      )}
      
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