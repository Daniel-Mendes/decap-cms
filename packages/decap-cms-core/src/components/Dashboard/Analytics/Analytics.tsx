import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { translate } from 'react-polyglot';
import {
  Icon,
  Loader,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ExternalLinkIcon,
} from 'decap-cms-ui-next';
import { components } from 'decap-cms-ui-default';
import { PERIODS } from 'decap-cms-lib-analytics';

import { fetchMetrics } from '../../../actions/analytics';
import {
  selectMetrics,
  selectPeriod,
  selectInterval,
  selectIsLoading,
} from '../../../reducers/analytics';
import { selectAnalytics } from '../../../reducers/config';
import AnalyticsChart from './AnalyticsChart';

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const AnalyticsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const AnalyticsHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  ${({ theme }) => theme.responsive.mediaQueryDown('xs')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const AnalyticsTitle = styled.h2`
  ${components.cardTopHeading};
`;

const ExternalAnalyticsLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${({ theme }) => theme.color.text};
  text-decoration: none;
`;

function Analytics({ t }) {
  const dispatch = useDispatch();
  const metrics = useSelector(selectMetrics);
  const period = useSelector(selectPeriod);
  const interval = useSelector(selectInterval);
  const isLoading = useSelector(selectIsLoading);
  const analytics = useSelector(selectAnalytics);

  console.log('analytics', analytics);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchMetrics(period));
  }, []);

  function handleOnCLick(newPeriod) {
    dispatch(fetchMetrics(newPeriod));
  }

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>
        <AnalyticsHeading>
          <AnalyticsTitle>
            <Icon size="md" name="bar-chart" />
            {t('dashboard.siteAnalytics.title')}
          </AnalyticsTitle>

          <span>
            <ExternalAnalyticsLink
              href={analytics.implementation.apiEndpoint}
              target="_blank"
              rel="noopener noreferrer"
            >
              {analytics.implementation.siteId}
              <ExternalLinkIcon />
            </ExternalAnalyticsLink>
          </span>
        </AnalyticsHeading>

        <Dropdown>
          <DropdownTrigger>
            <Button type="neutral" variant="soft" icon="calendar" hasMenu>
              {t(`dashboard.siteAnalytics.periodOptions.${period}`)}
            </Button>
          </DropdownTrigger>

          <DropdownMenu anchorOrigin={{ y: 'bottom', x: 'right' }}>
            {PERIODS.map((periodName, index) => (
              <div key={periodName}>
                {index !== 0 && PERIODS.indexOf(periodName) % 2 === 0 && <DropdownMenuSeparator />}

                <DropdownMenuItem
                  key={periodName}
                  onClick={() => {
                    handleOnCLick(periodName);
                  }}
                  selected={periodName === period}
                >
                  {t(`dashboard.siteAnalytics.periodOptions.${periodName}`)}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenu>
        </Dropdown>
      </AnalyticsHeader>

      {isLoading ? (
        <Loader>{t('dashboard.siteAnalytics.loading')}</Loader>
      ) : (
        <AnalyticsChart data={metrics} interval={interval} />
      )}
    </AnalyticsContainer>
  );
}

Analytics.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(Analytics);
