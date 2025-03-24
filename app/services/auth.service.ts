import { createClient } from "@/utils/supabase/client";
import { jwtVerify, SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nombre_usuario: string;
    rol_id: number;
  };
}

export const loginWithCredentials = async (email: string, password: string): Promise<LoginResponse | null> => {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre_usuario, rol_id, password')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('Credenciales inválidas');
    }

    // Compare the provided password with the stored password
    if (data.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    const token = await new SignJWT({ 
      id: data.id, 
      email: data.email,
      rol_id: data.rol_id 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET_KEY);

    // Rename the destructured password to dbPassword
    const { password: dbPassword, ...userData } = data;

    return {
      token,
      user: userData
    };

  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

// Add token verification function
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = document.cookie.includes('token');
  const userData = localStorage.getItem('userData');
  return token && userData;
};