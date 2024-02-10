import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import the screens
import HomeScreen from './screens/HomeScreen';
import CameraScreen from "./screens/CameraScreen";
import StatisticsScreen from "./screens/StatisticsScreen";

// Screen Names
const Home = "Home";
const Camera = "Camera";
const Settings = "Settings";

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

function MainContainer() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName={Home}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						switch (route.name) {
							case Home:
								iconName = focused ? 'home' : 'home-outline';
								break;
							case Camera:
								iconName = focused ? 'camera' : 'camera-outline';
								break;
							case Settings:
								iconName = focused ? 'settings' : 'settings-outline';
								break;
							default:
								iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
								break;
						}
						return <Ionicons name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: 'tomato',
					tabBarInactiveTintColor: 'grey',
					tabBarLabelStyle: {
						fontSize: 10
					},
					tabBarStyle: {
						display: 'flex',
						padding: 10,
						height: 70
					}
				})}
			>
				<Tab.Screen name={Home} component={HomeScreen} />
				<Tab.Screen name={Camera} component={CameraScreen} />
				<Tab.Screen name={Settings} component={StatisticsScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}

export default MainContainer;
