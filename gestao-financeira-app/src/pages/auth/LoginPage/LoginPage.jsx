import './LoginPage.css';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (

    <div class="container">
    <h1 class="titulo">Bem-Vindo</h1>

    <div class="form-box">
      <form>
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="joao@gmail.com" />

        <label for="senha">Senha</label>
        <input type="password" id="senha" placeholder="Digite sua senha" />

        <div class="esqueci">
          <a href="#">Esqueceu a senha?</a>
        </div>

        <button type="submit" class="botao-verde">Entrar</button>

        <div class="cadastro">
          <a href="/cadastro">Cadastre-se</a>
        </div>
      </form>
    </div>

    <button class="botao-google">
      <img src=".\public\download.png" alt="Google" />
      Entrar com o Google
    </button>
  </div>


  );
}
