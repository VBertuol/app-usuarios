// app/estilos.js
// Estilos comuns às telas, para o visual ficar parecido em todo o app.
import { StyleSheet } from 'react-native';

export const CORES = {
  fundo: '#f2f4f8',
  texto: '#1f2430',
  textoSuave: '#5b6270',
  borda: '#d3d8e0',
  primaria: '#2f6df6',
  perigo: '#d9534f',
  erro: '#c0392b',
  ok: '#1e7e34',
  avisoFundo: '#fff7e0',
  avisoBorda: '#f0d896',
  avisoTexto: '#8a5a00',
  placeholder: '#8a90a0',
};

export default StyleSheet.create({
  // Tela centralizada (login, principal, edição)
  tela: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CORES.fundo,
    padding: 24,
  },
  // Conteúdo do ScrollView do cadastro
  telaScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: CORES.fundo,
    padding: 24,
  },
  // Tela que começa no topo (lista de usuários)
  telaTopo: {
    flex: 1,
    backgroundColor: CORES.fundo,
    padding: 24,
  },
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titulo: { fontSize: 26, fontWeight: '700', color: CORES.texto },
  subtitulo: { fontSize: 15, color: CORES.textoSuave, marginTop: 4, marginBottom: 24 },
  rotulo: { fontSize: 14, fontWeight: '600', color: CORES.texto, marginBottom: 6 },
  campo: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
    color: CORES.texto,
  },
  botao: {
    backgroundColor: CORES.primaria,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoPerigo: { backgroundColor: CORES.perigo },
  botaoDesabilitado: { opacity: 0.55 },
  textoBotao: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  botaoSecundario: { alignItems: 'center', paddingVertical: 12, marginTop: 6 },
  textoBotaoSecundario: { color: CORES.primaria, fontSize: 15 },
  textoErro: { color: CORES.erro, fontSize: 14, marginBottom: 12 },
  textoOk: { color: CORES.ok, fontSize: 14, marginBottom: 12 },
  textoAviso: {
    color: CORES.avisoTexto,
    backgroundColor: CORES.avisoFundo,
    borderColor: CORES.avisoBorda,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    fontSize: 14,
  },
  itemLista: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  itemTitulo: { fontSize: 16, fontWeight: '600', color: CORES.texto },
  itemSubtitulo: { fontSize: 13, color: CORES.textoSuave, marginTop: 2 },
  // Janela de confirmação de exclusão
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  caixaModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  tituloModal: { fontSize: 18, fontWeight: '700', color: CORES.texto, marginBottom: 8 },
  textoModal: { fontSize: 15, color: CORES.textoSuave, marginBottom: 20 },
  linhaBotoesModal: { flexDirection: 'row' },
  botaoModal: {
    flex: 1,
    backgroundColor: '#e4e7ec',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  botaoModalExcluir: { marginRight: 0, backgroundColor: CORES.perigo },
  textoBotaoModal: { color: CORES.texto, fontWeight: '600', fontSize: 15 },
  textoBotaoModalExcluir: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
});
