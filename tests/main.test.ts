import {suite, test} from '@testdeck/mocha';
import * as chai from 'chai';
import {EntityBuilder} from "../lib/builder";
import {Heading, Paragraph, UnorderedList} from "markdown-generator";

const assert = chai.assert;

@suite
class MainTest
{
	
	private entityContent;
	
	before()
	{
		const builder = new EntityBuilder();
		
		this.entityContent = builder.build({
			name: 'Test entity',
			description: 'Test description',
			lang: 'ru_RU',
			layout: 'TestLayout',
			meta: {
				title: 'Test title',
				canonicalUrl: '/canonical/',
				description: 'description',
				additional: [
					{name: 'keywords', content: 'keyword'}
				]
			},
			fields: [
				{
					name: 'name',
					type: 'string'
				}
			]
		}, '/path/');
	}
	
	@test 'tree'()
	{
		assert.deepEqual(this.entityContent, [
			new Heading('Test entity', 1),
			new Paragraph('Test description'),
			new Heading('name', 2),
			(new UnorderedList())
				.add('Type: `string`')
		])
	}
}