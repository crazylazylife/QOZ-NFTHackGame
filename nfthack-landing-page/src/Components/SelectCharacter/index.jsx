import React, {useEffect, useState} from "react";
import "./SelectCharacter.css";
import {ethers} from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/QOZContract.json';

const SelectCharacter = ({setCharacterNFT}) => {

  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);

  const localImageURIMapping = [
    "https://i.imgur.com/Nj1uqtp.png",
      "https://i.imgur.com/mjkQwKn.png",
  ]

  const mintCharacterNFTAction = (characterID) => async () => {
    try {
      if(gameContract) {
        setMintingCharacter(true);
        console.log("Minting charcater...");
        const mintTxn = await gameContract.mintCharacterNFT(characterID);
        await mintTxn.wait();
        console.log("MintTxn: ", mintTxn);

        setMintingCharacter(false);
      }
    } catch (error) {
      console.log("Character minting error: ", error)
      setMintingCharacter(false);
    }
  }

  useEffect(() => {
    const {ethereum} = window;
    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found!")
    }
  }, [])

  useEffect(() => {
    const getCharacters = async() => {
      try{
        console.log("Getting contract characters to mint!");

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("characetrsTxn: ", charactersTxn);

        const characters = charactersTxn.map((characterData) => transformCharacterData(characterData));

        setCharacters(characters);
      } catch (error) {
        console.log("Error in fetching characters: ", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`)


      if (gameContract){
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("Character NFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract){
      getCharacters();
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    };

    return () => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      };
    };

  }, [gameContract])

  const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={localImageURIMapping[index]} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));

  return (
    <div className="select-character-container">
      <h2>Mint your Hashira. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media.giphy.com/media/xT1Ra1uooTLFtYDYCQ/giphy.gif"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;