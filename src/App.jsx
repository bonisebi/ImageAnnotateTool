import { useEffect, useRef, useState } from 'react';

import { IoMdAddCircleOutline } from 'react-icons/io'
import { AiOutlineLeft, AiOutlineRight, AiOutlineInfoCircle } from 'react-icons/ai'

import Image1 from './assets/Image1.jpg'
import Image2 from './assets/Image2.jpg'
import Image3 from './assets/Image3.webp'
import Image4 from './assets/Image4.jpg'
import Image5 from './assets/Image5.jpg'

import './App.css';
import KonvaCanvas from './Components/KonvaCanvas';
import ActionTile from './Components/ActionTile';
import toast, { Toaster } from 'react-hot-toast';


function App() {

  const [resetCanvas, setResetCanvas] = useState(false)
  const [enableDrawing, setEnableDrawing] = useState(false)
  const [enableResizing, setEnableResizing] = useState(false)
  const [enableDrag, setEnableDrag] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [deleteRectBox, setDeleteRectBox] = useState(false)
  const [imageScale, setImageScale] = useState(1.0);
  const [imageUrl, setImageUrl] = useState(null)

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)


  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const imageAnnotationObj = useRef({});

  const imagesList = [Image1, Image2, Image3, Image4, Image5];


  const uploadImage = () => {
    //Loading the image in to the canvas.
    const image = new Image();
    image.src = imagesList[currentImgIndex];

    image.onerror = () => {
      toast.error('Error loading the image.');
    };

    image.onload = () => {
      const widthRatio = window.innerWidth / image.width;
      const heightRatio = window.innerHeight / image.height;
      const scaleFactor = Math.min(widthRatio, heightRatio);

      //dimensions to fit the image
      const newWidth = image.width * scaleFactor;
      const newHeight = image.height * scaleFactor;

      setCanvasWidth(newWidth)
      setCanvasHeight(newHeight)

      // Set it as the source for the Konva Image component
      setImageUrl(image);
      setImgLoaded(true);
    }
  }

  const navigateImage = (direction) => {
    //To navigate through the loaded images.
    //This allows us to work on muliple images.

    setResetCanvas(true);
    if (direction === 'prev') {
      setCurrentImgIndex((prev) => {
        if (prev - 1 < 0) return prev;
        return prev - 1;
      })
    }
    else {
      setCurrentImgIndex((prev) => {
        if (prev + 1 > imagesList.length - 1) return 0;
        return prev + 1;
      })
    }

  }

  const getImgAnnotations = (img, rect) => {
    //Format current drawn rectangle boxes for later use.
    if (imgLoaded) {
      imageAnnotationObj.current[`${img.src}`] = []
      rect.forEach(((eachItem) => {
        const x1 = eachItem.x;// left coordinate of the box
        const y1 = eachItem.y;// top coordinate of the box
        const x2 = eachItem.x + eachItem.width; // right coordinate of the box
        const y2 = eachItem.y + eachItem.height; // bottom coordinate of the box

        imageAnnotationObj.current[`${img.src}`].push({ x1: x1, y1: y1, x2: x2, y2: y2 });
      }))
    }
  }

  const saveBoxCoordinates = () => {
    //Store the box-Coordinates in browser localstorage
    localStorage.setItem("boxCoordinates", JSON.stringify(imageAnnotationObj.current))
    toast.success('Box coordinates saved successfully.');
  }

  const downloadBoxCoordinates = () => {
    // Download the Saved box-Coordinates as Json file

    const boxCoordinates = localStorage.getItem("boxCoordinates");
    if (boxCoordinates) {
      const jsonObject = JSON.parse(boxCoordinates);
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      const blob = new Blob([formattedJson], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "data.json";
      link.click();
      toast.success('Download request submitted.');
    } else {
      toast("No saved coordinates found.", { icon: <AiOutlineInfoCircle />, duration: 1000 })
    }

  }

  useEffect(() => {
    //For following up the first render as we do not want the canvas to load the image until user clicked.
    setIsFirstRender(false)
  }, [])

  useEffect(() => {
    //To uploadImage to the canvas whenever there is a user navigation through the images.
    if (!isFirstRender) { uploadImage() }
  }, [currentImgIndex])

  return (
    <main >
      <Toaster position='top-right' />
      <div className="add-img" onClick={() => uploadImage()}>
        <span>Click to Load Images</span>
        <IoMdAddCircleOutline />
      </div>

      {/* Tools tile for the actions */}
      {imgLoaded && (
        <ActionTile
          setResetCanvas={setResetCanvas}
          setEnableResizing={setEnableResizing}
          setEnableDrag={setEnableDrag}
          setImageScale={setImageScale}
          setEnableDrawing={setEnableDrawing}
          setDeleteRectBox={setDeleteRectBox} />
      )}
      {/*Canvas to draw the rectanlges  */}
      <KonvaCanvas
        imageUrl={imageUrl}
        width={canvasWidth}
        height={canvasHeight}
        enableDrawing={enableDrawing}
        resetCanvas={resetCanvas}
        enableResizing={enableResizing}
        enableDrag={enableDrag}
        scale={imageScale}
        deleteRectBox={deleteRectBox}
        saveAnnotations={getImgAnnotations}
        setResetCanvas={() => { setResetCanvas(false) }}
      />

      <div className={`navBtn prev ${imgLoaded ? 'show' : ''}`} onClick={() => { navigateImage('prev'); }}>
        <AiOutlineLeft />
      </div>
      <div className={`navBtn nxt ${imgLoaded ? 'show' : ''}`} onClick={() => { navigateImage('next'); }}>
        <AiOutlineRight />
      </div>

      <div className={`action-btn ${imgLoaded ? 'show' : ''}`}>
        <button onClick={saveBoxCoordinates} className='save'>SAVE</button>
        <button onClick={downloadBoxCoordinates} className='submit'>Submit</button>
      </div>

    </main>
  );

}

export default App;
