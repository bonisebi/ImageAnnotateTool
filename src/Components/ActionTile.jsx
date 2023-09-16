/* eslint-disable react/prop-types */
import { useState } from 'react';
import './ActionTile.css';

import InfoModal from './InfoModal';

import { BiZoomIn, BiZoomOut, BiReset } from 'react-icons/bi';
import { AiOutlineDrag, AiOutlineDelete, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsBoundingBoxCircles } from 'react-icons/bs';
import { TbResize } from 'react-icons/tb';

const ActionTile = ({
    setResetCanvas, setEnableResizing, setEnableDrag, setImageScale, setEnableDrawing, setDeleteRectBox
}) => {


    const [tileResetCanvas, setTileResetCanvas] = useState(false)
    const [tileEnableDrawing, setTileEnableDrawing] = useState(false)
    const [tileEnableResizing, setTileEnableResizing] = useState(false)
    const [tileEnableDrag, setTileEnableDrag] = useState(false)
    const [tileDeleteRectBox, setTileDeleteRectBox] = useState(false)
    const [showModal, setShowModal] = useState(false)

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
                setDeleteRectBox(false);
                setEnableResizing(false)
                setTileEnableResizing(false)
                setTileDeleteRectBox(false);
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

            case "delete":
                setTileEnableDrawing(false);
                setEnableDrawing(false);
                setEnableResizing(false);
                setTileDeleteRectBox((prev) => !prev);
                setDeleteRectBox((prev) => !prev)
                break;

            default: break;
        }
    }

    const openModal = () => {
        setShowModal((prev) => !prev)
    }

    return (
        <>
            <div className='action-tile'>
                <div className="inner-tile">
                    <div onClick={() => handleAction("reset")} className={`tile`} title="Reset">
                        <BiReset />
                    </div>
                    <div onClick={() => handleAction("zoomIn")} className={``} title="ZoomIn">
                        <BiZoomIn />
                    </div>
                    <div onClick={() => handleAction("zoomOut")} className={``} title="ZoomOut">
                        <BiZoomOut />
                    </div>
                    <div onClick={() => handleAction("drag")} className={`tile ${tileEnableDrag ? 'active' : ''}`} title="Drag">
                        <AiOutlineDrag />
                    </div>
                    <div onClick={() => handleAction("enableDraw")} className={`tile ${tileEnableDrawing ? 'active' : ''}`} title="Draw Box">
                        <BsBoundingBoxCircles />
                    </div>
                    <div onClick={() => handleAction("resize")} className={`tile ${tileEnableResizing ? 'active' : ''}`} title="Resize">
                        <TbResize />
                    </div>
                    <div onClick={() => handleAction("delete")} className={`tile ${tileDeleteRectBox ? 'active' : ''}`} title="Delete">
                        <AiOutlineDelete />
                    </div>
                </div>
                <div className="infoIcon" title='Click here to get the info about the tools.' onClick={openModal}>
                    <AiOutlineInfoCircle />
                    <div className='tooltip'>Click here to get the tool info.</div>
                </div>

            </div>
            {/* Modal to list the tools information and how to use the tools. */}
            <div className={`backdrop-toolinfo ${showModal ? 'show-modal' : ''}`}>
                <div id="toolInfoModal" className={`info-modal ${showModal ? 'show-modal' : ''}`}>
                    <InfoModal showModal={() => { setShowModal((prev) => !prev) }} />
                </div>
            </div>
        </>
    )
}

export default ActionTile