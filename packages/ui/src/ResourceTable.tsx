import { getPropertyDisplayName, IndexedStructureDefinition, Reference, Resource } from '@medplum/core';
import React, { useEffect, useState } from 'react';
import { DescriptionList, DescriptionListEntry } from './DescriptionList';
import { useMedplum } from './MedplumProvider';
import { ResourcePropertyDisplay } from './ResourcePropertyDisplay';
import { useResource } from './useResource';

const DEFAULT_IGNORED_PROPERTIES = [
  'id',
  'meta',
  'implicitRules',
  'language',
  'text',
  'contained',
  'extension',
  'modifierExtension'
];

export interface ResourceTableProps {
  value: Resource | Reference;
}

export function ResourceTable(props: ResourceTableProps) {
  const medplum = useMedplum();
  const value = useResource(props.value);
  const [schema, setSchema] = useState<IndexedStructureDefinition | undefined>();

  useEffect(() => {
    if (value) {
      medplum.getTypeDefinition(value.resourceType).then(setSchema);
    }
  }, [value]);

  if (!schema || !value) {
    return <div>Loading...</div>
  }

  const typeSchema = schema.types[value.resourceType];
  if (!typeSchema) {
    return <div>Schema not found</div>
  }

  return (
    <DescriptionList>
      <DescriptionListEntry term="Resource Type">{value.resourceType}</DescriptionListEntry>
      <DescriptionListEntry term="ID">{value.id}</DescriptionListEntry>
      {Object.entries(typeSchema.properties).map(entry => {
        const key = entry[0];
        if (DEFAULT_IGNORED_PROPERTIES.indexOf(key) >= 0) {
          return null;
        }
        const property = entry[1];
        return (
          <DescriptionListEntry key={key} term={getPropertyDisplayName(property)}>
            <ResourcePropertyDisplay property={property} value={(value as any)[key]} />
          </DescriptionListEntry>
        );
      })}
    </DescriptionList>
  );
}
