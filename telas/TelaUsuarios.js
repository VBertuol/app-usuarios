// app/telas/TelaUsuarios.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { listarUsuarios } from '../servicos/api';
import estilo, { CORES } from '../estilos';

export default function TelaUsuarios({ token, aoVoltar, aoAbrirUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await listarUsuarios(token);
      // A lista vem em "dados"; ajuste aqui se o formato da sua API for diferente.
      setUsuarios(Array.isArray(resposta.dados) ? resposta.dados : []);
    } catch (e) {
      if (e && e.status === 401) return; // o App.js já mandou para o login
      setErro(e.message || 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const buscaEmMinusculas = busca.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) => {
    const nomeCompleto = `${u.nome ?? ''} ${u.sobrenome ?? ''}`.toLowerCase();
    return nomeCompleto.includes(buscaEmMinusculas);
  });

  function renderizarItem({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [estilo.itemLista, pressed && { opacity: 0.7 }]}
        onPress={() => aoAbrirUsuario(item)}
      >
        <Text style={estilo.itemTitulo}>
          {item.nome} {item.sobrenome}
        </Text>
        <Text style={estilo.itemSubtitulo}>
          {item.usuario ? `@${item.usuario}` : ''}
          {item.usuario && item.email ? ' · ' : ''}
          {item.email ?? ''}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={estilo.telaTopo}>
      <View style={estilo.linhaTitulo}>
        <Text style={estilo.titulo}>Usuários</Text>
        <Pressable onPress={aoVoltar} hitSlop={8}>
          <Text style={estilo.textoBotaoSecundario}>Voltar</Text>
        </Pressable>
      </View>

      <TextInput
        style={estilo.campo}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar pelo nome..."
        placeholderTextColor={CORES.placeholder}
      />

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" color={CORES.primaria} />
      ) : null}

      {!!erro && (
        <View>
          <Text style={estilo.textoErro}>{erro}</Text>
          <Pressable style={estilo.botao} onPress={carregar}>
            <Text style={estilo.textoBotao}>Tentar de novo</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        style={{ flex: 1 }}
        data={usuariosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarItem}
        ListEmptyComponent={
          !carregando && !erro ? (
            <Text style={estilo.subtitulo}>
              {busca.trim()
                ? 'Nenhum usuário encontrado para essa busca.'
                : 'Nenhum usuário cadastrado ainda.'}
            </Text>
          ) : null
        }
      />
    </View>
  );
}
