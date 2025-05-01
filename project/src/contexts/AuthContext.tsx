import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../firebase'; 
import { doc, setDoc } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'parent' | 'teacher' | 'student' | 'guest';
}

interface TeacherInfo {
  schoolName: string;
  teacherId: string;
  department: string;
  district: string;
  subjects: string[];
  gradeLevels: string[]; // Must be an array of strings
  yearsExperience: number;
  certifications: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'parent' | 'teacher' | 'student' | 'guest',
    nisn?: string,
    teacherInfo?: TeacherInfo
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const name = firebaseUser.displayName || "Unnamed";
          const email = firebaseUser.email || "";
          const role = 'parent'; // Default role, OR fetch from Firestore if needed

          const user: User = {
            id: firebaseUser.uid,
            name,
            email,
            role,
          };

          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The listener in useEffect will handle setting user
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'parent' | 'teacher' | 'student' | 'guest',
    nisn?: string,
    teacherInfo?: TeacherInfo
  ) => {
    setIsLoading(true);
    try {
      if (role === 'student' && !nisn) {
        throw new Error("NISN is required for student registration.");
      }

      let uid: string;

      if (role === 'student') {
        const docRef = doc(db, "students", nisn ?? crypto.randomUUID());
        await setDoc(docRef, {
          name,
          email,
          role,
          nisn,
          createdAt: new Date(),
        });
        uid = docRef.id;
      } else if (role === 'teacher') {
        if (!teacherInfo || !teacherInfo.schoolName || !teacherInfo.teacherId) {
          throw new Error("Teacher information is incomplete.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        uid = user.uid;

        await setDoc(doc(db, "teachers", uid), {
          name,
          email,
          role,
          ...teacherInfo,
          createdAt: new Date(),
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        uid = user.uid;

        await setDoc(doc(db, role === 'parent' ? "parents" : "users", uid), {
          name,
          email,
          role,
          createdAt: new Date(),
        });
      }

      setUser({ id: uid, name, email, role });
      localStorage.setItem("user", JSON.stringify({ id: uid, name, email, role }));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};