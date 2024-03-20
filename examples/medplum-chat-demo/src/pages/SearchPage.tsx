import { Tabs } from '@mantine/core';
import {
  Filter,
  formatSearchQuery,
  getQuestionnaireAnswers,
  getReferenceString,
  Operator,
  parseSearchRequest,
  SearchRequest,
} from '@medplum/core';
import { QuestionnaireResponse, Resource } from '@medplum/fhirtypes';
import { Document, Loading, SearchControl, useMedplum } from '@medplum/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function SearchPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<SearchRequest>();
  const [showTabs, setShowTabs] = useState<boolean>(() => {
    const search = parseSearchRequest(location.pathname + location.search);
    console.log(search);
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

  const handleCreateThread = (formData: QuestionnaireResponse) => {
    const answers = getQuestionnaireAnswers(formData);
  };

  const handleTabChange = (newTab: string | null): void => {
    debugger;
    if (!search) {
      throw new Error('Error: No valid search');
    }
    console.log('handling tab change', search);

    const updatedSearch = updateSearch(newTab ?? 'active', search);
    const updatedSearchQuery = formatSearchQuery(updatedSearch);
    navigate(`/Communication${updatedSearchQuery}`);
  };

  if (!search?.resourceType || !search.fields || search.fields.length === 0) {
    return <Loading />;
  }

  return (
    <Document>
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

function getPopulatedSearch(search: SearchRequest): SearchRequest<Resource> {
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

function getDefaultFilters(resourceType: string): Filter[] {
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

function getDefaultFields(resourceType: string) {
  const fields = ['id'];

  switch (resourceType) {
    case 'Communication':
      fields.push('sender', 'recipient', 'sent');
      break;
    case 'Patient':
      fields.push('name', '_lastUpdated');
  }

  return fields;
}

function handleInitialTab(currentSearch: SearchRequest) {
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

function shouldShowTabs(search: SearchRequest) {
  if (search.resourceType !== 'Communication') {
    return false;
  }

  return true;
}
