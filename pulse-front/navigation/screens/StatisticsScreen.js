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

	const [items] = React.useState([
		{
			key: 1,
			name: '02-10 @ 10:00 AM',
			hrv: 65,
			bp: 16,
		},
		{
			key: 2,
			name: '02-09 @ 11:20 AM',
			hrv: 262,
			bp: 16,
		},
		{
			key: 3,
			name: '02-08 @ 9:04 AM',
			hrv: 159,
			bp: 6,
		},
		{
			key: 4,
			name: '02-07 @ 2:43 AM',
			hrv: 305,
			bp: 3.7,
		},
	]);

	const from = page * itemsPerPage;
	const to = Math.min((page + 1) * itemsPerPage, items.length);

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
			<DataTable>
				<DataTable.Header>
					<DataTable.Title>Your Health Data</DataTable.Title>
					<DataTable.Title numeric>Avg. HRV</DataTable.Title>
					<DataTable.Title numeric>Avg .Blood Pressure</DataTable.Title>
				</DataTable.Header>

				{items.slice(from, to).map((item) => (
					<DataTable.Row key={item.key}>
						<DataTable.Cell>{item.name}</DataTable.Cell>
						<DataTable.Cell numeric>{item.hrv}</DataTable.Cell>
						<DataTable.Cell numeric>{item.bp}</DataTable.Cell>
					</DataTable.Row>
				))}

				<DataTable.Pagination
					page={page}
					numberOfPages={Math.ceil(items.length / itemsPerPage)}
					onPageChange={(page) => setPage(page)}
					label={`${from + 1}-${to} of ${items.length}`}
					numberOfItemsPerPageList={numberOfItemsPerPageList}
					numberOfItemsPerPage={itemsPerPage}
					onItemsPerPageChange={onItemsPerPageChange}
					showFastPaginationControls
					selectPageDropdownLabel={'Rows per page'}
				/>
			</DataTable>
			<Divider />
			<Text>Statistics Screen</Text>
		</View>
	);
}
