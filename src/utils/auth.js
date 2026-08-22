import { demoUsers } from '../data/seed';
import { api } from '../services/api';

export async function loginUser(email, password) {
  try {
    const res = await api.login(email, password);
    if (res && res.success) {
      return res;
    }
  } catch (err) {
    console.warn('API login failed, checking fallback:', err);
  }

  // Fallback to local
  const user = demoUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  const registered = JSON.parse(localStorage.getItem('gt_registered_users') || '[]');
  const regUser = registered.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (regUser) {
    const { password: _, ...safeUser } = regUser;
    return { success: true, user: safeUser };
  }
  return { success: false, error: 'Invalid email or password.' };
}

export async function registerUser(name, email, password) {
  try {
    const res = await api.register(name, email, password);
    if (res && res.success) {
      return res;
    }
    if (res && res.error) {
      return res;
    }
  } catch (err) {
    console.warn('API register failed, checking fallback:', err);
  }

  const allUsers = [
    ...demoUsers,
    ...JSON.parse(localStorage.getItem('gt_registered_users') || '[]')
  ];
  if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    password,
    avatar: null,
    role: 'user',
    joinDate: new Date().toISOString().split('T')[0],
  };
  const registered = JSON.parse(localStorage.getItem('gt_registered_users') || '[]');
  registered.push(newUser);
  localStorage.setItem('gt_registered_users', JSON.stringify(registered));
  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}
