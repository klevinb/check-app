import * as React from "react";
//import styles from './styles.modules. ';
import styles from "./styles.module.scss";

import {
  FaTimesCircle,
  FaQuestionCircle,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
//import { GeneValidationResult } from './GeneSymbolValidator';
//import { OQL } from './OQLTextArea';

import classNames from "classnames";
import { groupBy, reduce } from "lodash";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const RenderSuggestion = function (props) {
  //console.log("props", props);
  if (props.genes.length > 0 && props.alias && props.alias.startsWith("Not among")) {  
    console.log(props);
    let title = props.genes[0].hugoGeneSymbol.length + (props.alias === "Not among targets"? " perturbations ":" genes ") + "were not found in the perturbseq data \n" + props.genes[0].hugoGeneSymbol.toString();
    let onClick = () => props.replaceGene(props.genes[0].hugoGeneSymbol, "");
    return (
      <div className={styles.warningBubble} title={title} onClick={onClick}>
        <FaTimesCircle className={styles.icon} />
        <span className={styles.noChoiceLabel}>{props.alias}</span>
      </div>
    );
  }

  if (props.genes.length === 0) {
    let title =
      "Could not find gene symbol. Click to remove it from the gene list.";
    let onClick = () => props.replaceGene(props.alias, "");
    return (
      <div className={styles.suggestionBubble} title={title} onClick={onClick}>
        <FaTimesCircle className={styles.icon} />
        <span className={styles.noChoiceLabel}>{props.alias}</span>
      </div>
    );
  }

  if (props.genes.length === 1) {
    let { hugoGeneSymbol } = props.genes[0];
    let title = `'${props.alias}' is a synonym for '${hugoGeneSymbol}'. Click here to replace it with the official symbol.`;
    let onClick = () => props.replaceGene(props.alias, hugoGeneSymbol);
    return (
      <div className={styles.suggestionBubble} title={title} onClick={onClick}>
        <FaQuestionCircle className={styles.icon} />
        <span className={styles.singleChoiceLabel}>{props.alias}</span>
        <span>{`: ${hugoGeneSymbol}`}</span>
      </div>
    );
  }

  let title =
    "Ambiguous gene symbol. Click on one of the alternatives to replace it.";
  let options = props.genes.map((gene) => ({
    label: gene.hugoGeneSymbol,
    value: gene.hugoGeneSymbol,
  }));
  return (
    <div className={styles.suggestionBubble} title={title}>
      <FaQuestionCircle className={styles.icon} />
      <span className={styles.multiChoiceLabel}>{props.alias}</span>
      <span>{":"}&nbsp;</span>
      <DropdownButton
        variant={title.toLowerCase()}
        size="sm"
        title="Select symbol"
        id={`geneReplace_${props.alias}`}
      >
        {options.map((item, i) => {
          return (
            <Dropdown.Item
              onClick={() => {
                props.replaceGene(props.alias, item.value);
              }}
              eventKey={i + 1}
            >
              {item.label}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    </div>
  );
};

const GeneSymbolValidatorMessageChild = (props) => {
  console.log("props in ge",props)
  if (props.oql instanceof Error) {
    return (
      <div className={styles.GeneSymbolValidator}>
        <span className={styles.errorMessage}>
          {`Cannot validate gene symbols because of invalid OQL.`}
          &nbsp;&nbsp;
          <a
            className={"underline"}
            onMouseDown={(e) => {
              e.preventDefault();
              props.highlightError();
            }}
          >
            Click to highlight error
          </a>
        </span>
      </div>
    );
  }

  if (props.oql === undefined || props.oql.query.length === 0) {
    return null;
  }

  if (!props.errorMessageOnly && props.validatingGenes) {
    return (
      <div className={styles.GeneSymbolValidator}>
        <span className={styles.pendingMessage}>
          Validating gene symbols...
        </span>
      </div>
    );
  }

  if (props.genes instanceof Error) {
    return (
      <div className={styles.GeneSymbolValidator}>
        <span className={styles.pendingMessage}>
          Unable to validate gene symbols.
        </span>
      </div>
    );
  }

  if (props.genes.suggestions.length > 0) {
    return (
      <div className={styles.GeneSymbolValidator}>
        <div
          className={styles.invalidBubble}
          title="Please edit the gene symbols."
        >
          <FaExclamationCircle className={styles.icon} />
          <span>Invalid gene symbols.</span>
        </div>

        

        {props.genes.suggestions.map((suggestion, index) => (
          
          <RenderSuggestion
            key={index}
            genes={suggestion.genes}
            alias={suggestion.alias}
            replaceGene={props.replaceGene}           
          />
        ))}
      </div>
    );
  }

  // TDOD: remove this condition once multiple entrez gene ids is supported
  const hugoGeneSymbolSet = groupBy(
    props.genes.found,
    (gene) => gene.hugoGeneSymbol
  );
  const genesWithMultipleEntrezGeneIds = reduce(
    hugoGeneSymbolSet,
    (acc, genes, hugoGeneSymbol) => {
      if (genes.length > 1) {
        acc.push(hugoGeneSymbol);
      }
      return acc;
    },
    []
  );

  if (genesWithMultipleEntrezGeneIds.length > 0) {
    return (
      <div className={styles.GeneSymbolValidator}>
        <div
          className={styles.invalidBubble}
          title="Please edit the gene symbols."
        >
          <FaExclamationCircle className={styles.icon} />
          <span>
            The portal does not currently support the following gene(s):
          </span>
        </div>

        {genesWithMultipleEntrezGeneIds.map((gene, index) => (
          <RenderSuggestion
            key={index}
            genes={[]}
            alias={gene}
            replaceGene={props.replaceGene}
          />
        ))}
      </div>
    );
  }

  if (props.errorMessageOnly) {
    return null;
  }
  return (
    <div
      className={classNames(styles.GeneSymbolValidator, {
        [styles.nowrap]: !props.wrapTheContent,
      })}
    >
      <div className={styles.validBubble} title="You can now submit the list.">
        <FaCheckCircle className={styles.icon} name="check-circle" />
        <span>All gene symbols are valid.</span>
      </div>
    </div>
  );
};

export default class GeneSymbolValidatorMessage extends React.Component {
  render() {
    if (this.props.children) {
      return <div id="wideGeneBoxValidationStatus">{this.props.children}</div>;
    }

    return (
      <div id="geneBoxValidationStatus">
        <GeneSymbolValidatorMessageChild {...this.props} />
      </div>
    );
  }
}
