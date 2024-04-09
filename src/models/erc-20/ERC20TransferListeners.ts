import { ethers } from "ethers";
import { ERC_20_EVENTS } from "@xdapps/erc-token-utils";
import { ERC20TransferEvent } from "./ERC20TransferEvent";

//Instantiate the as Singleton to avoid multiple listeners/memory leaks
export class ERC20TransferListeners {
	private static instance: ERC20TransferListeners;

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
		if (!ERC20TransferListeners.instance) {
			ERC20TransferListeners.instance = new ERC20TransferListeners(contractAddresses, provider);
		}
		return ERC20TransferListeners.instance;
	}

	async start(callback: (event: ERC20TransferEvent) => void): Promise<void> {
		if (!this.isRunning) {
			this.isRunning = true;
			this.contractAddresses.forEach((address) => {
				this._setContractListener(address, callback);
			});
		}
	}
	_setContractListener(contractAddress: string, callback: (event: ERC20TransferEvent) => void) {
		const contract = new ethers.Contract(contractAddress, ERC_20_EVENTS, this.ethersProvider);
		contract.on(contract.filters.Transfer(), (from, to, value, eventObject) => {
			const event = new ERC20TransferEvent(eventObject);
			callback(event);
		});
		;
	}
}







