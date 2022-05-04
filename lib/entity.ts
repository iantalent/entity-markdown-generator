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