import { useState } from 'react';
import {
  FlatList,
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { limpar, salvar } from '../storage/historico';

export default function HistoricoScreen({ route, navigation }) {
  // Evolução 1: a lista vira estado para a tela poder mudar
  const [lista, setLista] = useState(route.params.historico);

  // Evolução 1: apaga do celular (AsyncStorage) e da tela
  async function limparHistorico() {
    await limpar();
    setLista([]);
  }

  // Evolução 2: remove só uma conta, sem mexer na lista original (filter cria outra)
  async function excluir(id) {
    const nova = lista.filter((item) => item.id !== id);
    setLista(nova);
    await salvar(nova);
  }

  // Evolução 3: volta para a Home levando o resultado da conta tocada.
  // popTo volta para a Home que já existe (navigate empilharia uma segunda Home).
  // A "chave" muda a cada toque para o useEffect da Home rodar mesmo se o
  // valor for o mesmo (desafio extra).
  function reutilizar(item) {
    navigation.popTo('Home', { valor: item.resultado, chave: Date.now() });
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.lista}
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.conta}
              onPress={() => reutilizar(item)}
            >
              <Text style={styles.linha}>
                {item.conta} = {item.resultado}
              </Text>
            </TouchableOpacity>
            <Button
              title="Excluir"
              color="#c0392b"
              onPress={() => excluir(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.linha}>Nenhuma conta ainda</Text>}
      />

      <View style={styles.botaoLimpar}>
        <Button title="Limpar histórico" onPress={limparHistorico} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a0303' },
  lista: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  conta: { flex: 1 },
  linha: { fontSize: 24, padding: 12, color: 'white' },
  botaoLimpar: {
    margin: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});
