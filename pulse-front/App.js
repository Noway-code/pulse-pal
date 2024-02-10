import { StatusBar } from 'expo-status-bar';
import {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.front);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	const [isCameraVisible, setIsCameraVisible] = useState(false);
	const cameraRef = useRef(null);

	useEffect(() => {
		(async () =>{
			MediaLibrary.requestPermissionsAsync();
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === 'granted');
		})();
	}, []);

	const handlePress = () => {
		setIsCameraVisible(!isCameraVisible);
	}

	return (
		<View style={styles.container}>
			<Button title="Start Camera" onPress={handlePress} />
			{isCameraVisible && (
				<Camera
					style={styles.camera}
					type={type}
					flashMode = {flash}
					ref={cameraRef}
				>
					<Text>in camera</Text>
				</Camera>
			)}
			{(hasCameraPermission) ? (<Text>YA</Text>) : (<Text>Nah</Text>)}
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'gray',
		alignItems: 'center',
		justifyContent: 'center',
	},
	camera:{
		width: Dimensions.get('window').width / 1.5,
		height: Dimensions.get('window').height / 1.5,
		borderRadius: 20,
	}
});
