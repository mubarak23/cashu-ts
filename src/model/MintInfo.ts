import { GetInfoResponse, MPPMethod, SwapMethod, WebSocketSupport } from './types';

export class MintInfo {
	private readonly mintInfo: GetInfoResponse;

	constructor(info: GetInfoResponse) {
		this.mintInfo = info;
	}

	isSupported(num: 4 | 5): { disabled: boolean; params: Array<SwapMethod> };
	isSupported(num: 7 | 8 | 9 | 10 | 11 | 12 | 14): { supported: boolean };
	isSupported(num: 17): { supported: boolean; params?: Array<WebSocketSupport> };
	isSupported(num: 15): { supported: boolean; params?: Array<MPPMethod> };
	isSupported(num: number) {
		switch (num) {
			case 4:
			case 5: {
				return this.checkMintMelt(num);
			}
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
			case 14: {
				return this.checkGenericNut(num);
			}
			case 17: {
				return this.checkNut17();
			}
			case 15: {
				return this.checkNut15();
			}
		}
	}
	private checkGenericNut(num: 7 | 8 | 9 | 10 | 11 | 12 | 14) {
		if (this.mintInfo.nuts[num]?.supported) {
			return { supported: true };
		}
		return { supported: false };
	}
	private checkMintMelt(num: 4 | 5) {
		const mintMeltInfo = this.mintInfo.nuts[num];
		if (mintMeltInfo && mintMeltInfo.methods.length > 0 && !mintMeltInfo.disabled) {
			return { disabled: false, params: mintMeltInfo.methods };
		}
		return { disabled: true, params: mintMeltInfo.methods };
	}
	private checkNut17() {
		if (this.mintInfo.nuts[17] && this.mintInfo.nuts[17].supported.length > 0) {
			return { supported: true, params: this.mintInfo.nuts[17].supported };
		}
		return { supported: false };
	}
	private checkNut15() {
		if (this.mintInfo.nuts[15] && this.mintInfo.nuts[15].methods.length > 0) {
			return { supported: true, params: this.mintInfo.nuts[15].methods };
		}
		return { supported: false };
	}

	get contact() {
		return this.mintInfo.contact;
	}

	get description() {
		return this.mintInfo.description;
	}

	get description_long() {
		return this.mintInfo.description_long;
	}

	get name() {
		return this.mintInfo.name;
	}

	get pubkey() {
		return this.mintInfo.pubkey;
	}

	get version() {
		return this.mintInfo.version;
	}

	get motd() {
		return this.mintInfo.motd;
	}
}
