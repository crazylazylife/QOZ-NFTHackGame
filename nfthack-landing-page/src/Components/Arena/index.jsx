import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/QOZContract.json';
import './Arena.css';

const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  return (
    <div className="arena-container">
      {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src="https://i.imgur.com/Nj1uqtp.png"
                alt={`Character ${characterNFT.name}`}
              />
              <div className="stat-bar">
                <progress value={characterNFT.chakra} max={5000} />
                <p>{`${characterNFT.chakra} / ${5000} Chakra`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`Notes: ${characterNFT.notes}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Arena;