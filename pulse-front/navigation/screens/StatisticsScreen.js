import * as React from 'react';
import { View, Text } from 'react-native';
import client from '../../api/client.js';
import {useState, useEffect} from "react";

export default function StatisticsScreen({navigation}) {
	const [stats, setStats] = useState(null);

	useEffect(() => {
		client.get("test").then(
			(response) => {
				setStats(response.data);
			}
		)
	}, []);

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text
				onPress={() => navigation.navigate('Home')}
				style={{ fontSize: 26, fontWeight: 'bold' }}>Statistics Screen {stats}</Text>
		</View>
	);
}
