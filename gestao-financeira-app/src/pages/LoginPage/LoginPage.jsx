import './LoginPage.css';
import Input from '../../components/auth/Input';
import Button from '../../components/auth/Button';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import AuthFormContainer from '../../components/auth/AuthFormContainer';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Bem-Vindo</h1>
      <AuthFormContainer>
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@gmail.com" />
        <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" />
        <p className="text-sm text-gray-500 mb-4 cursor-pointer hover:underline">esqueceu a senha?</p>
        <Button>Entrar</Button>
        <p className="text-center text-sm mt-4">Cadastre-se</p>
      </AuthFormContainer>
      <GoogleLoginButton />
    </div>
  );
}
