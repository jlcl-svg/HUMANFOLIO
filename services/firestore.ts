import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, User } from "../types";

const PROJECTS_COLLECTION = "projects";
const USERS_COLLECTION = "users";

// Helper para converter Timestamp do Firestore para string ISO
const convertTimestamps = (data: any) => {
  const result = { ...data };
  if (result.createdAt && typeof result.createdAt.toDate === 'function') {
    result.createdAt = result.createdAt.toDate().toISOString();
  }
  // Se houver serverTimestamp pendente (null), usa data atual
  if (result.createdAt === null) {
      result.createdAt = new Date().toISOString();
  }
  return result;
};

// --- PROJETOS ---

export function subscribeToProjects(onUpdate: (projects: Project[]) => void) {
  const colRef = collection(db, PROJECTS_COLLECTION);
  // Ordenar por data de criação decrescente
  const q = query(colRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { 
          ...convertTimestamps(data),
          id: doc.id 
      } as Project;
    });
    onUpdate(projects);
  }, (error) => {
    console.error("Erro ao sincronizar projetos:", error);
    // Em caso de erro (ex: permissões ou offline), não quebra a UI
  });
}

export async function saveProjectToFirestore(project: Project) {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  
  // Prepara o objeto, removendo undefined e ajustando datas
  const projectData = JSON.parse(JSON.stringify(project));
  
  // Se for criação nova ou não tiver data válida, usa serverTimestamp
  if (!projectData.createdAt) {
      projectData.createdAt = serverTimestamp();
  }

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
  });
}

export async function saveUserToFirestore(user: User) {
  const docRef = doc(db, USERS_COLLECTION, user.id);
  const userData = JSON.parse(JSON.stringify(user));
  await setDoc(docRef, userData, { merge: true });
}
