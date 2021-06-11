# Analysis Tool Website

This repository contains all source code for this project, and is divided up into two main components - _Backend_ & _Frontend_.

_Backend_ compromises of all folders and files in the root directory, excluding `\client`, and essentially constitutes the server that is exploited by the frontend. It utilizes Express routes that are validated using middleware, many of which utilize services that allow for employment of machine learning techniques - namely libraries like tensorflowjs and keras. All routes are handled within the `routes` folder, with each specific set of routes seperated by functionality, and making usage of specific services within the `/services` folder.
Since the pinnacle focus of the server is to allow for predictions between the CNN and the segmentation analysis
model, each have their respective workflows bundled in their own distinct directories. For the CNN model,
its workflow and final model structure/weights are contained within `/cnn`. Similarly, the segmentation workflow
has its workflow directory and final model strucuture/weights containted within `/segmentation`. Note: The 
segmentation process is more intensive than predictions on the CNN model, so it contains a large pipelining effect from the UNET to the workflow process to the python files (activited using spawning libraries). 

_Frontend_ compromises of all folders and files inside of `\client`. It utilizes React components to render visual designs. The React Router located within the App.js file provides the central source of navigation in the browser via available URL paths, rendering the corresponding screen by calling a corresponding React component. All major screens/pages that are rendered inside of App.js can be found inside of `src/pages`, with each of those pages usually having their own set of subcomponents being called from `src/components`. All React components have their corresponding (i.e., same name, different extension) css files located inside of `src/css`.

### Hosting + Production

Hosting is done on an EC2 instance on AWS with a Deep Learning AMI (Ubuntu). It utilizes nginx as a reverse proxy to host the backend server as its own API, and seperately serves the frontend as well. When hosted, the server can be accessed using the preface `/server` whereas frontend can be accessed using `/`. The config file mediates between the production and development enviroment utilizing enviroment variables. By default, config file utilizes development values, and when in the EC2 instance, utilizes an `.env` file to set production values. This `.env` file exists within the EC2 instance only, and is not pushed to the source code on this Github repo.

#### Library Versions 

Please note that the EC2 instance is very delicately set-up to include all necessary deep learning libraries like keras, tensorflow, etc. and therefore library versions are quite sensitive. It is highly suggested to not update/touch the EC2 instance enviroment unless you are in full confidence of the changes you are making, and are privy to the possible code crashes they may cause, particulary the server's segementation implementation. 

### Continous Integration 

The GitHub is configured using GitHub actions to automatically redeploy the website to the EC2 instance every time a pull request is merged into master. This can be monitored under the _Actions_ tab on this repo, with any statuses with green showing successfull redeploys and any with red indicating a redeployment error.

In general, this configuration is set up using a .yml file found under `.github/workflows`, and involves SSHing into the EC2 instance and then repulling code into a corresponding GitHub repo there and rebuilding both the server and client. Hence, any pushes to master will cause corresponding edits to pushed 'live' within a few minutes, depending on how long the redeployment process takes on the AWS instance. 

### Machine Learning 

As of note, all machine learning is implemented on the server, and can be accessed by the website using
the server API. 

#### CNN Model 

The Convulutional Neural Network, or CNN model, is a hyper-tuned VGG16 model that was trained on 
a batch of around 400 endothetlial cell images for binary classification purposes. It takes in an image,
runs it through its trained layers, and outputs two numbers - likelihood of normal (0), and likelihood
of rejection (1). Both values are between 0 and 1, with 1 indicating the greatest likelihood by the model
and 0 indicating the least likelihood. For example, a prediction of 0:0.82, 1: 0.18 suggests that the model
thinks the image is much more likely to be normal than rejected since 0.82 >> 0.18. 

In general, the workflow for the CNN is the following: a route is activated in `routes/cnn`, which makes copies of all passed image data to `cnn/img_dest` and then pipelines relevent information to `services/cnn`, which in turn utilizes `cnn/pred_model` to output a prediction using the tfjs and tfjs-node modules, returning the prediction result back to the original route.  

Following is a breakdown of `/cnn`:
- `img_dest`: Temporarily holds image files of all passed in FileStreams to the /cnn/prediction route. 
- `pred_model`: Contains compacted shards of final CNN layers and weights. 
- `constants.js`: Relevent constants for cnn workflow. 

#### Segmentation 

The segmentation process is responsible for taking in a photographic image, utilizing UNET to make an image prediction extracting all cell borders, and then using post-segmentation techniques to extract cellular information on all cells dissected from the image prediction. At intermediate parts of its process, it will create complementary overlay images, depicting an overlay of the predicted segmentation on top of the original image given for comparison purposes. The process itself is a combination of deep learning using tensorflow/keras paired with machine learning libraries such as sklearn, with most segmentation and analysis code written in python called by `routes/services` using a spawning module with batch iteration to offset large loads. 

In general, the workflow for segmentation is the following: a route is activated in `routes/segmentation`, which makes copies of all passed image data to `segmentation/workflow/raw_img`, saves 256 x 256 cropped versions of them under `segmentation/workflow/cropped_img`, and then pipelines the cropped images to `services/segmentation` to 1) segment the results into cellborders (saved in `segmentation/workflow/unet_img`) using spawning libraries on `segmentation/workflow/python/segmentCells.py` 2) analyze those results using spawning libraries on `segmentation/workflow/python/analyzeCells.py` which produces intermediate overlay images under `segmentation/workflow/colored_img` as needed. These final cellular results are then passed back to the original route, and written out to the response body.  

Following is a breakdown of `/segmentation`:
- `python `: Holds all python code for Unet segmentation (segmentCells.py) and analysis of segmentation (analyzeCells.py). 
- `workflow`: Contains intermediate directories used to hold image data while segmentation occurs. 
- `constants.js`: Relevent constants for segmentation workflow. 
- `unet_membrane.hdf5`: Holds final weights for UNET model needed for `segmentation/python/segmentCells.py`


## Dependencies

### Node Installation

Dependencies you'll need:

- Node 14+ (Recommended v14.15.1)
- NPM 6+ (Recommended v6.14.8)
- Git LFS
- Python 3+ (Recommended v3.7.4)
- Tensorflow 2+ (Recommended v2.4.1)
- Keras 2+ (Recommended v2.2.4)
- NumPy (Recommended v1.17.2)
- scikit-image (Recommended v0.15.0)

Node.js can be downloaded from here: https://nodejs.org/en/

_Note_: Downloading Node will automatically download NPM for you.

To verify Node installation, you can do:

`node -v`

To verify NPM installation, you can do:

`npm -v`

If you find your NPM version is out of date, you can install the latest version using:

`npm install npm@latest -g`

Git LFS can be downloaded using instructions from here: https://git-lfs.github.com
This is necessary to allow for the retrievel of the UNET segmentation weights, which are stored using Git LFS as they are around 350MB, much bigger than GitHub's limit of 100MB per file. 

To verify Git LFS installation, you can do:

`git lfs -v`

To install all other dependencies mentioned, it is highly recommended to use Anaconda (recommended v4.9.2) for quick installations as it comes with most of these libraries. You may need to tweak the version downloaded of each mentioned library at your discretion using conda commands. 

Anaconda can be downloaded here: https://docs.anaconda.com/anaconda/install/.

To verify Anaconda installation and version, you can do: 

`conda --version`

To verify Python installation and version, you can do:

`python --version`

To verify Tensorflow installation and version, you can do:

`python -c 'import tensorflow as tf; print(tf.__version__)'`

To verify Keras installation and version, you can do:

`python -c 'import keras; print(keras.__version__)'`

To verify scikit-image installation and version, you can do:

`python -c "import skimage; print(skimage.__version__)"`

To verify NumPy installation and version, you can do:

`python3 -c "import numpy; print(numpy.__version__)"`


## Setup

The corresponding config files in both backend and frontend manages what global variables are being set in that
directory.

The config file contains "local" constants that are suitable during development stage, with the expectation that
prioirty constants needed for production would be located inside of a dotenv file. Currently, the config files
have "local" constants defined internally, and can be ran independently of a dotenv file for development/testing
purposes. These "local" constants may also be changed as needed. However, if a corresponding value exists inside
of the dotenv file, be aware that it takes precedence over the corresponding "local" constant.

### Running Backend (Locally)

While in the root level directory, you can run:

### `npm install`
### `git lfs pull`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:9000](http://localhost:9000) to view it in the browser.

The page will reload upon edits since it is run using nodemon.

### Running Frontend (Locally)

While in the `\client` directory, you can run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.