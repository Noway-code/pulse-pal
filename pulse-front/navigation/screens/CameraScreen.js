import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from '@react-navigation/native';

export default function CameraScreen({ navigation }) {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [video, setVideo] = useState(null);
	const [recording, setRecording] = useState(false);
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // Initially set to back camera
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
			mute: true,
		};
		try {
			const recordedVideo = await cameraRef.current.recordAsync(options);
			if (recordedVideo && recordedVideo.uri) {
				console.log('Recorded video URI:', recordedVideo.uri);
				// Send the recorded video to the Flask backend
				sendVideoToBackend(recordedVideo.uri);
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

	const sendVideoToBackend = async (videoUri) => {
		try {
			const videoFile = await FileSystem.readAsStringAsync(videoUri, { encoding: FileSystem.EncodingType.Base64 });
			const formData = new FormData();
			formData.append('video', {
				uri: videoUri,
				type: 'video/mp4',
				name: 'recorded-video.mp4',
			});

			const requestOptions = {
				method: 'POST',
				body: formData,
				redirect: 'follow',
			};

			const response = await fetch('http://100.66.10.237:5000/upload-video', requestOptions);

			if (response.ok) {
				console.log('Video uploaded successfully');
			} else {
				console.error('Failed to upload video:', response.status);
			}
		} catch (error) {
			console.error('Error uploading video:', error);
		}
	};

	const flipCamera = () => {
		setCameraType(
			cameraType === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back
		);
	};

	const handleDoubleTap = () => {
		flipCamera();
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
			<TouchableOpacity activeOpacity={1} onPress={handleDoubleTap} onDoublePress={handleDoubleTap} style={styles.cameraContainer}>
				<Camera
					style={styles.camera}
					type={cameraType}
					ref={cameraRef}
					autoFocus={Camera.Constants.AutoFocus.on}
				>
					<View style={styles.overlay} />
					<View style={styles.buttonContainer}>
						<Button title={recording ? "Stop Recording" : "Record Video"} onPress={recording ? stopRecording : recordVideo} />
					</View>
				</Camera>
			</TouchableOpacity>
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
	cameraContainer: {
		flex: 1,
		width: '90%',
		height: '90%',
		borderRadius: 20,
		overflow: 'hidden',
	},
	camera: {
		flex: 1,
		borderRadius: 20,
	},
	buttonContainer: {
		backgroundColor: "#fff",
		alignSelf: "flex-end",
		flexDirection: 'row', // Added to align buttons horizontally
		justifyContent: 'space-between', // Added to distribute space evenly between buttons
	},
	overlay: {
		position: 'absolute',
		top: '35%', // Adjust position to center
		left: '25%', // Adjust position to center
		width: '50%', // Adjust size as needed
		height: '40%', // Adjust size as needed
		borderWidth: 2,
		borderColor: 'red',
		backgroundColor: 'transparent',
	}
});
