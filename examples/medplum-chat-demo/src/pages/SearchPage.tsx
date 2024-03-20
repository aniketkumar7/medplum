import { Group, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  Filter,
  formatSearchQuery,
  getReferenceString,
  Operator,
  parseSearchRequest,
  SearchRequest,
} from '@medplum/core';
import { Resource } from '@medplum/fhirtypes';
import { Document, Loading, SearchControl, useMedplum } from '@medplum/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CreateThread } from '../components/CreateThread';
import { PatientFilter } from '../components/PatientFilter';
import { getPopulatedSearch } from '../utils';

export function SearchPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<SearchRequest>();
  const [opened, handlers] = useDisclosure(false);
  const [showTabs, setShowTabs] = useState<boolean>(() => {
    const search = parseSearchRequest(location.pathname + location.search);
    if (search.resourceType !== 'Communication') {
      return false;
    }
    return true;
  });

  const tabs = ['Active', 'Completed'];
  const searchQuery = window.location.search;
  const currentSearch = searchQuery ? parseSearchRequest(searchQuery) : null;
  const currentTab = currentSearch ? handleInitialTab(currentSearch) : null;

  useEffect(() => {
    const searchQuery = parseSearchRequest(location.pathname + location.search);
    setShowTabs(shouldShowTabs(searchQuery));
  }, [location]);

  useEffect(() => {
    const parsedSearch = parseSearchRequest(location.pathname + location.search);
    if (!parsedSearch.resourceType) {
      navigate('/Communication');
      return;
    }

    const populatedSearch = getPopulatedSearch(parsedSearch);

    if (
      location.pathname === `/${populatedSearch.resourceType}` &&
      location.search === formatSearchQuery(populatedSearch)
    ) {
      setSearch(populatedSearch);
    } else {
      navigate(`/${populatedSearch.resourceType}${formatSearchQuery(populatedSearch)}`);
    }
  }, [medplum, navigate, location]);

  const handlePatientFilter = (search: SearchRequest): void => {
    setSearch(search);
    navigate(`/Communication${formatSearchQuery(search)}`);
  };

  const handleTabChange = (newTab: string | null): void => {
    if (!search) {
      throw new Error('Error: No valid search');
    }

    const updatedSearch = updateSearch(newTab ?? 'active', search);
    const updatedSearchQuery = formatSearchQuery(updatedSearch);
    navigate(`/Communication${updatedSearchQuery}`);
  };

  if (!search?.resourceType || !search.fields || search.fields.length === 0) {
    return <Loading />;
  }

  return (
    <Document>
      <Group style={{ float: 'right' }}>
        <PatientFilter search={search} onPatientFilter={handlePatientFilter} />
        <CreateThread opened={opened} handlers={handlers} />
      </Group>
      {showTabs ? (
        <Tabs value={currentTab?.toLowerCase()} onChange={handleTabChange}>
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab} value={tab.toLowerCase()}>
                {tab}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="active">
            <SearchControl
              search={search}
              onClick={(e) => navigate(`/${getReferenceString(e.resource)}`)}
              hideFilters={true}
              hideToolbar={true}
              onNew={handlers.open}
            />
          </Tabs.Panel>
          <Tabs.Panel value="completed">
            <SearchControl
              search={search}
              onClick={(e) => navigate(`/${getReferenceString(e.resource)}`)}
              hideFilters={true}
              hideToolbar={true}
            />
          </Tabs.Panel>
        </Tabs>
      ) : (
        <SearchControl
          search={search}
          onClick={(e) => navigate(`/${getReferenceString(e.resource)}`)}
          hideFilters={true}
          hideToolbar={true}
        />
      )}
    </Document>
  );
}

function handleInitialTab(currentSearch: SearchRequest): string {
  if (!currentSearch.filters) {
    return 'active';
  }

  for (const filter of currentSearch.filters) {
    if (filter.value === 'completed') {
      const tab = filter.operator;
      if (tab === Operator.NOT) {
        return 'active';
      } else {
        return 'completed';
      }
    }
  }
  return 'active';
}

function updateSearch(newTab: string, search: SearchRequest): SearchRequest {
  const filters = search.filters || [];
  const newCode = newTab === 'active' ? 'status:not' : 'status';

  if (filters.length === 0) {
    filters.push({ code: newCode, operator: Operator.EQUALS, value: 'completed' });
  } else {
    for (const filter of filters) {
      if (filter.value === 'completed') {
        filter.code = newCode;
        filter.operator = Operator.EQUALS;
      }
    }
  }

  return {
    ...search,
    filters,
  };
}

function shouldShowTabs(search: SearchRequest): boolean {
  if (search.resourceType !== 'Communication') {
    return false;
  }

  return true;
}
