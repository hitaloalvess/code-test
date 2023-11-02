import btnEntry from '@/assets/images/buttons/menu-entry.svg';
import btnExit from '@/assets/images/buttons/menu-exit.svg';
import btnConditional from '@/assets/images/buttons/menu-conditional.svg';
import btnEvent from '@/assets/images/buttons/menu-event.svg';
import btnTool from '@/assets/images/buttons/menu-tool.svg';


export const mockMenuButtons = [{
    id: 1,
    imgSrc: btnEntry,
    typeArea: 'entry',
    title:'Componentes de entrada'
}, {
    id: 2,
    imgSrc: btnExit,
    typeArea: 'exit',
    title:'Componentes de saída'
},
{
    id: 3,
    imgSrc: btnConditional,
    typeArea: 'conditional',
    title:'Componentes condicionais'
},
{
    id: 4,
    imgSrc: btnEvent,
    typeArea: 'event',
    title:'Componentes de eventos'
},
{
    id: 5,
    imgSrc: btnTool,
    typeArea: 'tool',
    title:'Componentes de ferramentas'
}]
