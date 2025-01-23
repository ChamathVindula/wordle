import './App.css';
import Padder from './Padder';
import GameCanvas from './GameCanvas';

function App() {
  return (
    <div className="app">
      <Padder />
      <GameCanvas />
      <Padder />
    </div>
  );
}

export default App;