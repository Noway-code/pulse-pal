import * as React from 'react';
import { View, Text, Image } from 'react-native';
import {Button, Provider as PaperProvider, DefaultTheme, Card, Title, Paragraph, Divider} from 'react-native-paper';
import CarouselCards from "../../assets/CarouselCards";
import { useFonts, Roboto_500Medium, Roboto_700Bold, Roboto_100Thin, Roboto_300Light} from '@expo-google-fonts/roboto';

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
	let [fontsLoaded, fontError] = useFonts({
		Roboto_700Bold, Roboto_500Medium, Roboto_300Light, Roboto_100Thin
	});

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<PaperProvider theme={theme}>
			<View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.colors.background }}>
				<Title style={{ flex:0.5, color: theme.colors.primary, paddingBottom:250, fontFamily: 'Roboto_700Bold'}}>Welcome back, User</Title>
				{/*<Card style={{ width: '90%', margin: 10 }}>*/}
				{/*	<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />*/}
				{/*	<Card.Content>*/}
				{/*		<Title>Card title</Title>*/}
				{/*		<Paragraph>Card content</Paragraph>*/}
				{/*	</Card.Content>*/}
				{/*</Card>*/}
				<Divider style={{ width: '90%', margin: 10 }} />
				<View>
					<CarouselCards/>
				</View>
				{/*<Button icon="camera" mode="contained" onPress={() => navigation.navigate('Camera')} buttonColor={theme.colors.primary}>*/}
				{/*	Start Recording*/}
				{/*</Button>*/}
				{/*<Button icon="chart-bar" mode="outlined" onPress={() => navigation.navigate('Statistics')} buttonColor={theme.colors.primary} style={{ marginTop: 10 }}>*/}
				{/*	View Statistics*/}
				{/*</Button>*/}
				{/*<Text style={{ marginTop: 20, fontSize: 16, color: theme.colors.secondary }} >*/}
				{/*	This is a sample text. You can replace it with any text you want.*/}
				{/*</Text>*/}
			</View>
		</PaperProvider>
	);
}
