import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

export const SLIDER_WIDTH = Dimensions.get('window').width + 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselCardItem = ({ item, index }) => {
	const navigation = useNavigation();

	const handlePress = () => {
		switch(index) {
			case 0:
				navigation.navigate('Camera');
				break;
			case 1:
				navigation.navigate('Statistics');
				break;
			default:
				break;
		}
	};

	return (
		<TouchableOpacity onPress={handlePress} style={styles.container} key={index}>
			<View >
				<Image
					source={{ uri: item.imgUrl }}
					style={styles.image}
					resizeMode="cover"
				/>
				<Text style={styles.header}>{item.title}</Text>
				<Text style={styles.body}>{item.body}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: .5,
		justifyContent: 'flex-end',
		backgroundColor: 'rgb(0,185,255)',
		borderRadius: 8,
		width: ITEM_WIDTH,
		paddingBottom: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 7,
		overflow: "visible",
	},
	image: {
		width: ITEM_WIDTH,
		height: 170,
		borderRadius: 10,
		overflow: "hidden",
	},
	header: {
		color: "#003459",
		fontSize: 24,
		fontWeight: "bold",
		paddingLeft: 20,
		fontFamily: 'Roboto_700Bold'
	},
	body: {
		color: "#003459",
		fontSize: 18,
		paddingLeft: 20,
		paddingRight: 20,
		fontFamily: 'Roboto_300Light'
	}
});

export default CarouselCardItem;
