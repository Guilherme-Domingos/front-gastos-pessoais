import AppRoutes from "./routes"
import { BrowserRouter } from 'react-router-dom';
import { TransactionProvider } from "./contexts/TransactionContext";

function App() {

  return (
    <>
    <div>
      <TransactionProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TransactionProvider>
    </div>
    </>
  )
}

export default App
