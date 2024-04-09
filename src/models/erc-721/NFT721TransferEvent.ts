import { BigNumber, ethers } from 'ethers';
import { ERC_721_EVENTS } from '@xdapps/erc-token-utils';

export class NFT721TransferEvent {
	blockNumber: number;
	contractAddress: string;
	fromAddress: string;
	toAddress: string;
	logIndex: number;
	supply: BigNumber;
	txHash: string;
	tokenId: BigNumber;

	constructor(log: ethers.Event) {
		let logInterface = new ethers.utils.Interface(ERC_721_EVENTS);
		let parsedLog = logInterface.parseLog(log);
		this.blockNumber = log['blockNumber'];
		this.contractAddress = log['address'];
		this.fromAddress = parsedLog.args['from'];
		this.toAddress = parsedLog.args['to'];
		this.supply = parsedLog.args['value'];
		this.logIndex = log['logIndex'];
		this.tokenId = parsedLog.args['tokenId'];
		this.txHash = log['transactionHash'];
	}
	
	async formatData(): Promise<Record<string, unknown>> {
		return {
			block_number: this.blockNumber,
			contract_address: this.contractAddress,
			from_address: this.fromAddress,
			to_address: this.toAddress,
			log_index: this.logIndex,
			supply: this.supply.toString(),
			token_id: this.tokenId.toString(),
			tx_hash: this.txHash
		};
	}


}

