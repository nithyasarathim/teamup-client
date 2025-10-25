import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserProvider from "./context/UserProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <div className='mx-20'>
      <App className=''/>
      </div>
    </UserProvider>
  </StrictMode>
)



