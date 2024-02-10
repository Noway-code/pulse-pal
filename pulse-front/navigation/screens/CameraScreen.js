import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from '@react-navigation/native';

export default function CameraScreen({ navigation }) {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [video, setVideo] = useState(null);
	const [recording, setRecording] = useState(false);
	const cameraRef = useRef(null);

	const initializeCamera = async () => {
		const cameraStatus = await Camera.requestCameraPermissionsAsync();
		setHasCameraPermission(cameraStatus.status === 'granted');
	};

	useEffect(() => {
		MediaLibrary.requestPermissionsAsync();
		initializeCamera();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			initializeCamera();
			return () => {
				if (recording) {
					stopRecording();
				}
			};
		}, [])
	);

	let recordVideo = async () => {
		setRecording(true);
		let options = {
			quality: "1080p",
			maxDuration: 60,
			mute: true
		};
		try {
			const recordedVideo = await cameraRef.current.recordAsync(options);
			if (recordedVideo && recordedVideo.uri) {
				console.log('Recorded video URI:', recordedVideo.uri);
				// Now you can use recordedVideo.uri to send the video URI to your Flask backend
			} else {
				console.error('Failed to record video: recordedVideo or recordedVideo.uri is undefined');
			}
			setRecording(false);
		} catch (error) {
			console.error('Failed to record video:', error);
			setRecording(false);
		}
	};


	let stopRecording = async () => {
		if (recording) {
			setRecording(false);
			try {
				await cameraRef.current.stopRecording();
			} catch (error) {
				console.error('Failed to stop recording:', error);
			}
		}
	};

	if (video) {
		return (
			<SafeAreaView style={styles.container}>
				<Video
					style={styles.camera}
					source={{ uri: video.uri }}
					autoplay
					useNativeControls
					resizeMode='contain'
					isLooping
				/>
			</SafeAreaView>
		);
	}
	return (
		<View style={styles.container}>
			<Text></Text>
			<Camera
				style={styles.camera}
				ref={cameraRef}
			>
				<View style={styles.buttonContainer}>
					<Button title={recording ? "Stop Recording" : "Record Video"} onPress={recording ? stopRecording : recordVideo} />
				</View>
			</Camera>
			<View>
				{(hasCameraPermission) ? (<Text>Camera permission on</Text>) : (<Text>Camera permission off</Text>)}
			</View>
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
	camera: {
		width: Dimensions.get('window').width / 1.5,
		height: Dimensions.get('window').height / 1.5,
		borderRadius: 20,
	},
	buttonContainer: {
		backgroundColor: "#fff",
		alignSelf: "flex-end",
	}
});
