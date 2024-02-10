import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, Button, SafeAreaView } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {Video} from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from '@react-navigation/native';

export default function CameraScreen({ navigation }) {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.front);
	const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
	const [recording, setRecording] = useState(false);
	const [video, setVideo] = useState(null);
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

	const saveVideoToLocalDirectory = async (videoUri) => {
		try {
			// Get the file name
			const fileUri = videoUri.split('/').pop();
			const newFileUri = FileSystem.documentDirectory + fileUri;
			alert(newFileUri);
			// Copy the video to the app's document directory
			await FileSystem.copyAsync({
				from: videoUri,
				to: newFileUri,
			});

			console.error('Video saved to document directory successfully!');

			return newFileUri; // Return the new file URI if needed
		} catch (error) {
			console.error('Failed to save video to document directory:', error);
			return null;
		}
	};
	let recordVideo = () => {
		setRecording(true);
		let options = {
			quality: "1080p",
			maxDuration: 60,
			mute: true
        };
		cameraRef.current.recordAsync(options).then((recordedVideo) => {
			//saveVideoToLocalDirectory(recordedVideo.uri);
			setVideo(recordedVideo);
			setRecording(false);
		});
    };

	let stopRecording = () => {
		setRecording(false);
		cameraRef.current.stopRecording();
    };

	if(video){
		return (
			<SafeAreaView style={styles.container}>
				<Video
					style={styles.camera}
					source={{uri: video.uri}}
					autoplay
					useNativeControls
					resizeMode = 'contain'
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
				type={type}
				flashMode = {flash}
				ref={cameraRef}
			>
				<View style={styles.buttonContainer}>
					<Button title={recording ? "Stop Recording" : "Record Video"} onPress={recording ? stopRecording : recordVideo} />
				</View>
			</Camera>
			<View>

			</View>
			{(hasCameraPermission) ? (<Text>Camera permission on</Text>) : (<Text>Camera permission off</Text>)}
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
	},
	buttonContainer: {
		backgroundColor: "#fff",
		alignSelf: "flex-end",

	}
});

