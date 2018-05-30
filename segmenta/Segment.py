#!/usr/bin/python

from scipy import misc
from skimage import color
from skimage.measure import regionprops
import math
import cv2
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import argparse
import sys

def toBinaryPxl(pixel):
    if pixel != (0,0,0):
        return (1,1,1)
    else:
        return (0,0,0)

def toBinaryImg(img):
    binary = np.zeros((imag.shape[0],image.shape[1],image.shape[2]))
    for row in range(img.shape[0]):
        for col in range(img.shape[1]):
            binary = toBinaryPxl(img[row][col])
    return binary

def calcArea(plantSeg,diseaseSeg):
    areaP=0
    areaD=0
    for row in range(plantSeg.shape[0]):
        for col in range(plantSeg.shape[1]):
            if all(a != 0 for a in plantSeg[row][col]):
                areaP+=1

    area=0
    for row in range(diseaseSeg.shape[0]):
        for col in range(diseaseSeg.shape[1]):
            if all(a != 0 for a in diseaseSeg[row][col]):
                area+=1

    areaD = areaP-area
    print(areaP)
    print(areaD)
    areas=(areaP,areaD)
    return areas

# Parse arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="Path to the image")
args = vars(ap.parse_args())
imageName = args["image"].split("/")
pathToSave = "."
nameToSave = imageName[len(imageName)-1]
nameToSave = nameToSave.split(".")
nameToSave = nameToSave[0]+"_segmented.png"

for i in range(1, len(imageName)-1):
    pathToSave = pathToSave+"/"+imageName[i]

pathToSave = pathToSave+"/"+nameToSave

imageRgb = misc.imread(args["image"])
frameRgb = cv2.GaussianBlur(imageRgb,(5,5),0)
imageBgr = cv2.cvtColor(imageRgb,cv2.COLOR_RGB2BGR)
#imageLab = cv2.cvtColor(imageRgb,cv2.COLOR_RGB2Lab)
frame = cv2.GaussianBlur(imageBgr,(5,5),0)

# Convert image to HSV from RGB
imageHsv = cv2.cvtColor(frame,cv2.COLOR_BGR2HSV)
imageYcbcr = np.uint8(color.rgb2ycbcr(frameRgb))

h,s,v = cv2.split(imageHsv)
y,cb,cr = cv2.split(imageYcbcr)

# Otsu's thresholding
ret2,th2 = cv2.threshold(cb,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
th2i = np.logical_not(th2)
th2i = np.uint8(th2i)

#plt.imshow(th2i,cmap=cm.Greys_r)
#plt.show()

kernel1=(3,3)
kernel1 = np.ones(kernel1, np.uint8)

# Operacao de dilatacao para corrigir possiveis falhas na segmentacao.
# E preparar para remocao dos ruidos.
th2i = cv2.dilate(th2i,kernel1,iterations = 3)

#plt.imshow(th2i,cmap=cm.Greys_r)
#plt.show()

# Remove os ruidos do fundo. Pixels brancos que nao estao ligados a planta.
nb_components, output, stats, centroids = cv2.connectedComponentsWithStats(th2i)
sizes = stats[:, -1]

max_label = 1
max_size = sizes[1]
for i in range(2, nb_components):
    if sizes[i] > max_size:
        max_label = i
        max_size = sizes[i]

img2 = np.zeros(output.shape)
img2[output == max_label] = 255


# Fecha alguns focos de preto no interior da folha. Que foram mal segmentados.
th21 = cv2.morphologyEx(img2, cv2.MORPH_CLOSE, kernel1,iterations=5)
#plt.imshow(th21,cmap=cm.Greys_r)
#plt.show()

th211 = np.logical_not(th21)

#plt.imshow(th211,cmap=cm.Greys_r)
#plt.show()

# Remove focos de preto que continuaram no interior da folha.
for i in range(th211.shape[0]):
    th211[i][0]=255

nb_components, output, stats, centroids = cv2.connectedComponentsWithStats(np.uint8(th211))
sizes = stats[:, -1]
max_label = 1
max_size = sizes[1]
for i in range(2, nb_components):
    if sizes[i] > max_size:
        max_label = i
        max_size = sizes[i]

img3 = np.zeros(output.shape)
img3[output == max_label] = 255
img3 = np.logical_not(img3)

# Aplica erosao, por causa da dilatacao anterior.
img3 = cv2.erode(np.uint8(img3),kernel1,iterations = 4)

# Plant with disease
plant = cv2.bitwise_and(frame,frame, mask=np.uint8(img3))

plant2 = cv2.cvtColor(plant,cv2.COLOR_BGR2RGB)
#plantYcbcr = np.uint8(color.rgb2ycbcr(plant2))
#py,pcr,pcb = cv2.split(plantYcbcr)
#cv2.imwrite('giu1_cb.png', pcb)

########## Segmentacao da doenca sem Otsu ##############
plantHsv = cv2.cvtColor(plant,cv2.COLOR_BGR2HSV)
hsvlowD = np.array([30,0,0])
hsvhighD = np.array([179,255,255])
maskD = cv2.inRange(plantHsv,hsvlowD,hsvhighD)
plantWd = cv2.bitwise_and(plant,plant, mask=maskD)

# Plant without disease
plantWd = cv2.cvtColor(plantWd, cv2.COLOR_BGR2RGB)

r,g,b = cv2.split(plant2)
rwd,gwd,bwd = cv2.split(plantWd)

#areas = calcArea(plant,plantWd)
areaP = cv2.countNonZero(g)
#misc.imsave('giu1.png',plant2)
areaD = areaP - cv2.countNonZero(gwd)
percent = np.float32(areaD)/np.float32(areaP)*100
#print(areaP)
#print(areaD)
print(percent)
misc.imsave(pathToSave,plant2)

# Plot images with subplot
#f, axarr = plt.subplots(2,3)
#axarr[0,0].imshow(frameRgb)
#axarr[0,1].imshow(img3,cmap=cm.Greys_r)
#axarr[0,2].imshow(plant2)
#axarr[1,0].imshow(maskD,cmap=cm.Greys_r)
#axarr[1,1].imshow(plantWd)
#plt.show()

#ab = regionprops(plant)
#print(ab.__len__())
