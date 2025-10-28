import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'



import { CookiesProvider } from 'react-cookie';
import RefreshLoader from './components/RefreshLoader';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
       <CookiesProvider>
           <App/>
       </CookiesProvider>
  </BrowserRouter>  
);

reportWebVitals();
