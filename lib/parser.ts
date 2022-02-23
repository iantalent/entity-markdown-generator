import {Fragment, FragmentContent, Heading, Paragraph, UnorderedList} from "markdown-generator";
import {EntityMessageResolver} from "./messages";

export interface EntityParser
{
	parse(entityCandidate: object, messageResolver: EntityMessageResolver): Array<FragmentContent>
}

export class ConfigurableEntityParser implements EntityParser
{
	parse(entityCandidate: object, messageResolver: EntityMessageResolver): Array<FragmentContent>
	{
		return [];
	}
	
}

export type EntitySchema = {
	name?: string,
	description?: string,
	meta?: EntityMeta,
	lang?: string,
	layout?: string,
	postDescription?: string,
	fields?: Array<Field>,
	groups?: Array<FieldsGroup>
}

export type EntityMeta = {
	title?: string,
	description?: string,
	canonicalUrl?: string,
	additional?: Array<MetaItem>
}

export type MetaItem = {
	name: string,
	content: string
}

export type Field = {
	name: string,
	type: string | Function,
	values?: Array<FieldValues>,
	description?: string,
	containers?: Array<FieldContainer>
}

export type FieldValues = {
	value: string,
	description?: string
}

export type FieldContainer = {
	type: string,
	content: string
}

export type FieldsGroup = {
	name: string,
	fields: Array<Field>
}

function parseField(field: Field, messageResolver: EntityMessageResolver, headingLevel: number): Array<Fragment>
{
	const fragments: Array<Fragment> = [
		new Heading(field.name, headingLevel)
	];
	
	const fieldList = new UnorderedList();
	
	if(field.type)
		fieldList.add(messageResolver.resolve('fieldType') + ' ' + '`' + field.type + '`');
	
	if(fieldList.hasItems())
		fragments.push(fieldList);
	
	if(field.description)
		fragments.push(new Paragraph(field.description));
	
	return fragments;
}

function parseFields(fields: Array<Field>, messageResolver: EntityMessageResolver, headingLevel: number = 2): Array<Fragment>
{
	const fragments: Array<Fragment> = [];
	
	fields.forEach(field =>
	{
		fragments.push(...parseField(field, messageResolver, headingLevel));
	});
	
	return fragments;
}

function parseGroups(groups: Array<FieldsGroup>, messageResolver: EntityMessageResolver): Array<Fragment>
{
	return [];
}

export class SimpleEntityParser implements EntityParser
{
	parse(entityCandidate: any | EntitySchema, path: string, messageResolver: EntityMessageResolver): Array<FragmentContent>
	{
		if(typeof entityCandidate !== 'object')
			throw new Error('Entity should be object type');
		
		const name = entityCandidate.name;
		
		if(!name)
			throw new Error('Entity should have name');
		
		const page: Array<FragmentContent> = [new Heading(name, 1)];
		
		if(entityCandidate.description)
			page.push(new Paragraph(entityCandidate.description));
		
		if(Array.isArray(entityCandidate.fields))
			page.push(...parseFields(entityCandidate.fields, messageResolver));
		
		if(Array.isArray(entityCandidate.groups))
			page.push(...parseGroups(entityCandidate.groups, messageResolver));
		
		if(entityCandidate.postDescription)
			page.push(new Paragraph(entityCandidate.postDescription));
		
		return page;
	}
	
}