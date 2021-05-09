import sys
import os
import copy, csv, math
import numpy as np
import cv2
import json
from PIL import Image
import statistics
from skimage.morphology import medial_axis, skeletonize

UNET_SRC_DIR = sys.argv[1]
COLORED_IMG_DST = sys.argv[2]
CSV_DATA_DST = sys.argv[3]
CROPPED_IMG_DST = sys.argv[4]
OPTIONS = json.loads(sys.argv[5])
FILENAMES = json.loads(sys.argv[6])

IMG_H, IMG_W = 256, 256 #Expected dimensions of all images

#Incorrect Segmentation Analysis
MIN_CELL_SIZE_THRESHOLD = 100
MIN_EXTENT = 0.6

MAX_EDGES = 9
MAX_ASPECT_RATIO = 0.2

# Features
SIZE = "size"
SHAPE = "shape"
POINTINESS = "pointiness"
IGNORED_FILES = [".keep"]

def checkForExternalContour(contour, filters):
    for fil in filters:
        if np.array_equal(np.array(fil), np.array(contour)):
            return True
    return False

def checkForIncorrectSegmentation(cnt, area):

    #Really small "cells" --> Usually incorrect contour  
    if area < MIN_CELL_SIZE_THRESHOLD:
        return True

    return False

    #Edge count (sharp turns) --> White Line Fragment Check
    peri = cv2.arcLength(cnt, True)
    approx_edges = cv2.approxPolyDP(cnt, 0.02 * peri, True)

    #Min. Rectangle Ratio --> Elongation Check
    (x,y), (width, height), angle = cv2.minAreaRect(cnt)
    aspect_ratio = float(width)/height

    #Min. Circle Filling --> Asymmetry/Abnormal Shape Check
    (x,y),radius = cv2.minEnclosingCircle(cnt)
    extent = float(area)/ (math.pi * (radius ** 2))

    if (abs(1 - aspect_ratio) > MAX_ASPECT_RATIO and extent < MIN_EXTENT) or len(approx_edges) > MAX_EDGES:
        return True

    return False

def findContours(filename):

    img = cv2.imread(filename)

    #Grayscale 
    image_clean = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    #Binary image (0s & 255s)
    ret, image_clean = cv2.threshold(image_clean,125,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    #invert
    image_clean = cv2.bitwise_not(image_clean)

    #Thinning - Dilation & Medial Axis
    skel, distance = medial_axis(image_clean.copy(), return_distance=True)
    kernel = np.ones((3,3),np.uint8)
    image_clean = cv2.dilate(image_clean,kernel,iterations = 5)
    image_clean = distance * skel
    image_clean[:] *= 255
    image_clean = image_clean.astype(np.uint8)

    #Find all contours (enclosed cells)
    cnts = cv2.findContours(image_clean, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    external_contours = cv2.findContours(image_clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    external_contours = external_contours[0] if len(external_contours) == 2 else external_contours[1]

    #invert
    image_clean = cv2.bitwise_not(image_clean)

    #RGB
    image_clean = cv2.cvtColor(image_clean,cv2.COLOR_GRAY2RGB)

    return image_clean, cnts, external_contours



def colorizeCellBorders(image_clean, cnts, external_contours):

    
    #Loop through contours
    for c in cnts:
        
        #"Erase" contour if external
        if checkForExternalContour(c, external_contours):
            cv2.drawContours(image_clean,[c], 0, (255,255,255), 0)
            continue

    index = 1
    #Loop through contours
    for c in cnts:
        
        #External contour already ereased so just skip it 
        if checkForExternalContour(c, external_contours):
            continue
        
        #Central coordinates
        M = cv2.moments(c)
        if M['m00'] == 0:
            M['m00'] = 1
        cX = int(M['m10']/M['m00'])
        cY = int(M['m01']/M['m00'])
        area = cv2.contourArea(c)

        #Potentially incorrectly segmented
        if checkForIncorrectSegmentation(c, area):
            continue
            #cv2.drawContours(image_clean,[c], 0, (0,255,0), 1) #Bolden
        else:
            cv2.drawContours(image_clean,[c], 0, (0,255,0), 1) #Bolden

        #Alternating text colors 
        text_color = (255, 0, 255, 0.7) if index % 2 == 0 else (0, 128, 255)
        cv2.putText(image_clean, str(index), (cX - 3, cY), cv2.FONT_HERSHEY_SIMPLEX, 0.28, text_color, 1)

        index += 1
    
    return image_clean

def overlay(overlay_path, bg_path, result_path, test):

    img = Image.open(overlay_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        if item[0] == 255 and item[1] == 255 and item[2] == 255:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(test)
    
    background = Image.open(bg_path)
    overlay = Image.open(test)

    background = background.resize((IMG_W, IMG_H))
    overlay = overlay.resize((IMG_W, IMG_H))

    background = background.convert("RGBA")
    overlay = overlay.convert("RGBA") 

    background.paste(overlay,  (0, 0), overlay)
    background.save(result_path)

def extractCharachteristicFromContour(cnt, options):

    #Size
    if options == SIZE:
        area = cv2.contourArea(cnt)
        return area

    #Edge points (clockwise) of closest polygon approximation
    approx_polygon = cv2.approxPolyDP(cnt,0.035*cv2.arcLength(cnt,True),True)

    #Shape
    if options == SHAPE:
        # Num Sides
        sides = len(approx_polygon)
        return sides

    '''Calculates angle of vertex ABC, where A,B,C are each 2D points'''
    def calculateAngle(a, b, c):
        a = np.array(a[0])
        b = np.array(b[0])
        c = np.array(c[0])

        ba = a - b
        bc = c - b

        try:
            cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
            angle = np.arccos(cosine_angle)
        except:
            return 0

        return np.degrees(angle)

    total_points = len(approx_polygon)
    #Calculate the angle (degrees) of each vertex in a clockwise manner
    degrees = [calculateAngle(approx_polygon[(index - 1) % total_points],b,approx_polygon[(index + 1) % total_points]) for index,b in enumerate(approx_polygon)]

    #Pointiness
    if options == POINTINESS:

        point_ratio = min(degrees)/float(max(degrees))

        if math.isnan(point_ratio):
            return 0

        return point_ratio

def extractCharachteristic( cnts, external_contours, options):

    #Labels for csv
    # if options.size:
    #     csv_info = ['Area']
    # elif options.shape:
    #     csv_info = ['# Sides']
    # elif options.points:
    #     csv_info = ['Point Ratio (S/L)']

    # #Write cell areas to .csv file as found 
    # with open(csv_filename, mode='w') as csv_file:

    #     #Setup csv writer
    #     csv_writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    #     #Header
    #     csv_writer.writerow(['Cell Number', csv_info[0]])

    #     index = 1
    #     values = []

    #     #Loop through contours
    #     for c in cnts:
            
    #         #Skip contour if external 
    #         if checkForExternalContour(c, external_contours):
    #             continue
            
    #         #Central coordinates
    #         M = cv2.moments(c)
    #         if M['m00'] == 0:
    #             M['m00'] = 1
    #         cX = int(M['m10']/M['m00'])
    #         cY = int(M['m01']/M['m00'])
    #         area = cv2.contourArea(c)

    #         #Analyze charachteristic in contour
    #         value = extractCharachteristicFromContour(c, options)
    #         values.append(value)

    #         #Only fill in contours that meet requirements 
    #         if not checkForIncorrectSegmentation(c, area):
    #             csv_writer.writerow([str(index), str(value)])

    #         index += 1

    index = 0
    values = []

    #Loop through contours
    for c in cnts:
        
        #Skip contour if external 
        if checkForExternalContour(c, external_contours):
            continue

        #Analyze charachteristic in contour
        value = extractCharachteristicFromContour(c, options)
        values.append(value)
        index += 1

    dict_count = {
        "min": min(values),
        "max": max(values),
        "std": statistics.stdev(values),
        "mean": statistics.mean(values),
        "median": statistics.median(values),
        "totalCells": index
    }
    
    return dict_count


def main(unet_src_imgs, colored_imgs_dst, csv_data_dst, cropped_img_dest, options, filenames):

    img_stats = []

    #Loops through all segmented images
    for img in filenames:

        #Needed filepaths
        dest_filename = os.path.join(colored_imgs_dst, os.path.splitext(img)[0] + ".png")
        csv_filename = os.path.join(csv_data_dst, os.path.splitext(img)[0] + ".csv")

        #Contour extraction
        image_clean, cnts, external_contours = findContours(os.path.join(unet_src_imgs, img))

        #Just focus on confident cells borders, no csv files

        if options["overlay"]:
            image_clean = colorizeCellBorders(image_clean, cnts, external_contours)

            overlay_path = os.path.join(colored_imgs_dst, "OV_{}.png".format(os.path.splitext(img)[0]))
            cv2.imwrite(overlay_path, image_clean)

            bg_path = os.path.join(cropped_img_dest, img)
            test = os.path.join(colored_imgs_dst, "OV2_{}.png".format(os.path.splitext(img)[0]))
            overlay(overlay_path, bg_path, dest_filename, test)

        # Generate csv file - statistics 
        dict_feature_stats = {}

        if options["size"]:
            dict_stats = extractCharachteristic( cnts, external_contours, SIZE)
            dict_feature_stats[SIZE] = dict_stats
        if options["shape"]:
            dict_stats = extractCharachteristic( cnts, external_contours, SHAPE)
            dict_feature_stats[SHAPE] = dict_stats
        if options["pointiness"]:
            dict_stats = extractCharachteristic( cnts, external_contours, POINTINESS)
            dict_feature_stats[POINTINESS] = dict_stats

        img_stats.append(dict_feature_stats)

    print(json.dumps(img_stats))
    sys.stdout.flush()

main(UNET_SRC_DIR, COLORED_IMG_DST, CSV_DATA_DST, CROPPED_IMG_DST, OPTIONS, FILENAMES)