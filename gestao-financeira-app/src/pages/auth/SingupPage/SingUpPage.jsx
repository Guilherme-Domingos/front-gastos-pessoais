import './SingUpPage.css';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (

    <div class="container">
    <h1 class="titulo">Cadastre-se</h1>

    <div class="form-box">
      <form>
        <label for="nome">Nome</label>
        <input type="text" id="nome" placeholder="Digite seu nome" />

        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Digite seu email" />

        <label for="senha">Senha (Min. 8 carecteres)</label>
        <input type="password" id="senha" placeholder="Digite uma senha" />

        <label for="confirmar-senha">Confirmar Senha</label>
        <input type="password" id="confirmar-senha" placeholder="Confirme sua senha" />

        <button type="submit" class="botao-verde">Cadastrar-se</button>

        <div class="login">
          <a href="/">Já sou cadastrado</a>
        </div>
      </form>
    </div>
  </div>


  );
}
