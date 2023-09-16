/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Image } from 'react-konva'

import './KonvaCanvas.css';

const KonvaCanvas = (props) => {
    const {
        resetCanvas,
        setResetCanvas,
        enableDrawing,
        enableResizing,
        imageUrl,
        width,
        height,
        enableDrag,
        deleteRectBox = false,
        saveAnnotations = () => { },
        scale = 1 } = props;

    const canvasRef = useRef(null)
    const imageRef = useRef(null)
    const layerRef = useRef(null)

    const newRect = useRef()

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);

    const [isDrawing, setIsDrawing] = useState(false)
    const [rectangles, setRectangles] = useState([])

    const [resizeBtnColor, setResizBtnColor] = useState("yellow")

    const [selectedRectIndex, setSelectedRectIndex] = useState(-1)
    const [resizeHandle, setResizeHandle] = useState(null);

    const [enableEdit, setEnableEdit] = useState(false);

    const [savedCoordinatesPresent, setSavedCoordinatesPresent] = useState(false);


    const startDrawingRectangle = () => {
        //On Mouse down this event hits to start drawing the rectangle in the canvas.
        //This saves the pointer's current position to start the draw. 
        //This enables drawing if its not on edit mode.

        if (!enableDrawing) return;

        const stage = canvasRef.current.getStage();
        const pointerPos = stage.getPointerPosition();

        setStartX(pointerPos.x);
        setStartY(pointerPos.y);

        setCurrentX(pointerPos.x)
        setCurrentY(pointerPos.y)

        if (selectedRectIndex === -1) {
            setIsDrawing(true);
        }
    }

    const stopDrawingRectangle = () => {
        //On releasing the mouse, we stop the draw in the canvas.
        //And store the drawn rectangle's coordinates and dimensions for later use. 

        if (!enableDrawing) return;
        if (selectedRectIndex === -1 && newRect.current !== undefined) {
            setRectangles([...rectangles, newRect.current])
        }
        setIsDrawing(false)

    }

    const drawRectangle = () => {
        //Draw rectangle on the canvas.
        //This function allows us to edit the already drawn rectangle and also drawn new rectangles.

        if (selectedRectIndex !== -1 && resizeHandle != null && enableEdit) {
            //To edit existing rectangle
            const newRect = [...rectangles];
            const currentRect = newRect[selectedRectIndex];

            const stage = canvasRef.current.getStage();
            const pointerPos = stage.getPointerPosition();

            let bottomX = 0;
            let bottomY = 0;

            switch (resizeHandle) {
                case 'bottomRight':
                    currentRect.width = pointerPos.x - currentRect.x;
                    currentRect.height = pointerPos.y - currentRect.y;
                    break;

                case 'topLeft':
                    bottomX = currentRect.x + currentRect.width;
                    bottomY = currentRect.y + currentRect.height;
                    currentRect.width = bottomX - pointerPos.x;
                    currentRect.height = bottomY - pointerPos.y;
                    currentRect.x = pointerPos.x;
                    currentRect.y = pointerPos.y;
                    break;

                default:
                    break;
            }
            setRectangles(newRect);
        } else {
            //To draw new rectangle
            if (!isDrawing && !enableDrawing) return

            const stage = canvasRef.current.getStage();
            const pointerPos = stage.getPointerPosition();
            setCurrentX(pointerPos.x)
            setCurrentY(pointerPos.y)

            const newRectangle = {
                x: Math.min(startX, pointerPos.x),
                y: Math.min(startY, pointerPos.y),
                width: Math.abs(pointerPos.x - startX),
                height: Math.abs(pointerPos.y - startY),
                stroke: "blue",
                strokeWidth: "5"
            }
            newRect.current = newRectangle

        }
    }

    const handleEditCircle = (index, corner) => {
        setSelectedRectIndex(index)
        setResizeHandle(corner)
        setEnableEdit((prev) => !prev)

    }

    const handleRectClick = (i) => {
        setSelectedRectIndex(i);
        if (deleteRectBox) {
            //Remove the drawn rectangle from the canvas.
            rectangles.splice(i, 1)
            setRectangles([...rectangles])
            setSelectedRectIndex(-1)
        }

    }

    const renderRect = () => {
        //Render the canvas to drawn all the rectangles on each component render
        return rectangles.map((eachItem, index) => {
            return (
                <>
                    <Rect
                        key={index}
                        onClick={() => handleRectClick(index)}
                        {...eachItem}
                    />
                    {enableResizing && (
                        <>
                            <Circle
                                x={eachItem.x}
                                y={eachItem.y}
                                radius={5} fill={resizeBtnColor}
                                onClick={() => handleEditCircle(index, 'topLeft')}
                            />
                            <Circle
                                x={eachItem.width + eachItem.x}
                                y={eachItem.y + eachItem.height}
                                radius={5}
                                fill={resizeBtnColor}
                                onClick={() => handleEditCircle(index, 'bottomRight')} />
                        </>
                    )
                    }
                </>
            )
        })
    }


    useEffect(() => {
        if (!savedCoordinatesPresent) {
            setRectangles([]);
        }
        setIsDrawing(false);
        setResetCanvas()
    }, [resetCanvas])

    useEffect(() => {
        if (!enableEdit) {
            setSelectedRectIndex(-1)
            setResizBtnColor("yellow")
        } else {
            setResizBtnColor("red")
        }
    }, [enableEdit])

    useEffect(() => {
        saveAnnotations(imageUrl, rectangles);
    }, [rectangles])


    useEffect(() => {
        if (imageUrl) {
            //Draw the already saved rectangle from local storage.
            //This ensures the saved rectangle is not lost on navigating through the images.

            const getRectangleInfo = JSON.parse(localStorage.getItem("boxCoordinates"))
            if (getRectangleInfo) {


                if (Object.keys(getRectangleInfo).includes(imageUrl.src)) {
                    const rectBox = getRectangleInfo[`${imageUrl.src}`]

                    const updatedRectBox = rectBox.map((eachItem) => {
                        const x = eachItem.x1 ?? 0;
                        const y = eachItem.y1 ?? 0;
                        const width = eachItem.x2 - eachItem.x1;
                        const height = eachItem.y2 - eachItem.y1;

                        return { x, y, width, height, stroke: "blue", strokeWidth: "5" };
                    })

                    setSavedCoordinatesPresent(true);
                    setRectangles(updatedRectBox)
                } else {
                    setSavedCoordinatesPresent(false);
                }
            }
        }

    }, [imageUrl])

    return (
        <div className='canvasContainer'>
            {imageUrl && (
                <Stage
                    className='canvas'
                    width={width}
                    height={height}
                    onMouseDown={startDrawingRectangle}
                    onMouseMove={drawRectangle}
                    onMouseUp={stopDrawingRectangle}
                    ref={canvasRef}
                >
                    <Layer ref={layerRef}>
                        <Image
                            ref={imageRef}
                            image={imageUrl}
                            width={width}
                            height={height}
                            scaleX={scale} scaleY={scale}
                            draggable={enableDrag}
                        />
                        {isDrawing && (
                            <Rect
                                x={Math.min(startX, currentX)}
                                y={Math.min(startY, currentY)}
                                width={Math.abs(currentX - startX)}
                                height={Math.abs(currentY - startY)}
                                stroke="blue"
                                strokeWidth="5"
                            />
                        )}
                        {renderRect()}
                    </Layer>
                </Stage >
            )}
        </div>

    )
}

export default KonvaCanvas