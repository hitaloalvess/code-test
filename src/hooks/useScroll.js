import { useRef } from "react";


export const useScroll = (containerRef) => {

  const changingScrollPos = useRef({
    moving: false,
    posX: 0,
    posY: 0,
    posTop: 0,
    posLeft: 0
  });

  const startMove = (event) => {
    //Valid if the element to be dragged is the line container,
    //this way the scroll will only be moved when we drag the container
    const isLinesContainer = event.target.id.includes('lines');

    if (!isLinesContainer) return;

    const scrollElement = containerRef.current;

    const { clientX, clientY } = event;

    changingScrollPos.current = {
      moving: true,
      posLeft: scrollElement.scrollLeft,
      posTop: scrollElement.scrollTop,
      posX: clientX,
      posY: clientY
    }

  }

  const endMove = () => {

    changingScrollPos.current = {
      moving: false,
      posX: 0,
      posY: 0,
      posTop: 0,
      posLeft: 0
    };

    containerRef.current.style.cursor = 'auto';
  }

  const moving = (event) => {

    const { posX, posY, posLeft, posTop, moving } = changingScrollPos.current;

    if (!moving) return;

    const scrollElement = containerRef.current;

    const { clientX, clientY } = event;

    const distanceX = clientX - posX;
    const distanceY = clientY - posY;

    scrollElement.scrollTop = posTop - distanceY;
    scrollElement.scrollLeft = posLeft - distanceX;

    containerRef.current.style.cursor = 'grabbing';

  }


  return {
    startMove,
    endMove,
    moving
  }
}
