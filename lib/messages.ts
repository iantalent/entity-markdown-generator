export type MessageValue = string | ((path: string) => string)

export type PluginMessages = {
	[key: string]: MessageValue
}

export type MessageResolverReplacement = object | null | undefined;

export interface MessageResolver
{
	add(messages: PluginMessages): void
	
	resolve(message: string, lang: string, replace: MessageResolverReplacement): string;
}

export function resolveMessage(value: MessageValue, path: string): any
{
	return value && value instanceof Function ? value.call(null, path) : value;
}

export class SimpleMessageResolver implements MessageResolver
{
	private messagesContainer: PluginMessages = {};
	
	add(messages: PluginMessages): void
	{
		this.messagesContainer = Object.assign({}, this.messagesContainer, messages);
	}
	
	resolve(message: string, path: string): string
	{
		return resolveMessage(this.messagesContainer[message], path) || '';
	}
}

export class EntityMessageResolver
{
	constructor(private readonly resolver: MessageResolver, private readonly lang: string)
	{
	}
	
	resolve(message: string, replace: MessageResolverReplacement = null)
	{
		return this.resolver.resolve(message, this.lang, replace) || '';
	}
}