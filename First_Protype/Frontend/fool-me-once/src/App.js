import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './Components/Navigation/Navigation';
import Footer from './Components/Footer/Footer';

// Pages
import Home from './Pages/Home';
import ListElectoralPromise from './Pages/ListElectoralPromise';
import CreateElectoralPromise from './Pages/CreateElectoralPromise';
import Register from './Pages/Register';
import NoPage from './Pages/NoPage';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

// Carga Smart Contracts
import ElectoralManagerAbi from '../src/contractsData/ElectoralManager.json'
import ElectoralManagerAddress from '../src/contractsData/ElectoralManager-address.json'

function App() {
  const [loading, setLoading] = useState(true);
  const [userAccount, setUserAccount] = useState(null);
  const [electoralManager, setElectoralManager] = useState({});
  const [isWallet, setWallet] = useState(false); // para controlar si se conecta una wallet
  const [idUser, setIdUser] = useState(0);

  const web3Handler = async () => {

    if (!window.ethereum) {
      setWallet(false);
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)
    setUserAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setUserAccount(accounts[0]);
      await web3Handler();
    })

    loadContracts(signer);
  }

  const loadContracts = async (signer) => {
    const electoralManager = new ethers.Contract(ElectoralManagerAddress.address, ElectoralManagerAbi.abi, signer);
    setElectoralManager(electoralManager);
    console.log(electoralManager)
    const nombre = await electoralManager.name();
    console.log(nombre);
    getUserId(electoralManager);
  }

  const getUserId = async (electoralManager) => {
    let userIdentifier = await electoralManager.checkMyIdentifier();
    userIdentifier = parseInt(userIdentifier, 16)
    console.log(`User identifier: ${userIdentifier}`);
    setIdUser(userIdentifier);
    setLoading(false);

  }

  const setUserIdentifier = (newIdentifier) => {
    setIdUser(newIdentifier);
  }

  useEffect(() => {

  }, [isWallet, idUser]);

  return (
    <BrowserRouter>
      <div className='App'>
        <Navigation web3Handler={web3Handler} userAccount={userAccount} idUser={idUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listado" element={<ListElectoralPromise electoralManager={electoralManager} />} />
          <Route path="/create" element={<CreateElectoralPromise electoralManager={electoralManager} />} />
          <Route path="/register" element={<Register electoralManager={electoralManager} setUserIdentifier={setUserIdentifier} />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
