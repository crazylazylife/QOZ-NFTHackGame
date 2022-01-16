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
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log("Minted NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #2");

  // txn = await gameContract.mintCharacterNFT(1);
  // await txn.wait();
  // console.log("Minted NFT #3");

  // txn = await gameContract.mintCharacterNFT(0);
  // await txn.wait();
  // console.log("Minted NFT #4");

  // console.log("Done deploying and minting!");

  // txn = await gameContract.mintCharacterNFT(20);
  // await txn.wait();

  // txn = await gameContract.updateNotes();
  // await txn.wait();

  // console.log("Done!");
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
