import { schnorr } from '@noble/curves/secp256k1';
import { EventTemplate } from './model/types/nostr';
import { getWebSocketImpl } from './ws';
import { NostrEvent } from './model/types/nostr';
import { bytesToHex } from '@noble/hashes/utils';
import { UnsignedEvent } from './model/types/nostr';
import { sha256 } from '@noble/hashes/sha256';

const _WS = getWebSocketImpl();

export function createSecretKey() {
	return schnorr.utils.randomPrivateKey();
}

function serializeEvent(e: UnsignedEvent) {
	return JSON.stringify([0, e.pubkey, e.created_at, e.kind, e.tags, e.content]);
}

function getEventId(e: UnsignedEvent) {
	return bytesToHex(sha256(new TextEncoder().encode(serializeEvent(e))));
}

export function finalizeEvent(e: EventTemplate, sk: Uint8Array) {
	const event = e as NostrEvent;
	event.pubkey = bytesToHex(schnorr.getPublicKey(sk));
	const id = getEventId(event);
	event.id = id;
	event.sig = bytesToHex(schnorr.sign(id, sk));
	return event;
}

export async function publishEvent(e: Event, relay: string) {
	return new Promise((res, rej) => {
		let ws: WebSocket;
		try {
			ws = new _WS(relay);
		} catch (e) {
			return rej(e);
		}
		ws.onerror = (e: any) => rej(e.message);
		ws.onmessage = (ev: MessageEvent) => {
			let content;
			try {
				content = JSON.parse(ev.data);
			} catch (e) {
				rej(new Error('Failed to parse incoming message'));
			}
			if (content[0] === 'OK') {
				const ok: boolean = content[2];
				ws.close();
				if (ok) res(content[3]);
				else rej(new Error(content[3]));
			}
		};
		ws.send(`["EVENT", ${JSON.stringify(e)}]`);
	});
}
