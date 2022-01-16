import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import './App.css';
import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/QOZContract.json';
import LoadingIndicator from './Components/LoadingIndicator';


const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
        * User can have multiple authorized accounts, we grab the first one if its there!
        */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const renderContent = () => {
    if (isLoading) {
      // return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    }
    else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
    else if(currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  }
  useEffect(() => {
    setIsLoading(true);
    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== '4') {
          alert("Please connect to Rinkeby!")
        }
      } catch (error) {
        console.log(error)
      }
    }
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking for Hashira NFT on address: ", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      )

      const txn = await gameContract.checkIfUserHasNFT({ gasLimit: 300000 });
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }

      setIsLoading(false);
    };

    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Quest Of Zelda</p>
          <p className="sub-text">Find your way out of the curse and learn to live life</p>
        </div>
      </div>
      <div className="container">
        <div className="story-container">
          <p className="story gradient-text">The curse of the Green Sage is real. Legend has it that when a prosporous kingdom Zelda was destroyed by the evil conquerers, the Green Sage exercised the great curse upon the people of the land that turned them into monster. Their only way of salvation was to find the Orb of Truth, that was lost to mankind with time. While people slowly accepted these monsters, they still remain outcasted from most human activities. Their only objective from birth is to find the lost Kingdom of Zelda and retrun back to human form. People hope they find their way back to humanity one day.
          </p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
