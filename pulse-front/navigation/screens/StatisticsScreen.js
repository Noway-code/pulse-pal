import * as React from 'react';
import { View, Text } from 'react-native';
import client from '../../api/client.js';
import {useState, useEffect} from "react";
import {DataTable, Divider} from 'react-native-paper';

export default function StatisticsScreen({navigation}) {
	const [stats, setStats] = useState(null);
	const [page, setPage] = React.useState(0);
	const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
	const [itemsPerPage, onItemsPerPageChange] = React.useState(
		numberOfItemsPerPageList[0]
	);

	React.useEffect(() => {
		setPage(0);
	}, [itemsPerPage]);

	useEffect(() => {
		client.get("test").then(
			(response) => {
				setStats(response.data);
			}
		)
	}, []);

	return (
		<View>
			<Divider />
			<Text>Statistics Screen</Text>
		</View>
	);
}
