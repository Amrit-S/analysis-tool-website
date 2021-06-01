export class ANALYSIS_OPTIONS {
    // Individual Options
    static INDIVIDUAL_CNN = "CNN Predictions";
    static INDIVIDUAL_SEG_SIZE = "Cell Size";
    static INDIVIDUAL_SEG_SHAPE = "Cell Shape";
    static INDIVIDUAL_SEG_POINTINESS = "Cell Pointiness";

    // Group Options
    static GROUP_CNN = "CNN Prediction Time Series";

    // Cell Size
    static GROUP_SEG_SIZE_MEAN = "Mean Cell Size Over Time";
    static GROUP_SEG_SIZE_MEDIAN = "Median Cell Size Over Time";
    static GROUP_SEG_SIZE_STD = "Standard Deviation of Cell Size Over Time";
    static GROUP_SEG_SIZE_MIN = "Smallest Cell Size Over Time";
    static GROUP_SEG_SIZE_MAX = "Largest Cell Size Over Time";

    // Cell Shape
    static GROUP_SEG_SHAPE_MEAN = "Mean Cell Shape Over Time";
    static GROUP_SEG_SHAPE_MEDIAN = "Median Cell Shape Over Time";
    static GROUP_SEG_SHAPE_STD = "Standard Deviation of Cell Shape Over Time";
    static GROUP_SEG_SHAPE_MIN = "Smallest Cell Shape Over Time";
    static GROUP_SEG_SHAPE_MAX = "Largest Cell Shape Over Time";

    // Cell Pointiness
    static GROUP_SEG_POINTINESS_MEAN = "Mean Pointiness Over Time";
    static GROUP_SEG_POINTINESS_MEDIAN = "Median Pointiness Over Time";
    static GROUP_SEG_POINTINESS_STD = "Standard Deviation of Cell Pointiness Over Time";
    static GROUP_SEG_POINTINESS_MIN = "Smallest Pointed Cell Over Time";
    static GROUP_SEG_POINTINESS_MAX = "Largest Pointed Cell Over Time";
}
