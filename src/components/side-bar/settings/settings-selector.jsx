import React from 'react';
import { ROUTES } from '../../../common/routes';
import { Settings } from './settings';
import { CoreSettings } from './core-settings';
import { GraphMapSettings } from './graphmap-settings';
import { TsneSettings } from './tsne-settings';
import { BiClusteringSettings } from './bi-clustering-settings';
import { GeneRegulationSettings } from './gene-regulation-core-settings';
import { CorrelationSettings } from './correlation-settings';
import { ClusteringSettings } from './clustering-settings';
import { PcaSettings } from './pca-settings';
import { UmapSettings } from './umap-settings';
import { MdeSettings } from './mde-settings';
import { HeatMapSettings } from './heatmap-settings';
import { PathFinderSettings } from './pathfinder-settings';
import { ScatterPlotSettings } from './scatterplot-settings';
import { SettingsTypes } from './enums';

const SettingsSelector = ({ pathname }) => {
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
      {
        settingsName: SettingsTypes.SCATTERPLOT_SETTINGS,
        settings: <ScatterPlotSettings />
      },
    ],
    [ROUTES.MDE]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.MDE_SETTINGS,
        settings: <MdeSettings />
      },
      {
        settingsName: SettingsTypes.CLUSTERING_SETTINGS,
        settings: <ClusteringSettings />
      },
      {
        settingsName: SettingsTypes.SCATTERPLOT_SETTINGS,
        settings: <ScatterPlotSettings />
      },
    ],
    [ROUTES.UMAP]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.UMAP_SETTINGS,
        settings: <UmapSettings />
      },
      {
        settingsName: SettingsTypes.CLUSTERING_SETTINGS,
        settings: <ClusteringSettings />
      },
      {
        settingsName: SettingsTypes.SCATTERPLOT_SETTINGS,
        settings: <ScatterPlotSettings />
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
      {
        settingsName: SettingsTypes.SCATTERPLOT_SETTINGS,
        settings: <ScatterPlotSettings />
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
        settingsName: SettingsTypes.GRAPHMAP_SETTINGS,
        settings: <GraphMapSettings />
      },
    ],
    [ROUTES.HEATMAP]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },
      {
        settingsName: SettingsTypes.HEAT_MAP,
        settings: <HeatMapSettings />
      },
    ],
    [ROUTES.PATHFINDER]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      },      
      {
        settingsName: SettingsTypes.PATH_FINDER_SETTINGS,
        settings: <PathFinderSettings />
      },
      {
        settingsName: SettingsTypes.GRAPHMAP_SETTINGS,
        settings: <GraphMapSettings />
      },
    ],
    [ROUTES.GENESIGNATURE]: [
      {
        settingsName: SettingsTypes.CORE_SETTINGS,
        settings: <CoreSettings />
      }
    ],
  };

  return (
    <div>
      {settingsMap?.[pathname]?.map(({ settingsName, settings, isAccordion = true }, key) => (
        <Settings
          key={key}
          expended
          settingsName={settingsName}
          settings={settings}
          isAccordion={isAccordion}
        />
      ))}
    </div>
  );
};

export { SettingsSelector };
