import AppRoutes from "./routes"
import { BrowserRouter } from 'react-router-dom';
import { TransactionProvider } from "./contexts/TransactionContext";
import { CategoryProvider } from "./contexts/CategoryContext"

function App() {

  return (
    <>
    <div>
      <TransactionProvider>
        <CategoryProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        </CategoryProvider>
      </TransactionProvider>
    </div>
    </>
  )
}

export default App
