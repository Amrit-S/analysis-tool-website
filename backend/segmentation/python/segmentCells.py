'''
File takes in raw images of endothelial cells, and attempts to do cell segmentation utilizing the UNET architecture. 
If successful, the resultant image prediction will be stored within a specified directory. 

Note: The UNet algorithm is optimal on 256 x 256 images that are relatively zoomed into the surface of the cells. Any blurs
and overly dark spots will produce less than ideal segmentation. 

'''
import sys
import os
import numpy as np
import skimage.io as io
import skimage.transform as trans
import json
from tensorflow.keras.models import *
from tensorflow.keras.layers import *
from tensorflow.keras.optimizers import *
from tensorflow.keras.callbacks import ModelCheckpoint, LearningRateScheduler
from tensorflow.keras import backend as keras

# Variables passed from Node
IMG_SRC_DIR = sys.argv[1]
UNET_SRC_DIR = sys.argv[2]
WEIGHTS_FILE = sys.argv[3]
CROPPED_IMG_DST = sys.argv[4]
FILENAMES = json.loads(sys.argv[5])

# Crop image on top left, size 256 x 256 
target_size = (256,256)
X_OFFSET = 0
Y_OFFSET = 0
CROP_WIDTH = 256
CROP_HEIGHT = 256


''' Defines UNet architecture using Keras. '''
def unet(pretrained_weights = None,input_size = (256,256,1)):

    inputs = Input(input_size)
    conv1 = Conv2D(64, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(inputs)
    conv1 = Conv2D(64, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv1)
    pool1 = MaxPooling2D(pool_size=(2, 2))(conv1)
    conv2 = Conv2D(128, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(pool1)
    conv2 = Conv2D(128, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv2)
    pool2 = MaxPooling2D(pool_size=(2, 2))(conv2)
    conv3 = Conv2D(256, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(pool2)
    conv3 = Conv2D(256, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv3)
    pool3 = MaxPooling2D(pool_size=(2, 2))(conv3)
    conv4 = Conv2D(512, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(pool3)
    conv4 = Conv2D(512, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv4)
    drop4 = Dropout(0.5)(conv4)
    pool4 = MaxPooling2D(pool_size=(2, 2))(drop4)

    conv5 = Conv2D(1024, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(pool4)
    conv5 = Conv2D(1024, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv5)
    drop5 = Dropout(0.5)(conv5)

    up6 = Conv2D(512, 2, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(UpSampling2D(size = (2,2))(drop5))
    merge6 = concatenate([drop4,up6], axis = 3)
    conv6 = Conv2D(512, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(merge6)
    conv6 = Conv2D(512, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv6)

    up7 = Conv2D(256, 2, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(UpSampling2D(size = (2,2))(conv6))
    merge7 = concatenate([conv3,up7], axis = 3)
    conv7 = Conv2D(256, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(merge7)
    conv7 = Conv2D(256, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv7)

    up8 = Conv2D(128, 2, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(UpSampling2D(size = (2,2))(conv7))
    merge8 = concatenate([conv2,up8], axis = 3)
    conv8 = Conv2D(128, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(merge8)
    conv8 = Conv2D(128, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv8)

    up9 = Conv2D(64, 2, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(UpSampling2D(size = (2,2))(conv8))
    merge9 = concatenate([conv1,up9], axis = 3)
    conv9 = Conv2D(64, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(merge9)
    conv9 = Conv2D(64, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv9)
    conv9 = Conv2D(2, 3, activation = 'relu', padding = 'same', kernel_initializer = 'he_normal')(conv9)
    conv10 = Conv2D(1, 1, activation = 'sigmoid')(conv9)

    model = Model(inputs=inputs, outputs=conv10)

    model.compile(optimizer = Adam(lr = 1e-4), loss = 'binary_crossentropy', metrics = ['accuracy'])

    return model

'''

Produces a generator of images that must be segmented on. Responsible for correctly pre-processing all 
images properly so segmentation can occur.  

Note: Each image is cropped to be 256 x 256, grayscaled, and normalized in terms of pixel value. 

'''
def testGenerator(test_path, filenames):

    # Pre-process all passed in images 
    for imgName in filenames:
        
        # Grayscale
        img = io.imread(os.path.join(test_path,imgName),as_gray = True)
        # Crop 256 x 256 (top left)
        img = img[X_OFFSET:X_OFFSET + CROP_WIDTH, Y_OFFSET:Y_OFFSET + CROP_HEIGHT]
        io.imsave(os.path.join(CROPPED_IMG_DST, "{}".format(imgName)),img) # save for later use in segmentation 

        # Normalize pixel values
        img = img / 255
        img = trans.resize(img,target_size)

        # Reshape into correct number of channels for UNET
        img = np.reshape(img,img.shape+(1,))
        img = np.reshape(img,(1,)+img.shape)
        yield img

''' Given UNet prediction results, saves all results as images with appropriate filenames in desired directory. '''
def saveResult(save_path,npyfile, filenames):
    for i,item in enumerate(npyfile):
        img = item[:,:,0]
        io.imsave(os.path.join(save_path, "{}".format(filenames[i])),img)

# Generator of all (preprocess) images that will be segmented on
testGene = testGenerator(IMG_SRC_DIR, FILENAMES)
# Load model with weights
model = unet()
model.load_weights(WEIGHTS_FILE)
# Conduct segmentation
results = model.predict(testGene)
# Save segmentation results
saveResult(UNET_SRC_DIR,results, FILENAMES)


print(json.dumps(FILENAMES))
sys.stdout.flush()