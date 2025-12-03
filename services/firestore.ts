import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, User } from "../types";

const PROJECTS_COLLECTION = "projects";
const USERS_COLLECTION = "users";

// Helper para converter Timestamp do Firestore para string ISO
// Isso evita erros no React ao tentar renderizar objetos de data
const convertFirestoreData = (data: any) => {
  const result = { ...data };
  
  // Converte createdAt principal
  if (result.createdAt && typeof result.createdAt.toDate === 'function') {
    result.createdAt = result.createdAt.toDate().toISOString();
  } else if (!result.createdAt) {
    result.createdAt = new Date().toISOString();
  }

  return result;
};

// --- PROJETOS ---

export function subscribeToProjects(onUpdate: (projects: Project[]) => void) {
  const colRef = collection(db, PROJECTS_COLLECTION);
  // Ordenar por data de criação decrescente (mais recentes primeiro)
  const q = query(colRef, orderBy("createdAt", "desc"));
  
  // onSnapshot cria um listener em tempo real
  // Assim que alguém salvar algo no banco, essa função roda automaticamente
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { 
          ...convertFirestoreData(data),
          id: doc.id 
      } as Project;
    });
    onUpdate(projects);
  }, (error) => {
    console.error("Erro ao sincronizar projetos:", error);
  });
}

export async function saveProjectToFirestore(project: Project) {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  
  // Deep clone para remover referências e garantir objeto limpo
  const projectData = JSON.parse(JSON.stringify(project));
  
  // Usar serverTimestamp para consistência cronológica entre usuários
  // Apenas se for um novo projeto ou se a data for string ISO (para converter)
  if (!projectData.createdAt || typeof projectData.createdAt === 'string') {
      if (!projectData.createdAt) {
          projectData.createdAt = serverTimestamp();
      }
  }

  // Merge: true garante que não sobrescrevemos campos que não enviamos
  await setDoc(docRef, projectData, { merge: true });
}

export async function deleteProjectFromFirestore(projectId: string) {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
}

// --- USUÁRIOS ---

export function subscribeToUsers(onUpdate: (users: User[]) => void) {
  const colRef = collection(db, USERS_COLLECTION);
  
  return onSnapshot(colRef, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({ 
      ...doc.data(), 
      id: doc.id 
    })) as User[];
    onUpdate(users);
  }, (error) => {
      console.error("Erro ao sincronizar usuários:", error);
  });
}

export async function saveUserToFirestore(user: User) {
  const docRef = doc(db, USERS_COLLECTION, user.id);
  const userData = JSON.parse(JSON.stringify(user));
  await setDoc(docRef, userData, { merge: true });
}