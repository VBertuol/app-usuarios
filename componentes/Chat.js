// app/componentes/Chat.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { perguntarIa } from '../servicos/ia';

export default function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const listaRef = useRef(null);

  // Rola para o fim quando chega mensagem ou quando começa o "Pensando...".
  useEffect(() => {
    listaRef.current?.scrollToEnd({ animated: true });
  }, [mensagens, pensando]);

  async function enviar() {
    const pergunta = texto.trim();
    if (!pergunta || pensando) return; // nada vazio e nada duplo enquanto pensa

    setTexto('');
    setMensagens((atuais) => [
      ...atuais,
      { id: `${Date.now()}-eu`, autor: 'eu', texto: pergunta },
    ]);
    setPensando(true);

    const resultado = await perguntarIa(pergunta);

    setMensagens((atuais) => [
      ...atuais,
      resultado.sucesso
        ? {
            id: `${Date.now()}-ia`,
            autor: 'ia',
            texto: resultado.resposta,
            tokens: resultado.tokens,
            erro: false,
          }
        : {
            id: `${Date.now()}-ia`,
            autor: 'ia',
            texto: resultado.mensagem,
            erro: true,
          },
    ]);
    setPensando(false);
  }

  const podeEnviar = !pensando && texto.trim() !== '';

  return (
    <View style={estilos.chat}>
      <ScrollView
        ref={listaRef}
        style={estilos.mensagens}
        contentContainerStyle={estilos.mensagensConteudo}
      >
        {mensagens.length === 0 && !pensando && (
          <Text style={estilos.vazio}>Mande a primeira pergunta para a IA.</Text>
        )}

        {mensagens.map((m) => (
          <View
            key={m.id}
            style={m.autor === 'eu' ? estilos.linhaEu : estilos.linhaIa}
          >
            <View
              style={[
                estilos.bolha,
                m.autor === 'eu' ? estilos.bolhaEu : estilos.bolhaIa,
                m.erro && estilos.bolhaErro,
              ]}
            >
              <Text style={[estilos.textoBolha, m.erro && estilos.textoErro]}>
                {m.texto}
              </Text>
            </View>

            {m.autor === 'ia' && !m.erro && m.tokens != null && (
              <Text style={estilos.tokens}>{m.tokens} tokens</Text>
            )}
          </View>
        ))}

        {pensando && (
          <View style={estilos.linhaIa}>
            <View style={[estilos.bolha, estilos.bolhaIa]}>
              <Text style={[estilos.textoBolha, estilos.textoPensando]}>
                Pensando...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={estilos.entrada}>
        <TextInput
          style={estilos.campo}
          value={texto}
          onChangeText={setTexto}
          placeholder="Digite sua pergunta..."
          editable={!pensando}
          onSubmitEditing={enviar}
        />
        <Pressable
          style={({ pressed }) => [
            estilos.botaoEnviar,
            !podeEnviar && estilos.botaoEnviarDesabilitado,
            pressed && podeEnviar && estilos.botaoEnviarPressionado,
          ]}
          onPress={enviar}
          disabled={!podeEnviar}
        >
          <Text style={estilos.textoEnviar}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  chat: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    marginVertical: 10,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  mensagens: {
    flex: 1,
  },
  mensagensConteudo: {
    padding: 10,
  },
  vazio: {
    color: '#9a9a9a',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  linhaEu: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginVertical: 4,
  },
  linhaIa: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginVertical: 4,
  },
  bolha: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bolhaEu: {
    backgroundColor: '#cfe4ff',
    borderBottomRightRadius: 4,
  },
  bolhaIa: {
    backgroundColor: '#e7e7ea',
    borderBottomLeftRadius: 4,
  },
  bolhaErro: {
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: '#f3c1bd',
  },
  textoBolha: {
    fontSize: 15,
    color: '#1c1c1e',
  },
  textoErro: {
    color: '#c62828',
  },
  textoPensando: {
    color: '#8a8a8e',
    fontStyle: 'italic',
  },
  tokens: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 2,
    marginLeft: 4,
  },
  entrada: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3',
    backgroundColor: '#ffffff',
  },
  campo: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    marginRight: 8,
    backgroundColor: '#ffffff',
  },
  botaoEnviar: {
    backgroundColor: '#2f6fdb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  botaoEnviarPressionado: {
    backgroundColor: '#245bb4',
  },
  botaoEnviarDesabilitado: {
    backgroundColor: '#b9cdec',
  },
  textoEnviar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
