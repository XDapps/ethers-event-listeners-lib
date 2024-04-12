import { ethers } from "ethers";
import { ERC_721_EVENTS } from "@xdapps/erc-token-utils";
import { EthersProvider } from "../../types/ethers";
import { ERC721TransferEvent } from "./ERC721TransferEvent";
import { throwErrorIfUndefined } from "../../utils/throwErrorUndefined";

export class ERC721TransferPoller {
	contractAddress: string;
	lastBlockPolled: number;
	maxBlocksQuery: number;
	constructor(contractAddress: string, lastBlockPolled: number, maxBlocksQuery: number) {
		this.contractAddress = contractAddress;
		this.maxBlocksQuery = maxBlocksQuery;
		this.lastBlockPolled = lastBlockPolled;
	};

	async pollBlocks(provider: EthersProvider, callback: (event: ERC721TransferEvent) => Promise<unknown>): Promise<void> {
		provider = throwErrorIfUndefined(provider, "No provider found") as ethers.providers.JsonRpcProvider | ethers.providers.WebSocketProvider;
		await this._pollBlocks(provider, callback);
	}

	async _pollBlocks(provider: EthersProvider, callback: (event: ERC721TransferEvent) => Promise<unknown>): Promise<void> {
		let currentBlock = await provider.getBlockNumber() - 1;
		const difference = currentBlock - this.lastBlockPolled;
		if (difference > this.maxBlocksQuery) {
			currentBlock = this.lastBlockPolled + this.maxBlocksQuery;
		}
		const transferContract = new ethers.Contract(this.contractAddress, ERC_721_EVENTS, provider);
		const contractFilter = transferContract.filters.Transfer();
		const logs = await transferContract.queryFilter(contractFilter, this.lastBlockPolled, currentBlock);
		for (const log of logs) {
			await this._handleTransferEvent(log, callback);
		}
		this.lastBlockPolled = currentBlock;
		return;
	}

	async _handleTransferEvent(log: ethers.Event, callback: (event: ERC721TransferEvent) => Promise<unknown>): Promise<unknown> {
		const event = new ERC721TransferEvent(log);
		return callback(event);
	}
}
