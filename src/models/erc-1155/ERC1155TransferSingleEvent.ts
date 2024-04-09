import { BigNumber, ethers } from "ethers";
import { ERC_1155_EVENTS } from "@xdapps/erc-token-utils";


export class ERC1155TransferSingleEvent {
	blockNumber: number;
	contractAddress: string;
	fromAddress: string;
	toAddress: string;
	logIndex: number;
	operator: string;
	supply: BigNumber;
	tokenId: BigNumber;
	txHash: string;


	constructor(_log: ethers.Event) {
		let logInterface = new ethers.utils.Interface(ERC_1155_EVENTS);
		let parsedLog = logInterface.parseLog(_log);
		this.blockNumber = _log['blockNumber'];
		this.contractAddress = _log['address'];
		this.fromAddress = parsedLog.args['from'];
		this.toAddress = parsedLog.args['to'];
		this.logIndex = _log['logIndex'];
		this.operator = parsedLog.args['operator'];
		this.supply = parsedLog.args['value'];
		this.tokenId = parsedLog.args['tokenId'];
		this.txHash = _log['transactionHash'];
	}

	formatData(): Record<string, unknown> {
		return {
			block_number: this.blockNumber,
			contract_address: this.contractAddress,
			from_address: this.fromAddress,
			to_address: this.toAddress,
			log_index: this.logIndex,
			operator: this.operator,
			supply: this.supply.toString(),
			token_id: this.tokenId.toString(),
			tx_hash: this.txHash
		};
	}
}

