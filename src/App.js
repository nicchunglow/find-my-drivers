import { Container } from "@material-ui/core";
import "./App.css";
import MainPage from "./Containers/MainPage";

function App() {
	return (
		<Container display="flex" justifyContent="center">
			<MainPage />
		</Container>
	);
}

export default App;
