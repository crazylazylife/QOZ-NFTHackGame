const CONTRACT_ADDRESS = "0x1829B7dbe30814422b7a783Cd1a7d153a320E758"

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    chakra: characterData.chakra.toNumber(),
    intelligence: characterData.intelligence,
    notes: characterData.notes,
  };
}

export {CONTRACT_ADDRESS, transformCharacterData}