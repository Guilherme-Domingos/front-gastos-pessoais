import AppRoutes from "./routes"
import { BrowserRouter } from 'react-router-dom';
import { TransactionProvider } from "./contexts/TransactionContext";
import { CategoryProvider } from "./contexts/CategoryContext"
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <TransactionProvider>
            <CategoryProvider>
              <AppRoutes />
            </CategoryProvider>
          </TransactionProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
