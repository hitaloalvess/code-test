import { useDragLayer } from 'react-dnd';
import DevicePreview from '../Device/DevicePreview';


const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
}

const snapToGrid = (x, y) => {
    const snappedX = Math.round(x / 10) * 10
    const snappedY = Math.round(y / 10) * 10
    return [snappedX, snappedY]
}


const getItemStyles = (initialOffset, currentOffset, isSnapToGrid) => {
    if (!initialOffset || !currentOffset) {
        return {
            display: "none"
        };
    }
    let { x, y } = currentOffset;

    if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);
        x += initialOffset.x;
        y += initialOffset.y;

    }


    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
        transition: 'transform 60ms ease'
    };
}


const CustomDragLayer = () => {

    const {
        itemType,
        isDragging,
        item,
        initialOffset,
        currentOffset
    } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    })
    );

    const renderItem = ({ name, imgSrc }) => {
        const types = {
            'device': <DevicePreview name={name} imgSrc={imgSrc} />
        }

        const currentType = types[itemType];

        if (!currentType) return;

        return currentType;
    }

    if (!isDragging) return null;

    return (
        <div style={layerStyles}>
            <div
                style={getItemStyles(initialOffset, currentOffset, true)}
            >
                {renderItem({
                    name: item.name,
                    imgSrc: item.imgSrc
                })}
            </div>
        </div>
    );
};

export default CustomDragLayer;