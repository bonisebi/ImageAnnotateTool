import { useEffect, useRef, useState } from 'react';

import { IoMdAddCircleOutline } from 'react-icons/io'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

import Image1 from './assets/Image1.jpg'
import Image2 from './assets/Image2.jpg'
import Image3 from './assets/Image3.webp'
import Image4 from './assets/Image4.jpg'
import Image5 from './assets/Image5.jpg'

import './App.css';
import KonvaCanvas from './Components/KonvaCanvas';
import ActionTile from './Components/ActionTile';

function App() {

  const [resetCanvas, setResetCanvas] = useState(false)
  const [enableDrawing, setEnableDrawing] = useState(false)
  const [enableResizing, setEnableResizing] = useState(false)
  const [enableDrag, setEnableDrag] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const [imageScale, setImageScale] = useState(1.0);
  const [imageUrl, setImageUrl] = useState(null)

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight)


  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const imageAnnotationObj = useRef({});

  const imagesList = [Image1, Image2, Image3, Image4, Image5];


  const uploadImage = () => {

    const image = new Image();
    image.src = imagesList[currentImgIndex];

    image.onerror = (err) => {
      console.error('Error loading the image.', err.message);
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
    localStorage.setItem("boxCoordinates", JSON.stringify(imageAnnotationObj.current))
  }

  const downloadBoxCoordinates = () => {
    const boxCoordinates = localStorage.getItem("boxCoordinates");

    const jsonData = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(boxCoordinates))}`;
    const link = document.createElement("a");
    link.href = jsonData;
    link.download = "data.json";
    link.click();
  }

  useEffect(() => { setIsFirstRender(false) }, [])
  useEffect(() => { if (!isFirstRender) { uploadImage() } }, [currentImgIndex])

  return (
    <main >
      <div className="add-img" onClick={() => uploadImage()}>
        <span>Click to Add Images</span>
        <IoMdAddCircleOutline />
      </div>

      {imgLoaded && (
        <ActionTile
          setResetCanvas={setResetCanvas}
          setEnableResizing={setEnableResizing}
          setEnableDrag={setEnableDrag}
          setImageScale={setImageScale}
          setEnableDrawing={setEnableDrawing} />
      )}

      <KonvaCanvas
        imageUrl={imageUrl}
        width={canvasWidth}
        height={canvasHeight}
        enableDrawing={enableDrawing}
        resetCanvas={resetCanvas}
        enableResizing={enableResizing}
        enableDrag={enableDrag}
        scale={imageScale}
        saveAnnotations={getImgAnnotations}
        setResetCanvas={() => { setResetCanvas(false) }}
      />

      <div className={`navBtn prev ${imgLoaded ? 'show' : ''}`} onClick={() => { navigateImage('prev'); }}>
        <AiOutlineLeft />
      </div>
      <div className={`navBtn nxt ${imgLoaded ? 'show' : ''}`} onClick={() => { navigateImage('next'); }}>
        <AiOutlineRight />
      </div>

      <div className="action-btn">
        <button onClick={saveBoxCoordinates} className='save'>SAVE</button>
        <button onClick={downloadBoxCoordinates} className='submit'>Submit</button>
      </div>

    </main>
  );

}

export default App;
