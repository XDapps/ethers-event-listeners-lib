import { BigNumber, ethers } from "ethers";
import { getBlockTimestamp } from "../../utils/getBlockTimestamp";
import { ERC_20_EVENTS } from "@xdapps/erc-token-utils";

export class ERC20TransferEvent {
	blockNumber: number;
	contractAddress: string;
	fromAddress: string;
	toAddress: string;
	logIndex: number;
	supply: BigNumber;
	txHash: string;

	constructor(_log: ethers.Event) {
		let logInterface = new ethers.utils.Interface(ERC_20_EVENTS);
		let parsedLog = logInterface.parseLog(_log);
		this.contractAddress = _log['address'];
		this.blockNumber = _log['blockNumber'];
		this.txHash = _log['transactionHash'];
		this.logIndex = _log['logIndex'];
		this.fromAddress = parsedLog?.args['from'];
		this.toAddress = parsedLog?.args['to'];
		this.supply = parsedLog?.args['value'];
	}

	async formatData(): Promise<Record<string, unknown>> {
		return {
			block_number: this.blockNumber,
			contract_address: this.contractAddress,
			from_address: this.fromAddress,
			to_address: this.toAddress,
			log_index: this.logIndex,
			supply: this.supply.toString(),
			tx_hash: this.txHash
		};
	}
}

