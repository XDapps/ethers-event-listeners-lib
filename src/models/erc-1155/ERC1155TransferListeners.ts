import { ethers } from "ethers";
import { ERC1155TransferSingleEvent } from "./ERC1155TransferSingleEvent";
import { ERC_1155_EVENTS } from "@xdapps/erc-token-utils";

export class ERC1155TransferListeners {
	private static instance: ERC1155TransferListeners;

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
		if (!ERC1155TransferListeners.instance) {
			ERC1155TransferListeners.instance = new ERC1155TransferListeners(contractAddresses, provider);
		}
		return ERC1155TransferListeners.instance;
	}

	async start(callback: (event: ERC1155TransferSingleEvent) => void): Promise<void> {
		if (!this.isRunning) {
			this.isRunning = true;
			this.contractAddresses.forEach((address) => {
				this._setContractListener(address, callback);
			});
		}
	}

	private _setContractListener(contractAddress: string, callback: (event: ERC1155TransferSingleEvent) => void) {
		const contract = new ethers.Contract(contractAddress, ERC_1155_EVENTS, this.ethersProvider);
		contract.on(contract.filters.TransferSingle(), (operator, from, to, id, value, eventObject) => {
			const event = new ERC1155TransferSingleEvent(eventObject);
			callback(event)
		});
	}
}








