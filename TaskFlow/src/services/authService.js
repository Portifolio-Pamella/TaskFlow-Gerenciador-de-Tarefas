
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from './firebaseConfig';

export async function registerUser(email, password) {
  return createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

export async function logoutUser() {
  return signOut(auth);
}

export function getAuthErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use':
      'Este e-mail já está cadastrado.',

    'auth/invalid-email':
      'Informe um e-mail válido.',

    'auth/weak-password':
      'A senha deve ter pelo menos 6 caracteres.',

    'auth/invalid-credential':
      'E-mail ou senha incorretos.',

    'auth/user-disabled':
      'Esta conta foi desativada.',

    'auth/network-request-failed':
      'Verifique sua conexão com a internet.',

    'auth/too-many-requests':
      'Muitas tentativas. Tente novamente mais tarde.',
  };

  return messages[error.code] ||
    'Não foi possível realizar a operação. Tente novamente.';
}
