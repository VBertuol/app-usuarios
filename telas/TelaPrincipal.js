// app/telas/TelaPrincipal.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import estilo from '../estilos';
import Chat from '../componentes/Chat';

export default function TelaPrincipal({ nome, irParaUsuarios, sair }) {
  return (
    <View style={estilo.tela}>
      <Text style={estilo.titulo}>Olá, {nome}!</Text>

      {/* Chat com a IA: ocupa o espaço que sobrar entre o "Olá" e os botões. */}
      <Chat />

      <Pressable style={estilo.botao} onPress={irParaUsuarios}>
        <Text style={estilo.textoBotao}>Ver usuários</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [estilo.botao, estilo.botaoPerigo, pressed && estilo.botaoDesabilitado]}
        onPress={sair}
      >
        <Text style={estilo.textoBotao}>Sair</Text>
      </Pressable>
    </View>
  );
}
