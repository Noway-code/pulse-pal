import * as React from 'react';
import {FlatList, Text, Image, View, SafeAreaView, Dimensions, StyleSheet, ImageBackground} from 'react-native';
import {Button, Provider as PaperProvider, DefaultTheme, Card, Title, Paragraph, Divider} from 'react-native-paper';
import CarouselCards from "../../assets/CarouselCards";
import { useFonts, Roboto_500Medium, Roboto_700Bold, Roboto_100Thin, Roboto_300Light} from '@expo-google-fonts/roboto';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';


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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	box: {
		width: '90%',
		backgroundColor: 'rgba(28, 139, 219, 0.25)', // Change color or add additional styles as needed
		borderRadius: 10,
		margin: 10,
	},
	bigBox: {
		width: '90%',
		backgroundColor: '#4a6388',
		borderRadius: 10,
		borderColor: '#00a8e8',
		borderWidth: 3, // Increase the border width
		borderStyle: 'dashed',
		margin: 10,
		justifyContent: 'center', // Center children vertically
		alignItems: 'center', // Center children horizontally
	},
});


const BoxList = () => {
	return (
		<View style={styles.container}>
			<View style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:20}}>
				<Image source={require('../../assets/imgTransparent.png')} style={{width: 200, height: 200}} />
			</View>
			<View style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
				<View style={[styles.box, { height: Dimensions.get('window').height * 0.12, padding:10}]}>
					<Text style={{color:'#dedcdc', fontFamily: 'Roboto_700Bold', fontSize: 20}}>Fun Fact: </Text>
					<Text style={{color:'#dedcdc', marginTop:10}}>The human body has more than 60,000 miles of blood vessels.</Text>
				</View>
			</View>

			<View style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
				<View style={[styles.bigBox, { height: Dimensions.get('window').height * 0.41 }]}>
					<View style={{
						width: 150, // Adjust the size as needed
						height: 150, // Adjust the size as needed
						borderRadius: 90, // Half of your width and height
						backgroundColor: 'white',
						justifyContent: 'center', // Center the image vertically
						alignItems: 'center', // Center the image horizontally
					}}>
						<Image source={require('../../assets/icons8-camera-100.png')} style={{width: 100, height: 100}} />
					</View>
				</View>
			</View>
		</View>
	);
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
			<ImageBackground source={require('../../assets/memphis-mini.png')} style={{flex: 1, resizeMode: "cover", justifyContent: "center", }}>
				<View style={{backgroundColor: '#1f2126', flex: 1}}>
					<SafeAreaView style={{flex: 1}}>
				{/*<LinearGradient*/}
				{/*	colors={['rgba(196,224,255,0.94)', 'rgba(190,238,255,0.94)', 'rgba(156,225,255,0.94)']}*/}
				{/*	start={[0, 0]}*/}
				{/*	end={[1, 1]}*/}
				{/*	style={{ flex: 1, alignItems: 'center' }}>*/}

					{/*<Title style={{ flex:0.5, color: theme.colors.primary, paddingBottom:250, fontFamily: 'Roboto_700Bold'}}>Welcome back, User</Title>*/}
					{/*<Divider style={{ width: '90%', margin: 20 }} />*/}
					{/*<View style={{marginTop:10}}>*/}
					{/*	<CarouselCards/>*/}
					{/*</View>*/}
				{/*</LinearGradient>*/}
					<BoxList />
					</SafeAreaView>
				</View>
			</ImageBackground>
		</PaperProvider>
	);
}
