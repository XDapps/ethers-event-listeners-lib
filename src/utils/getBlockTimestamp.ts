import { ethers } from "ethers";

export const getBlockTimestamp = async (blockNumber: number, provider: ethers.providers.Provider): Promise<number> => {
	const blockResult = await provider.getBlock(blockNumber);
	return blockResult.timestamp;
}
