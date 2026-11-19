// app/telas/TelaCadastro.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { cadastrarUsuario } from '../servicos/api';
import estilo, { CORES } from '../estilos';

export default function TelaCadastro({ aoCadastrar, aoVoltar }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [nomeDeUsuario, setNomeDeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function cadastrar() {
    if (carregando) return;
    if (!nome.trim() || !sobrenome.trim() || !email.trim() || !nomeDeUsuario.trim() || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const resposta = await cadastrarUsuario({
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        usuario: nomeDeUsuario.trim(),
        senha,
      });
      // Cadastrou: volta para o login levando a mensagem da API.
      aoCadastrar(resposta.mensagem || 'Cadastro feito! Agora entre com o seu e-mail e a sua senha.');
    } catch (e) {
      setErro(e.message || 'Não foi possível cadastrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilo.telaScroll}>
      <Text style={estilo.titulo}>Criar conta</Text>
      <Text style={estilo.subtitulo}>Preencha os seus dados</Text>

      {!!erro && <Text style={estilo.textoErro}>{erro}</Text>}

      <Text style={estilo.rotulo}>Nome</Text>
      <TextInput
        style={estilo.campo}
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
        placeholderTextColor={CORES.placeholder}
        editable={!carregando}
      />

      <Text style={estilo.rotulo}>Sobrenome</Text>
      <TextInput
        style={estilo.campo}
        value={sobrenome}
        onChangeText={setSobrenome}
        placeholder="Seu sobrenome"
        placeholderTextColor={CORES.placeholder}
        editable={!carregando}
      />

      <Text style={estilo.rotulo}>E-mail</Text>
      <TextInput
        style={estilo.campo}
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        placeholderTextColor={CORES.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!carregando}
      />

      <Text style={estilo.rotulo}>Usuário</Text>
      <TextInput
        style={estilo.campo}
        value={nomeDeUsuario}
        onChangeText={setNomeDeUsuario}
        placeholder="Como você vai entrar"
        placeholderTextColor={CORES.placeholder}
        autoCapitalize="none"
        editable={!carregando}
      />

      <Text style={estilo.rotulo}>Senha</Text>
      <TextInput
        style={estilo.campo}
        value={senha}
        onChangeText={setSenha}
        placeholder="Crie uma senha"
        placeholderTextColor={CORES.placeholder}
        secureTextEntry
        editable={!carregando}
      />

      <Pressable
        style={({ pressed }) => [estilo.botao, (carregando || pressed) && estilo.botaoDesabilitado]}
        onPress={cadastrar}
        disabled={carregando}
      >
        <Text style={estilo.textoBotao}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </Pressable>

      <Pressable style={estilo.botaoSecundario} onPress={aoVoltar} disabled={carregando}>
        <Text style={estilo.textoBotaoSecundario}>Voltar para o login</Text>
      </Pressable>
    </ScrollView>
  );
}
