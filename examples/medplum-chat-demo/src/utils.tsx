import { Filter, Operator, SearchRequest } from '@medplum/core';
import { QuestionnaireResponse, Resource } from '@medplum/fhirtypes';

export function cleanResource(resource: Resource): Resource {
  let meta = resource.meta;
  if (meta) {
    meta = {
      ...meta,
      lastUpdated: undefined,
      versionId: undefined,
      author: undefined,
    };
  }
  return {
    ...resource,
    meta,
  };
}

export function getPopulatedSearch(search: SearchRequest): SearchRequest<Resource> {
  const filters = search.filters ?? getDefaultFilters(search.resourceType);
  const fields = search.fields ?? getDefaultFields(search.resourceType);
  const sortRules = search.sortRules ?? [{ code: '-_lastUpdated' }];

  return {
    resourceType: search.resourceType,
    filters,
    fields,
    sortRules,
  };
}

export function getDefaultFilters(resourceType: string): Filter[] {
  const filters = [];

  switch (resourceType) {
    case 'Communication':
      filters.push(
        { code: 'part-of:missing', operator: Operator.EQUALS, value: 'true' },
        { code: 'status:not', operator: Operator.EQUALS, value: 'completed' }
      );
      break;
  }

  return filters;
}

export function getDefaultFields(resourceType: string): string[] {
  const fields = [];

  switch (resourceType) {
    case 'Communication':
      fields.push('topic', 'sender', 'recipient', 'sent');
      break;
    case 'Patient':
      fields.push('name', '_lastUpdated');
      break;
    default:
      fields.push('id');
  }

  return fields;
}

// A helper function to specifically get all of the people entered as a participant in the form
export function getRecipients(formData: QuestionnaireResponse) {
  const items = formData.item;
  const recipients = [];

  if (!items) {
    return;
  }

  for (const item of items) {
    if (item.linkId === 'participants') {
      if (!item.answer) {
        return;
      }
      recipients.push(...item.answer);
    }
  }

  return recipients;
}