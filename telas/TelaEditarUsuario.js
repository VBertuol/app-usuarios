// app/telas/TelaEditarUsuario.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { alterarUsuario, excluirUsuario } from '../servicos/api';
import estilo from '../estilos';

export default function TelaEditarUsuario({ token, usuario, aoVoltar }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [nomeDeUsuario, setNomeDeUsuario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagemOk, setMensagemOk] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  // Preenche os campos com os dados do usuário que veio da lista.
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome ?? '');
      setSobrenome(usuario.sobrenome ?? '');
      setEmail(usuario.email ?? '');
      setNomeDeUsuario(usuario.usuario ?? '');
    }
  }, [usuario]);

  async function salvar() {
    if (carregando || excluindo) return;
    if (!nome.trim() || !sobrenome.trim() || !email.trim() || !nomeDeUsuario.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }
    setCarregando(true);
    setErro('');
    setMensagemOk('');
    try {
      const resposta = await alterarUsuario(token, usuario.id, {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        usuario: nomeDeUsuario.trim(),
      });
      setMensagemOk(resposta.mensagem || 'Dados alterados com sucesso.');
    } catch (e) {
      if (e && e.status === 401) return; // o App.js já mandou para o login
      setErro(e.message || 'Não foi possível salvar as alterações.');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirAgora() {
    setConfirmandoExclusao(false);
    setExcluindo(true);
    setErro('');
    setMensagemOk('');
    try {
      await excluirUsuario(token, usuario.id);
      aoVoltar(); // volta para a lista (ela recarrega sozinha ao abrir)
    } catch (e) {
      if (e && e.status === 401) return;
      setErro(e.message || 'Não foi possível excluir.');
      setExcluindo(false);
    }
  }

  const ocupado = carregando || excluindo;

  if (!usuario) {
    return (
      <View style={estilo.tela}>
        <Text style={estilo.titulo}>Editar usuário</Text>
        <Text style={estilo.subtitulo}>Nenhum usuário selecionado.</Text>
        <Pressable style={estilo.botao} onPress={aoVoltar}>
          <Text style={estilo.textoBotao}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={estilo.tela}>
      <Text style={estilo.titulo}>Editar usuário</Text>
      <Text style={estilo.subtitulo}>ID {usuario.id}</Text>

      {!!erro && <Text style={estilo.textoErro}>{erro}</Text>}
      {!!mensagemOk && <Text style={estilo.textoOk}>{mensagemOk}</Text>}

      <Text style={estilo.rotulo}>Nome</Text>
      <TextInput style={estilo.campo} value={nome} onChangeText={setNome} editable={!ocupado} />

      <Text style={estilo.rotulo}>Sobrenome</Text>
      <TextInput style={estilo.campo} value={sobrenome} onChangeText={setSobrenome} editable={!ocupado} />

      <Text style={estilo.rotulo}>E-mail</Text>
      <TextInput
        style={estilo.campo}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!ocupado}
      />

      <Text style={estilo.rotulo}>Usuário</Text>
      <TextInput
        style={estilo.campo}
        value={nomeDeUsuario}
        onChangeText={setNomeDeUsuario}
        autoCapitalize="none"
        editable={!ocupado}
      />

      <Pressable
        style={({ pressed }) => [estilo.botao, (ocupado || pressed) && estilo.botaoDesabilitado]}
        onPress={salvar}
        disabled={ocupado}
      >
        <Text style={estilo.textoBotao}>{carregando ? 'Salvando...' : 'Salvar alterações'}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [estilo.botao, estilo.botaoPerigo, (ocupado || pressed) && estilo.botaoDesabilitado]}
        onPress={() => setConfirmandoExclusao(true)}
        disabled={ocupado}
      >
        <Text style={estilo.textoBotao}>{excluindo ? 'Excluindo...' : 'Excluir usuário'}</Text>
      </Pressable>

      <Pressable style={estilo.botaoSecundario} onPress={aoVoltar} disabled={excluindo}>
        <Text style={estilo.textoBotaoSecundario}>Voltar para a lista</Text>
      </Pressable>

      {/* Confirmação antes de excluir (Modal, pois Alert.alert não funciona no navegador) */}
      <Modal
        visible={confirmandoExclusao}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmandoExclusao(false)}
      >
        <View style={estilo.fundoModal}>
          <View style={estilo.caixaModal}>
            <Text style={estilo.tituloModal}>Excluir usuário</Text>
            <Text style={estilo.textoModal}>
              Excluir {nome} {sobrenome}? Essa ação não pode ser desfeita.
            </Text>
            <View style={estilo.linhaBotoesModal}>
              <Pressable
                style={[estilo.botaoModal, excluindo && estilo.botaoDesabilitado]}
                onPress={() => setConfirmandoExclusao(false)}
                disabled={excluindo}
              >
                <Text style={estilo.textoBotaoModal}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[estilo.botaoModal, estilo.botaoModalExcluir, excluindo && estilo.botaoDesabilitado]}
                onPress={excluirAgora}
                disabled={excluindo}
              >
                <Text style={estilo.textoBotaoModalExcluir}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
