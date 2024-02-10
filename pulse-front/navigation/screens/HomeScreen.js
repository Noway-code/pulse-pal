import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Provider as PaperProvider, DefaultTheme, Card, Title, Paragraph } from 'react-native-paper';

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#0091ff',
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
				<Button icon="camera" mode="contained" onPress={() => console.log('Pressed')} color={theme.colors.primary}>
					Start Recording
				</Button>
				<Button icon="chart-bar" mode="outlined" onPress={() => console.log('Pressed')} color={theme.colors.primary} style={{ marginTop: 10 }}>
					View Statistics
				</Button>
				<Text style={{ marginTop: 20, fontSize: 16, color: theme.colors.primary }}>
					This is a sample text. You can replace it with any text you want.
				</Text>
			</View>
		</PaperProvider>
	);
}
