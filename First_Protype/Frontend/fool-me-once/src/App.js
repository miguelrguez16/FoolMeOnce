import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './Components/Navigation/Navigation';
import Footer from './Components/Footer/Footer';

// Pages
import Home from './Pages/Home';
import Listado from './Pages/Listado';
import Create from './Pages/Create';
import Register from './Pages/Register';
import NoPage from './Pages/NoPage';
import SingleElectoralPromise from './Pages/SingleElectoralPromise';

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
  const [connected, setConnected] = useState(false);
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
    const isConnected = await electoralManager.name() === "FoolMeOnce" ? true : false;
    setConnected(isConnected);
    getUserId(electoralManager);
  }

  const getUserId = async (electoralManager) => {
    let userIdentifier = await electoralManager.checkMyIdentifier();
    console.log(`User identifier: ${userIdentifier.toNumber()}`);
    setIdUser(userIdentifier.toNumber());
    setLoading(false);
  }

  useEffect(() => {


  }, [isWallet, idUser, setIdUser]);

  return (
    <BrowserRouter>
      <div className='App'>
        <Navigation web3Handler={web3Handler} userAccount={userAccount} idUser={idUser} connected={connected} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listado" element={<Listado electoralManager={electoralManager} userAccount={userAccount} />} />
          <Route path="/listado/:tokenId" element={<SingleElectoralPromise electoralManager={electoralManager} userAccount={userAccount} />} />
          <Route path="/create" element={
            <Create electoralManager={electoralManager} userAccount={userAccount} />} />
          <Route path="/register" element={
            <Register electoralManager={electoralManager} setIdUser={setIdUser} userAccount={userAccount} />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
