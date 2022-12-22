import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../../common/routes';
import { Settings } from './settings';
import { CoreSettings } from './core-settings';
import { TsneSettings } from './tsne-settings';
import { BiClusteringSettings } from './bi-clustering-settings';
import { GeneRegulationSettings } from './gene-regulation-settings';
import { CorrelationSettings } from './correlation-settings';
import { ClusteringSettings } from './clustering-settings';
import { PcaSettings } from './pca-settings';
import { EmbeddingSettings } from './embedding-settings';
import { HeatmapSettings } from './heatmap-settings';
import { SettingsTypes } from './enums';

const SettingsSelector = () => {
  const location = useLocation();
  const { pathname } = location;
  const settingsMap = {
    [ROUTES.HOME]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      }
    ],
    [ROUTES.CORRELATION]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.CORRELATION_SETTINGS,
        settings: <CorrelationSettings />
      },
    ],
    [ROUTES.PCA]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.PCA_SETTINGS,
        settings: <PcaSettings />
      },
      {
        settingsName: SettingsTypes.CLUSTERING_SETTINGS,
        settings: <ClusteringSettings />
      },
    ],
    [ROUTES.MDE]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.EMBEDDING_SETTINGS,
        settings: <EmbeddingSettings />
      },
      {
        settingsName: SettingsTypes.CLUSTERING_SETTINGS,
        settings: <ClusteringSettings />
      },
    ],
    [ROUTES.UMAP]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.UMAP_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.CLUSTERING_SETTINGS,
        settings: <ClusteringSettings />
      },
    ],
    [ROUTES.TSNE]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.TSNE_SETTINGS,
        settings: <TsneSettings />
      },
      {
        settingsName: SettingsTypes.CLUSTERING_SETTINGS,
        settings: <ClusteringSettings />
      },
    ],
    [ROUTES.BI_CLUSTERING]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.BI_CLUSTERING_SETTINGS,
        settings: <BiClusteringSettings />
      },
    ],
    [ROUTES.GENE_REGULATION]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <GeneRegulationSettings />
      },
      {
        settingsName: SettingsTypes.GENE_REGULATION_SETTINGS,
        settings: <>not accordion</>,
        isAccordion: false,
      },
    ],
    [ROUTES.HEATMAP]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.HEAT_MAP_TARGET_GENE_LIST,
        settings: <>not accordion</>,
        isAccordion: false,
      },
      {
        settingsName: SettingsTypes.HEAT_MAP,
        settings: <HeatmapSettings />
      },
    ],
  };

  return (
    <div>
      {settingsMap?.[pathname]?.map(({ settingsName, settings, isAccordion = true }, key) => (
        <Settings
          key={key}
          expended={key === 0 ? true : false}
          settingsName={settingsName}
          settings={settings}
          isAccordion={isAccordion}
        />
      ))}
    </div>
  );
};

export { SettingsSelector };
