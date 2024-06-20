import './App.css'
import OptionsProfitCalculator from './components/OptionsProfitCalculator';
import data from './data/sampledata.json';

function App() {
  return (
    <>
      <OptionsProfitCalculator data={data} />
    </>
  )
}

export default App
