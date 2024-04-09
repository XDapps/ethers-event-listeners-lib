import { ethers } from "ethers";
import { ERC_721_EVENTS } from "@xdapps/erc-token-utils";
import { NFT721TransferEvent } from "./NFT721TransferEvent";


export class ERC721TransferListeners {
	private static instance: ERC721TransferListeners;

	contractAddresses: string[] = [];
	ethersProvider: ethers.providers.Provider;
	isRunning: boolean = false;

	private constructor(contractAddresses: string[], provider: ethers.providers.Provider) {
		this.contractAddresses = contractAddresses;
		this.ethersProvider = provider;
		// Bind this to the event handlers
		this._setContractListener = this._setContractListener.bind(this);
	};


	static getInstance(contractAddresses: string[], provider: ethers.providers.Provider) {
		if (!ERC721TransferListeners.instance) {
			ERC721TransferListeners.instance = new ERC721TransferListeners(contractAddresses, provider);
		}
		return ERC721TransferListeners.instance;
	}

	async start(callback: (event: NFT721TransferEvent) => void): Promise<void> {
		if (!this.isRunning) {
			this.isRunning = true;
			this.contractAddresses.forEach((address) => {
				this._setContractListener(address, callback);
			});
		}
	}
	private _setContractListener(contractAddress: string, callback: (event: NFT721TransferEvent) => void) {
		const contract = new ethers.Contract(contractAddress, ERC_721_EVENTS, this.ethersProvider);
		contract.on(contract.filters.Transfer(), (from, to, tokenId, eventObject) => {
			const event = new NFT721TransferEvent(eventObject);
			callback(event)
		});
	}


}








