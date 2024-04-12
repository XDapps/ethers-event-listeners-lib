
import { ethers } from "ethers";
import { ERC_1155_EVENTS } from "@xdapps/erc-token-utils";
import { EthersProvider } from "../../types/ethers";
import { ERC1155TransferSingleEvent } from "./ERC1155TransferSingleEvent";
import { throwErrorIfUndefined } from "../../utils/throwErrorUndefined";

export class ERC1155TransferSinglePoller {
	contractAddress: string;
	lastBlockPolled: number;
	maxBlocksQuery: number;
	constructor(contractAddress: string, lastBlockPolled: number, maxBlocksQuery: number) {
		this.contractAddress = contractAddress;
		this.lastBlockPolled = lastBlockPolled;
		this.maxBlocksQuery = maxBlocksQuery;
	};

	async pollBlocks(provider: EthersProvider, callback: (event: ERC1155TransferSingleEvent) => Promise<unknown>) {
		throwErrorIfUndefined(provider, "No provider found");
		await this._pollBlocks(provider, callback);
	}

	async _pollBlocks(provider: EthersProvider, callback: (event: ERC1155TransferSingleEvent) => Promise<unknown>) {
		let currentBlock = await provider.getBlockNumber() - 1;
		const difference = currentBlock - this.lastBlockPolled;
		if (difference > this.maxBlocksQuery) {
			currentBlock = this.lastBlockPolled + this.maxBlocksQuery;
		}
		const transferContract = new ethers.Contract(this.contractAddress, ERC_1155_EVENTS, provider);
		const contractFilter = transferContract.filters.TransferSingle();
		const logs = await transferContract.queryFilter(contractFilter, this.lastBlockPolled, currentBlock);
		for (const log of logs) {
			await this._handleTransferEvent(log, callback);
		}
		this.lastBlockPolled = currentBlock;
		return;
	}

	async _handleTransferEvent(log: ethers.Event, callback: (event: ERC1155TransferSingleEvent) => Promise<unknown>): Promise<unknown> {
		const event = new ERC1155TransferSingleEvent(log);
		return callback(event);
	}
}







