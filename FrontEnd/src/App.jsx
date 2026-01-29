import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Paginas/Primarias/Login";
import Cadastro from "./Paginas/Primarias/Cadastro"
import Recuperar from "./Paginas/Primarias/Recuperar";
import { AuthProvider } from './context/AuthContext';

import Layout from "./Paginas/Secundarias/Layout";
import Home from "./Paginas/Secundarias/Home";
import EntrarTorneio from "./Paginas/Secundarias/EntrarTorneio";
import Configuracoes from "./Paginas/Secundarias/Configuracoes";
import Dashboard from "./Paginas/Secundarias/Dashboard";
import Noticias from "./Paginas/Secundarias/Noticias";
import Perfil from "./Paginas/Secundarias/Perfil";
import Sobre from "./Paginas/Secundarias/Sobre";
import Suporte from "./Paginas/Secundarias/Suporte";
import Teste from "./Paginas/Secundarias/Teste";

import MatematicaOriginal from "./Paginas/Tercearios.jsx/ModeloOriginal/MatematicaOriginal";
import ProgramacaoOriginal from "./Paginas/Tercearios.jsx/ModeloOriginal/ProgramacaoOriginal";
import InglesOriginal from "./Paginas/Tercearios.jsx/ModeloOriginal/InglesOriginal";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<Recuperar />} />

          <Route path="/layout" element={<Layout />} />
          <Route path="/" element={<Home />} />
          <Route path="/entrar-no-torneio" element={<EntrarTorneio />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/portal-de-noticias" element={<Noticias />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/sobre-nos" element={<Sobre />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/teste-seu-conhecimento" element={<Teste />} />

          <Route path="/matematica-original/:username" element={<MatematicaOriginal />} />
          <Route path="/programacao-original/:username" element={<ProgramacaoOriginal />} />
          <Route path="/Ingles-original/:username" element={<InglesOriginal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}