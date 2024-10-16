export type Event = {
	kind: number;
	tags: Array<Array<string>>;
	content: string;
	created_at: number;
	pubkey: string;
	id: string;
	sig: string;
};

export type NostrEvent = Event;
export type EventTemplate = Pick<Event, 'kind' | 'tags' | 'content' | 'created_at'>;
export type UnsignedEvent = Pick<Event, 'kind' | 'tags' | 'content' | 'created_at' | 'pubkey'>;
