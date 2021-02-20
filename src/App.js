import { GitHub } from "./containers/github";
import { GitHubRxJs } from "./containers/github-rxjs";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>GitHub</h1>
      <h2>User Search</h2>
      {/* <GitHub /> */}
      <GitHubRxJs />
    </div>
  );
}
