/* eslint-disable react/prop-types */
import './InfoModal.css';
import { BiZoomIn, BiZoomOut, BiReset } from 'react-icons/bi';
import { AiOutlineDrag, AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai';
import { BsBoundingBoxCircles } from 'react-icons/bs';
import { TbResize } from 'react-icons/tb';

const InfoModal = ({ showModal = () => { } }) => {
    return (
        <div className='modal'>
            <AiOutlineCloseCircle className='close' onClick={showModal} />
            <div className="modal-header">Tool Info</div>
            <div className="modal-body">
                <ul>
                    <li>
                        <BiReset />
                        <span>Reset</span>
                        <div className="tool-info">
                            Resets the unsaved bounding boxes.
                        </div>
                    </li>
                    <li><BiZoomIn />
                        <span>ZoomIn</span>
                        <div className="tool-info">
                            ZoomIn the image for a closer bounding box. Use drag tool to move around the zoomed image.
                        </div>
                    </li>
                    <li><BiZoomOut />
                        <span>ZoomOut</span>
                        <div className="tool-info">
                            ZoomOut the image back to its original size.
                        </div>
                    </li>
                    <li><AiOutlineDrag />
                        <span>Drag</span>
                        <div className="tool-info">
                            Drag the image. Useful when the image is zoomed in.
                        </div>
                    </li>
                    <li><BsBoundingBoxCircles />
                        <span>Draw Box</span>
                        <div className="tool-info">
                            Draw the rectangular bounding box.
                        </div>
                    </li>
                    <li><TbResize />
                        <span>Resize</span>
                        <div className="tool-info">
                            Resize the already created bounding box.Select the tool and click on the corner green circle to activate the resize. Move the mouse around to resize the
                            bounding box. Click again to stop the drawing.
                        </div>
                    </li>
                    <li><AiOutlineDelete />
                        <span>Delete</span>
                        <div className="tool-info">
                            To delete already created bounding box.Select the tool and click on the rectangular box to delete it. Click on Save button to refelect the action.
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default InfoModal