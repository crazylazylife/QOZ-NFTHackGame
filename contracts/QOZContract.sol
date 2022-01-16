//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./libraries/Base64.sol";

// Imports necessary for NFT minting
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract QOZContract is ERC721 {
    //Defining the character's attributes in the game
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 chakra;
        uint256 intelligence;
        string notes;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    mapping(address => uint256) public nftHolders;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterChakra,
        uint256[] memory characterIntelligence,
        string[] memory characterNotes
    ) ERC721("Hashiras", "Hashira") {
        //Lopp through all the characters and save their values in out contracts so we can use them later
        // when we mint out NFT
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    chakra: characterChakra[i],
                    intelligence: characterIntelligence[i],
                    notes: characterNotes[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];
            console.log(
                "Done initializing %s w/ Chakra %s, img %s",
                c.name,
                c.chakra,
                c.imageURI
            );
        }
        _tokenIds.increment();
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            chakra: defaultCharacters[_characterIndex].chakra,
            intelligence: defaultCharacters[_characterIndex].intelligence,
            notes: defaultCharacters[_characterIndex].notes
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        nftHolders[msg.sender] = newItemId;
        _tokenIds.increment();

        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strChakra = Strings.toString(charAttributes.chakra);
        string memory strIntelligence = Strings.toString(
            charAttributes.intelligence
        );
        string memory strNotes = charAttributes.notes;

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        charAttributes.name,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                        charAttributes.imageURI,
                        '", "attributes": [ { "trait_type": "Health Points", "value": ',
                        strChakra,
                        ', "intelligence":',
                        strIntelligence,
                        '}, {"notes": ',
                        strNotes,
                        "} ]}"
                    )
                )
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function updateNotes(string memory newNotes) public {
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        player.notes = string(abi.encodePacked(player.notes, "\n", newNotes));

        // console.log(
        //     "\nPlayer w/ character %s about to attack. Has %s chakra, %s intelligence and Notes: %s",
        //     player.name,
        //     player.chakra,
        //     player.intelligence,
        //     player.notes
        // );
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        uint256 userNftTokenId = nftHolders[msg.sender];

        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }
}
