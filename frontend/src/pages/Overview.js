import React, { Component} from 'react';
import "../css/Overview.css";

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Overview extends Component {

    render (){

      return (

          <div>
              <h1 className="Main-Title"> Segmentation Overview </h1>
              <hr/>
              <p>
                  Segmentation analysis allowed for an alternative approach to endothelial image classification on
                  DMEK rejection status. Unlike the CNN that was solely deep-learning focused and hence allowed for limited
                  correctional user input, segmentation utilized a combination of deep-learning and statisical analysis to allow 
                  for a more mathematically refined and custom feature-driven approach to the problem. In its core, segmentation
                  can be broken into two main sub-components: image segmentation, which took an endothelial cell image and dissected
                  it based on its visible cell borders, and segmentation analysis, which utilized the dissected cell borders to extract
                  individual cells and conduct feature analysis. 
              </p>
              <h2 style={{background: "blue"}}> Image Segmentation </h2>
              <h3> U-Net Architecture</h3>
              <p>
                  The focal point of image segmentation proved to be the U-Net architcture - a convultional neural network  
                  specializing in biomedical image segmentation developed by a team of researchers at the University of Freiburg, Germany. 
                  The architecture itself is compromised of 23 convultional
                  layers, making extensive usage of ReLU and max-pooling layers particularly in order to allow for better
                  up-sampling and localization - increasing both resolution and precision in the outputted result. U-Net has proven to outperform
                  other algorithms in the Electron Miscroscopic Segmentation competitions, boasting a competitive segmentation accuracy 
                  on a versatile set of biomedical applications along with a comparatively lower requirement on training images. 


                  The architcture was chosen for the aforementioned reasons, and trained on a set of 30 256 x 256 endothelial images. Each training image had
                  a corresponding grayscale prediction image set as its label that distinguished the outline of all visible cell borders within 
                  the training image. Dark pixels indicated a cell border; white pixels indicated there was no cell border.  All labels were manually constructed by trained physicians, 
                  and the architecture was trained without modification with an Adam optomizer, binary crossentropy loss, and a focus on accuracy.  

                  All images inputted into the analysis tool use this trained U-Net classifier for segmentation.
              </p>
              <h3> Pre-Processing </h3>
              <p>
                    As a precursor to segmentation using the trained U-Net architecture explained above, all images are first pre-processed
                    to better insure proper segmentation. Specifically, all given images are grayscaled and then normalized so that 
                    all pixel values are now between 0 (min) and 1 (max). Then, images are either cropped or resized to be 256 x 256
                    in dimensions, depending on the original size of the image. If an image has its original width and height to be both 
                    greater than 255, then it undergoes a cropping from its top-left corner. If the images fails that condition, it is instead 
                    resized as a whole. The former is prioritized over the latter, as it generally yielded more defined cell borders in testing since 
                    it mocked the training images more amicably. The resizing usually made cells quite small, and therefore made border 
                    detection harder for the U-Net. 
              </p>
              <h3> Post-Processing </h3>
              <p>
                    On completion of the U-Net algorithm, it outputs a corresponding grayscale prediction image that highlights the 
                    cell borders of the inputted image. Note that the U-Net's prediction is subjective to the general quality of the inputted
                    image, with lower quality or tarnished images (i.e., white glares, dark regions) making border detection harder for the 
                    U-Net since less of the image is visible; this will often result in fewer cell borders being detected.  
                    However, in general, darker intensities of grey in the prediction image suggest a higher confidence of a pixel compromising a cell border, with lower
                    intensities of grey suggesting a lower confidence.

                    To allow for later analysis, each prediction image was thresholded at a pixel value of 125, with values greater
                    than 125 being set to 255 (white) and values less than or equal to 125 being set to 0 (black). This effectively 
                    binarized the image and eliminated middle ground on border classification, allowing for a clear-cut visual of 
                    "definite" cell borders. The image was then inverted using bitwise manipulation, now making cell borders white on a 
                    black background. As a final step, border thinning was applied using a combination of OpenCV's dilation functionality
                    paired with Sklearn's medial axis functionality on a 3x3 kernel over 5 iterations, which significantly reduced
                    border thickness while still mantaining border shape for the most part. 

              </p>
              <h2 style={{background: "blue"}}> Segmentation Analysis </h2>
              <h3> Cell Extraction </h3>
              <p>
                    Utilizing the post-processed U-Net prediction images, Python's OpenCV library was heavily utilized for individual
                    cell extraction. Specifically, OpenCV's findContours functionality was utilized on the inverted image, which 
                    searched the image for all enclosed regions and returned a hierarchy of contours for all enclosures found. 

                    Then, all contours were filtered out based on their location in the hierarchy. Namely, contours that 
                    had no internal contours (i.e., smallest distinctive enclosed region) were kept, excluding all large enclosures
                    and instead sifting it to keep the smallest possible unit - a cell. 

                    As a final check, all remaining contours, which should now be synonmous to unique cells in the image, were filtered out again
                    for potential incorrect segmentation. These constraints were based on general patterns seen in incorrectly segmented cells,
                    namely when two small cells were merged as a single larger cell, or less frequently, when a single larger cell 
                    was segmented as two smaller cells. To account for this, any cells that had a deceptively small cell area, were excessively
                    elonaged in shape, or had a large enough deviation in general structure (extreme asymmetry, excessive jagged lines) were ignored. 
                    Specific threshold values were determined through trial and error, and constraints were mathematially implemented using
                    minimum polygon enclosures - circle, rectangle, etc. - in conjunction to the cell's actual enclosed area for ratio estimation.
                    For instance, elongation check essentially enclosed the smallest possible rectangle around a contour, and then used the
                    enclosed rectangle's width to height ratio to determine the general elongation of the contour itself, with very large or very small
                    ratios indicative of a more deviantly stretched contour (possibly an accidental merging of two cells). 

                    All cellular feature analysis was then conducted on these remaining contours/cells.  
              </p>
              <h3> Cellular Feature Analysis </h3>
              <p>
                     Using domain expertise from an expereinced physician in the field, the main features looked at in the cells
                     were quantifications of its physical nature: cell size, cell shape, and cell pointiness. 

                     Cell Size: This feature was the most straightforward to calculate, and was quantified as the 
                     total internal area enclosed by the contour within the image. It was calculated using OpenCV's contourArea
                     function. According to Dr.Melles, determining rejection on a time series of endothelial images is largely 
                     tracked on the influx of cell size over time, with inflation in cell sizes usually indicative of cell swelling
                     and hence potential DMEK rejection. 

                     Cell Shape: Shape was quantified as the number of sides observed in the closest polygon approximation of the 
                     contour as a variant of its arc length. Using OpenCV's polygon approximation algorithm, a contour was matched to its cloest shape, namely
                     the polygon outline that would most enclose the internal area of the contour while staying within cell borders - an implementation of the 
                     Ramer–Douglas–Peucker algorithm that conducts curve downsampling. Once the approximation was acheived, it produced an array of edge
                     points (x,y coordinates indicating turning points) denoting the approximated shape it enclosed. The number of sides of this enclosed shape equaled the number of 
                     edge points it had. 

                     Cell Pointiness: Pointiness is defined as the ratio of the smallest angle to the largest angle within a contour. This feature is an extension
                     of the algorithm for determining cell shape above. Namely, after polygon approximation is done and a list of edge points have been 
                     established, angles are then calculated by sifting clockwise on the edge points in groups of three. Note, this is reasonable since all edge 
                     points are known to be in a clockwise manner from one another. In every group of three edge points, the angle of the middle edge point is calculated
                     using vector approximations, namely by leveraging the fact that the angle between two vectors is an inverse cosine of their dot product divided 
                     by their multiplied magnitude. Once all angles are calculated for all edge points, the smallest and largest angles are determined and 
                     their ratio calculated. Note that some contours have excessive contours or abnormal shapes that lead to extremelly small ratios, which 
                     paired with floating point rounding can sometimes lead to pointiness values of 0. 
              </p>
          </div>

      )
    }
  }
  
  export default Overview;