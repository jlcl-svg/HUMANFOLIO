import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, User } from "../types";

// Coleções
const PROJECTS_COLLECTION = "projects";
const USERS_COLLECTION = "users";

// --- PROJETOS ---

// Inscrever-se para receber atualizações de projetos em tempo real
export function subscribeToProjects(onUpdate: (projects: Project[]) => void) {
  const colRef = collection(db, PROJECTS_COLLECTION);
  // Ordenar por data de criação (mais recente primeiro)
  // Nota: Pode exigir criação de índice no console do Firebase se falhar
  const q = query(colRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((d) => ({ 
      ...d.data() 
    })) as Project[];
    onUpdate(projects);
  });
}

// Criar ou Sobrescrever Projeto
export async function saveProjectToFirestore(project: Project) {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  // Convertemos para objeto puro para garantir que o Firestore aceite
  const projectData = JSON.parse(JSON.stringify(project));
  
  // Adiciona timestamp do servidor para ordenação se for novo
  if (!project.createdAt) {
      projectData.createdAt = new Date().toISOString();
      projectData.serverTimestamp = serverTimestamp();
  }
  
  await setDoc(docRef, projectData, { merge: true });
}

// Deletar Projeto
export async function deleteProjectFromFirestore(projectId: string) {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
}


// --- USUÁRIOS ---

// Inscrever-se para receber lista de usuários (para login e perfis)
export function subscribeToUsers(onUpdate: (users: User[]) => void) {
  const colRef = collection(db, USERS_COLLECTION);
  
  return onSnapshot(colRef, (snapshot) => {
    const users = snapshot.docs.map((d) => ({ 
      ...d.data() 
    })) as User[];
    onUpdate(users);
  });
}

// Salvar/Atualizar Usuário
export async function saveUserToFirestore(user: User) {
  const docRef = doc(db, USERS_COLLECTION, user.id);
  const userData = JSON.parse(JSON.stringify(user));
  await setDoc(docRef, userData, { merge: true });
}
