import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Spacer, Select, Row , Card, Heading} from "@oliasoft-open-source/react-ui-library";
import DataTable from "react-data-table-component";
import { TableWithSortAndFilter } from "../enrichment/";
import "echarts-gl";
import * as echarts from "echarts/core";
import { registerTransform } from "echarts/core";
//import GraphChart from 'echarts/charts';
import { ScatterChart, EffectScatterChart, CustomChart } from "echarts/charts";
import { transform } from "echarts-stat";
import {
  GridComponent,
  BrushComponent,
  LegendPlainComponent,
  LegendScrollComponent,
  VisualMapComponent,
  TransformComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  DatasetComponent,
  ToolboxComponent,
} from "echarts/components";
import {
  CanvasRenderer,
  // SVGRenderer,
} from "echarts/renderers";
import ReactEChartsCore from "echarts-for-react/lib/core";
import $, { param } from "jquery";
import { string } from "prop-types";
// import text from './sample.json';

echarts.use([
  TitleComponent,
  EffectScatterChart,
  LegendPlainComponent,
  LegendScrollComponent,
  CustomChart,
  BrushComponent,
  VisualMapComponent,
  TransformComponent,
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  DataZoomComponent,
  DatasetComponent,
  ToolboxComponent,
]);

registerTransform(transform.clustering);

const ScatterPlot = ({
  graphData,
  scatterplotSettings,
  coreSettings,
}) => {
  const [options, setOptions] = useState({});

  const data = [["PC1", "PC2", "PC3", "GeneSymbol", "Cluster", "ClusterProb"]];
  const genes = scatterplotSettings.genesTolabel
    .replaceAll(/\s+|,\s+|,/g, ";")
    ?.split(";");
  const genesTolabel = new Set(genes);
  var pieces = [];
  const clusterData = [];

  //const [clusters, setClusters] = useState();

  const clusters = {};

  
  let graphdata = graphData; 
  if (
    graphdata &&
    graphdata["PC1"] &&
    graphdata["PC2"] &&
    graphdata["GeneSymbols"]
  ) {
    console.log(graphdata);
    if (graphdata["clusterCount"] > 0) {
      
      let arrayOfArrays = Array.from(Array(graphdata["clusterCount"]), () => []);
      console.log("arrayOfArrays empty", arrayOfArrays)
      for (var i = 0; i < Object.keys(graphdata["GeneSymbols"]).length; i++) {
        //collect the clusters
        if(graphdata["clusterLabels"][i]> -1) {
          arrayOfArrays[graphdata["clusterLabels"][i]].push( graphdata["GeneSymbols"][i])
          //console.log(i, arrayOfArrays)
        }

        data.push([
          graphdata["PC1"][i],
          graphdata["PC2"][i],
          graphdata["PC3"][i],
          graphdata["GeneSymbols"][i],
          graphdata["clusterLabels"][i],
          graphdata["clusterProb"][i],
        ]);
      }
      
      //clusters = {}
      console.log("arrayOfArrays",arrayOfArrays)
      for(let i =0;i<arrayOfArrays.length;i++){
        clusters["Cluster" + (i+1)] = arrayOfArrays[i].join();
      }

      console.log("clusters",clusters)



    } else {
      for (let i = 0; i < Object.keys(graphdata["GeneSymbols"]).length; i++) {
        data.push([
          graphdata["PC1"][i] ?? 0,
          graphdata["PC2"][i] ?? 0,
          graphdata["PC3"][i] ?? 0,
          graphdata["GeneSymbols"][i] ?? 0,
          -1,
          1,
        ]);
      }
    }

    var COLOR_ALL = [
      "#9b9b9b",
      "#37A2DA",
      "#e06343",
      "#37a354",
      "#b55dba",
      "#b5bd48",
      "#8378EA",
      "#96BFFF",
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf",
    ];


    if (graphdata["clusterCount"] > 0) {
      for (let i = -1; i < graphdata["clusterCount"]; i++) {
        if (i === -1) {
          pieces.push({
            value: i,
            label: "Unclustered",
            color: COLOR_ALL[0],
            symbolSize: scatterplotSettings.symbolSize,
            symbol: "circle",
          });
          continue;
        }

        pieces.push({
          value: i,
          label: "Cluster " + (i + 1),
          color: COLOR_ALL[(i + 1) % 18],
          symbolSize: scatterplotSettings.symbolSize,
          symbol: "circle",
        });

        if (
          graphdata["x" + i] &&
          graphdata["x" + i].length > 0 &&
          graphdata["y" + i] &&
          graphdata["y" + i].length > 0
        ) {
          clusterData.push([i / 10000]);
        }
      }
    } //if there is no cluster we will have all of them same color
    else {
      pieces.push({
        value: -1,
        label: "Unclustered",
        color: COLOR_ALL[1],
      });
    }
  } 
  useEffect(() => {

    function renderItem(params, api) {
      var curIndex = api.value(0) * 10000;

      const points = [];
      if (graphdata["x" + curIndex]) {
        for (var i = 0; i < graphdata["x" + curIndex].length; i++) {
          points.push(
            api.coord([
              graphdata["x" + curIndex][i],
              graphdata["y" + curIndex][i],
            ])
          );
        }
      }

      var color = COLOR_ALL[(curIndex + 1) % 18];

      return {
        type: "polygon",
        shape: {
          points: echarts.graphic.clipPointsByRect(points, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          }),
          smooth: 1,
        },
        style: api.style({
          fill: color,
          stroke: echarts.color.lift(color),
        }),
      };
    }

    if (coreSettings.graphType === "2D") {
      //2D chart
      setOptions({
        dataset: [
          {
            source: data,
          },
          {
            source: clusterData,
          },
        ],

        tooltip: {
          position: "top",
          extraCssText: "width:auto; white-space:pre-wrap;",
          confine: true,
          backgroundColor: "#000000",
          textStyle: {
            fontSize: 13,
            color: "#FFFFFF",
            width: 100,
            overflow: "break",
          },
          formatter: function (params, ticket, callback) {
            //console.log("Check", params)          
            var res = localStorage.getItem(params.data[3]);
            if (res !== null) {
              //console.log("From Local Storage:", localStorage.getItem(params.data[3]),params)
              return localStorage.getItem(params.data[3]);
            }

            $.get(
              "https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/" +
              params.data[3],
              function (content) {
                res =
                  '<span style="color: #e28743";> <b>' +
                  params.data[3] +
                  ": </b></span>" +
                  JSON.parse(content).description;
                console.log("Get results:", content)  
                localStorage.setItem(params.data[3], res);
                callback(ticket, res);
              }
            );
            return "Loading";
          },
        },       
        visualMap: {
          type: "piecewise",
          top: "top",
          left: "right",
          dimension: 4,
          pieces: pieces,
          orient: "vertical",
          show:true,         
          padding:[60,5,5,5],
          inverse:true,
          itemGap:5,
          align:'left'
        },
        grid: { 
          right:'13%' 
        
        },
        xAxis: {         
          nameLocation : "center",
              nameTextStyle:{
                fontWeight:'bold',
                fontSize : '14'
              },
              name: "Component 1",           
              nameGap: 25   
      },

        yAxis: {
           
           nameRotate: 90,
           scale: true,
           name: "Component 2",
           nameLocation : "center",
           nameGap: 35,
           nameTextStyle:{
             fontWeight:'bold',
             fontSize : '14',
             verticalAlign : 'center',
           },
          
          },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true, pixelRatio: 3 },
            dataZoom: {},
            brush: {
              type: ["rect", "polygon", "keep", "clear"],
            },
          },
        },
        brush: {},

        series: [
          {
            type: "custom",
            renderItem: renderItem,
            itemStyle: {
              opacity: scatterplotSettings.highlightClusters === true ? 0.5 : 0,
            },
            //gridIndex: 1,

            animation: false,
            silent: true,
            datasetIndex: 1,
            emphasis: {
              focus: "series",
            },
            brush: {},
          },
          {
            type: "scatter",
            gridIndex: 0,
            symbolSize: scatterplotSettings.symbolSize,
            itemGroupId: 4,
            datasetIndex: 0,
            emphasis: {
              focus: "self",
            },
            label: {
              show: true,
              position: scatterplotSettings.labelLoc,
              fontSize: scatterplotSettings.labelSize,
              formatter: function (params) {
                if (
                  scatterplotSettings.showLabels === true ||
                  genesTolabel.has(params.data[3])
                ) {
                  return params.data[3];
                } else return "";
              },

              // fontWeight: 'bold',
              color: "black",
            },
          },
        ],
      });
    } else {
      //3D chart
      setOptions({
        grid3D: {
          viewControl: {
            autoRotate: scatterplotSettings.autorotate,
            autoRotateSpeed: scatterplotSettings.rotationSpeed,
            projection:
              scatterplotSettings.projection === false
                ? "perspective"
                : "orthographic",
          },
        },
        xAxis3D: { name: "Component 1" },
        yAxis3D: { name: "Component 2" },
        zAxis3D: { name: "Component 3" },
        visualMap: {
          type: "piecewise",
          top: "bottom",
          left: "center",
          dimension: 4,
          pieces: pieces,
          orient: "horizontal",
        },
        label: {
          formatter: "{GeneSymbol}",
        },
        tooltip: {
          extraCssText: "width:auto; white-space:pre-wrap;",
          confine: true,
          backgroundColor: "#000000",
          textStyle: {
            fontSize: 13,
            color: "#FFFFFF",
            width: 100,
            overflow: "break",
          },
          formatter: function (params, ticket, callback) {
            var res = localStorage.getItem(params.data[3]);
            //console.log("Check", params)
            if (res !== null) {
              //console.log("From Local Storage:", localStorage.getItem(params.data[3]),params)
              return localStorage.getItem(params.data[3]);
            }

            $.get(
              "https://amp.pharm.mssm.edu/Harmonizome/api/1.0/gene/" +
              params.data[3],
              function (content) {
                res =
                  '<span style="color: #e28743";> <b>' +
                  params.data[3] +
                  ": </b></span>" +
                  JSON.parse(content).description;
                localStorage.setItem(params.data[3], res);
                callback(ticket, res);
              }
            );
            return "Loading";
          },
        },
        dataset: {
          dimensions: [
            "PC1",
            "PC2",
            "PC3",
            "GeneSymbol",
            { name: "Cluster", type: "ordinal" },
            "ClusterProb",
          ],
          source: data,
        },
        series: [
          {
            symbol: "circle",
            type: "scatter3D",
            symbolSize: scatterplotSettings.symbolSize,
            encode: {
              x: "PC1",
              y: "PC2",
              z: "PC3",
              tooltip: [0, 1, 2, 3, 4],
            },
            label: {
              show: true,
              fontSize: scatterplotSettings.labelSize,
              position: scatterplotSettings.labelLoc,
              formatter: function (params) {
                if (
                  scatterplotSettings.showLabels === true ||
                  genesTolabel.has(params.data[3])
                ) {
                  return params.data[3];
                } else return " ";
              },
            },
            emphasis: {
              itemStyle: {
                color: "red",
              },
            },
          },
        ],
      });
    }
    //}
  }, [coreSettings, scatterplotSettings, graphdata]);

  return (
    /*<EchartsReact
        option={options}
        style={{ height: '100%', width: '100%' }}
    />*/

    <>
      <div style={{ width: "100%", height: "100%" }}>
        <Row spacing={0} width="100%" height="85%">
          <ReactEChartsCore
            echarts={echarts}
            option={options}
            style={{ height: "100%", width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </Row>
        <Spacer height="2em" />
        {Object.keys(clusters).length>0 && (
        
        <Row spacing={-100} width="100%" height="90%">

          <TableWithSortAndFilter clusters={clusters} />
        </Row>)
        }
      </div>
    </>
  );
};

const mapStateToProps = ({ settings }) => ({
  scatterplotSettings: settings?.scatterplot ?? {},
  coreSettings: settings?.core ?? {},
});

const MainContainer = connect(mapStateToProps)(ScatterPlot);

export { MainContainer as ScatterPlot };
