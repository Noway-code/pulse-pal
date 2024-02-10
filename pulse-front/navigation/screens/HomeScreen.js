import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text
				onPress={() => alert('This is the "Home" screen.')}
				style={{ fontSize: 26, fontWeight: 'bold' }}>
					Home Screen
			</Text>
			<Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
				Press me
			</Button>
		</View>
	);
}
