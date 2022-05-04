import {EntitySchema} from "./entity";

export type MessageValue = string | ((entity: EntitySchema) => string)

export type PluginMessages = {
	[key: string]: MessageValue
}

export type MessageResolverReplacement = object | null | undefined;

export interface MessageResolver
{
	add(messages: PluginMessages): void
	
	resolve(message: string, entity: EntitySchema, replace: MessageResolverReplacement): string;
}

export function resolveMessage(value: MessageValue, entity: EntitySchema): any
{
	return value && value instanceof Function ? value.call(null, entity) : value;
}

export class SimpleMessageResolver implements MessageResolver
{
	private messagesContainer: PluginMessages = {};
	
	add(messages: PluginMessages): void
	{
		this.messagesContainer = Object.assign({}, this.messagesContainer, messages);
	}
	
	resolve(message: string, entity: EntitySchema): string
	{
		return resolveMessage(this.messagesContainer[message], entity) || '';
	}
}

export class EntityMessageResolver
{
	constructor(private readonly entity: EntitySchema, private readonly resolver: MessageResolver)
	{
	}
	
	resolve(message: string, replace: MessageResolverReplacement = null)
	{
		return this.resolver.resolve(
			message,
			this.entity,
			replace
		) || '';
	}
}