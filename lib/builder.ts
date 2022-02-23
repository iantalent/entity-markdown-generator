import {EntityParser, SimpleEntityParser} from "./parser";
import {MessageResolver, EntityMessageResolver, PluginMessages, SimpleMessageResolver} from "./messages";
import {FragmentContent} from "markdown-generator";

export type BuilderOptions = {
	parser?: EntityParser,
	messageResolver?: MessageResolver,
	messages?: PluginMessages
}

const defaultMessages = {
	fieldType: 'Type:'
};

export class EntityBuilder
{
	private readonly parser: EntityParser;
	private readonly messageResolver: MessageResolver;
	
	constructor(options?: BuilderOptions)
	{
		const safeOptions = options || {};
		this.parser = safeOptions.parser || new SimpleEntityParser();
		this.messageResolver = safeOptions.messageResolver || new SimpleMessageResolver();
		this.messageResolver.add(Object.assign({}, defaultMessages, safeOptions.messages));
	}
	
	build(entity: object, path: string): Array<FragmentContent>
	{
		if(typeof entity !== 'object')
			throw new Error('Entity should be object type');
		
		return this.parser.parse(entity, path, new EntityMessageResolver(this.messageResolver, path));
	}
}