import * as React from 'react';
import {Text, Image, View} from 'react-native';
import {Button, Provider as PaperProvider, DefaultTheme, Card, Title, Paragraph, Divider} from 'react-native-paper';
import CarouselCards from "../../assets/CarouselCards";
import { useFonts, Roboto_500Medium, Roboto_700Bold, Roboto_100Thin, Roboto_300Light} from '@expo-google-fonts/roboto';
import { LinearGradient } from 'expo-linear-gradient';


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
			<LinearGradient
				colors={['rgba(196,224,255,0.94)', 'rgba(190,238,255,0.94)', 'rgba(156,225,255,0.94)']}
				start={[0, 0]}
				end={[1, 1]}
				style={{ flex: 1, alignItems: 'center' }}>
				<Title style={{ flex:0.5, color: theme.colors.primary, paddingBottom:250, fontFamily: 'Roboto_700Bold'}}>Welcome back, User</Title>
				<Divider style={{ width: '90%', margin: 20 }} />
				<View style={{marginTop:10}}>
					<CarouselCards/>
				</View>
			</LinearGradient>
		</PaperProvider>
	);
}
