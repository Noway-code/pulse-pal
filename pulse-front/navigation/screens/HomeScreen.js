import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Provider as PaperProvider, DefaultTheme, Card, Title, Paragraph } from 'react-native-paper';

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#00a8e8',
		secondary: '#007ea7',
		tertiary: '#003459',
		accent: '#00171f',
		background: 'white',
	},
};

export default function HomeScreen({ navigation }) {
	return (
		<PaperProvider theme={theme}>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
				<Title style={{ color: theme.colors.primary }}>Welcome to Our App</Title>
				<Card style={{ width: '90%', margin: 10 }}>
					<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
					<Card.Content>
						<Title>Card title</Title>
						<Paragraph>Card content</Paragraph>
					</Card.Content>
				</Card>
				<Button icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')} color={theme.colors.primary}>
					Start Recording
				</Button>
				<Button icon="chart-bar" mode="outlined" onPress={() => navigation.navigate('Statistics')} color={theme.colors.primary} style={{ marginTop: 10 }}>
					View Statistics
				</Button>
				<Text style={{ marginTop: 20, fontSize: 16, color: theme.colors.secondary }} >
					This is a sample text. You can replace it with any text you want.
				</Text>
			</View>
		</PaperProvider>
	);
}
