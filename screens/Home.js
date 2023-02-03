import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import PalettePreview from '../components/PalettePreview';

const Home = ({navigation, route}) => {
  const newColorPalette = route.params
    ? route.params.newColorPalette
    : undefined;
  const [colorPalettes, setColorPalettes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchColorPalettes = useCallback(async () => {
    const result = await fetch(
      'https://color-palette-api.kadikraman.now.sh/palettes',
    );
    if (result.ok) {
      const palettes = await result.json();
      setColorPalettes(palettes);
    }
  }, []);

  useEffect(() => {
    fetchColorPalettes();
  }, [fetchColorPalettes]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchColorPalettes();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  });

  useEffect(() => {
    if (newColorPalette) {
      setColorPalettes(palettes => [newColorPalette, ...palettes]);
    }
  }, [newColorPalette]);

  return (
    <FlatList
      style={styles.list}
      data={colorPalettes}
      keyExtractor={item => item.paletteName}
      renderItem={({item}) => (
        <PalettePreview
          handlePress={() => navigation.navigate('ColorPalette', item)}
          colorPalette={item}
        />
      )}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ColorPaletteModal');
          }}>
          <Text style={styles.heading}>Add a Color Scheme</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: '10',
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'teal',
  },
});

export default Home;
