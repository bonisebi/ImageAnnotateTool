/* eslint-disable react/prop-types */
import { useState } from 'react';
import './ActionTile.css';

import { BiZoomIn, BiZoomOut, BiReset } from 'react-icons/bi';
import { AiOutlineDrag } from 'react-icons/ai';
import { BsBoundingBoxCircles } from 'react-icons/bs';
import { TbResize } from 'react-icons/tb';

const ActionTile = ({
    setResetCanvas, setEnableResizing, setEnableDrag, setImageScale, setEnableDrawing
}) => {


    const [tileResetCanvas, setTileResetCanvas] = useState(false)
    const [tileEnableDrawing, setTileEnableDrawing] = useState(false)
    const [tileEnableResizing, setTileEnableResizing] = useState(false)
    const [tileEnableDrag, setTileEnableDrag] = useState(false)

    const [tileImageScale, setTileImageScale] = useState(1.0)

    const handleAction = (action) => {
        switch (action) {
            case "reset":
                setTileResetCanvas(true)
                setResetCanvas(true);
                break;

            case "enableDraw":
                setTileEnableDrawing((prev) => !prev)
                setEnableDrawing((prev) => !prev);
                break;

            case "resize":
                setEnableDrawing(false);
                setTileEnableDrawing(false)
                setTileEnableResizing((prev) => !prev)
                setEnableResizing((prev) => !prev);
                break;

            case "zoomIn":
                setTileImageScale((prev) => prev + 0.1)
                setImageScale((prev) => prev + 0.1)
                break;

            case "zoomOut":
                if (tileImageScale > 1.0) {
                    setTileImageScale((prev) => prev - 0.1)
                    setImageScale((prev) => prev - 0.1)
                }
                break;

            case "drag":
                setTileEnableDrag((prev) => !prev)
                setEnableDrag((prev) => !prev)
                break;

            default: break;
        }
    }

    return (
        <div className='action-tile'>
            <div className="inner-tile">
                <div onClick={() => handleAction("reset")} className={`tile`}>
                    <BiReset />
                </div>
                <div onClick={() => handleAction("zoomIn")} className={``}>
                    <BiZoomIn />
                </div>
                <div onClick={() => handleAction("zoomOut")} className={``}>
                    <BiZoomOut />
                </div>
                <div onClick={() => handleAction("drag")} className={`tile ${tileEnableDrag ? 'active' : ''}`}>
                    <AiOutlineDrag />
                </div>
                <div onClick={() => handleAction("enableDraw")} className={`tile ${tileEnableDrawing ? 'active' : ''}`}>
                    <BsBoundingBoxCircles />
                </div>
                <div onClick={() => handleAction("resize")} className={`tile ${tileEnableResizing ? 'active' : ''}`}>
                    <TbResize />
                </div>
            </div>
        </div>
    )
}

export default ActionTile