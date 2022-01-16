const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory(
    "QOZContract"
  );
  const gameContract = await gameContractFactory.deploy(
    ["Tanjiro", "Zeinitsu"],
    [
      "https://imgur.com/Nj1uqtp", // Images
      "https://imgur.com/mjkQwKn",
    ],
    [2000, 1000],
    [500, 1600],
    ["", ""]
  );
  await gameContract.deployed();

  console.log("Contract deployed to: ", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();

  txn = await gameContract.updateNotes("People are foolish");
  await txn.wait();

  // let txn;
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();

  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI: ", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
