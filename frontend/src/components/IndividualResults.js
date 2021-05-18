import React from 'react';

import IndividualResultRow from "../components/IndividualResultRow";
import {ANALYSIS_OPTIONS} from "../constants/analysisOptions";

export default function IndividualResults(props) {

    // shorthand for seg & cnn data
    let seg = props.inputPageData.analysisData.segmentation;
    let cnn = props.inputPageData.analysisData.cnn;
    seg = Object.entries(seg).length === 0 ? null : seg;

    function getOptions() {
        let opt = props.inputPageData.individualOptions;

        let options = {
            "pred": opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_CNN),
            "size": opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SIZE),
            "shape": opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SHAPE),
            "pointiness": opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_SEG_POINTINESS)
        };
        return options;
    }
    
    return (

        <>
        {
        props.inputPageData.inputFileJSONs.map( (data, i) => {
            return <IndividualResultRow 
            title={data.name}
            greyTitle={i % 2 === 0} 
            stats={seg ? seg[i].stats : null}
            pred={cnn[i]}
            img_norm={seg ? seg[i].raw_img : data.buffer}
            img_seg={seg ? seg[i].segmented_img : null}
            options={getOptions()}
            />
        })
        }
        </>

    )
  }