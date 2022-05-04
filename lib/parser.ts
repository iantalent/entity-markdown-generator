import {Fragment, FragmentContent, Heading, Paragraph, UnorderedList} from "markdown-generator";
import {EntityMessageResolver} from "./messages";
import {EntitySchema, Field, FieldsGroup} from "./entity";


export interface EntityParser
{
	parse(entityCandidate: EntitySchema, messageResolver: EntityMessageResolver): Array<FragmentContent>
}

export class ConfigurableEntityParser implements EntityParser
{
	parse(entityCandidate: EntitySchema, messageResolver: EntityMessageResolver): Array<FragmentContent>
	{
		return [];
	}
	
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
	parse(entityCandidate: EntitySchema, messageResolver: EntityMessageResolver): Array<FragmentContent>
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