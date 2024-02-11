import MainContainer from "./navigation/mainContainer";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";


const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: 'tomato',
		secondary: 'yellow',
	},
};


export default function App() {
	return (
	<PaperProvider theme={theme}>
		<MainContainer />
	</PaperProvider>
	);
}
