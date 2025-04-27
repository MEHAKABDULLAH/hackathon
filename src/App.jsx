
import './App.css'
import AppRoutes from './AppRoute'

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
   
      <AppRoutes />
      
    </>
  )
}

export default App
