import { memo } from 'react';
import P from 'prop-types';

import ConnectorsContainer from './ConnectorsContainer';
import ConnectorsContent from './ConnectorsContent';
import ConnectorsConnector from './ConnectorsConnector';

const Connectors = memo(function Connectors({
  type, entryConnectors = null, exitConnectors = null
}) {

  console.log('re-render connectors');

  return (
    <ConnectorsContainer typeContainer={type}>

      <>

        {
          !!exitConnectors && (
            <ConnectorsContent>
              {
                exitConnectors.map((connector, index) => (

                  <ConnectorsConnector
                    key={index}
                    data={connector.data}
                    device={connector.device}
                    updateConn={connector.updateConn}
                    handleChangeData={connector.handleChangeData}
                  />

                ))
              }

            </ConnectorsContent>
          )
        }

        {
          !!entryConnectors && (
            <ConnectorsContent>
              {
                entryConnectors.map((connector, index) => (

                  <ConnectorsConnector
                    key={index}
                    data={connector.data}
                    device={connector.device}
                    updateConn={connector.updateConn}
                    handleChangeData={connector.handleChangeData}
                  />

                ))
              }
            </ConnectorsContent>
          )
        }
      </>


    </ConnectorsContainer>
  );
});

Connectors.propTypes = {
  type: P.oneOf(['exits', 'entrys', 'doubleTypes']),
  entryConnectors: P.arrayOf(
    P.shape({
      data: P.object.isRequired,
      device: P.object.isRequired,
      updateConn: P.shape({
        posX: P.number.isRequired,
        posY: P.number.isRequired
      }),
      handleChangeData: P.func.isRequired
    })
  ),
  exitConnectors: P.arrayOf(
    P.shape({
      data: P.object.isRequired,
      device: P.object.isRequired,
      updateConn: P.shape({
        posX: P.number.isRequired,
        posY: P.number.isRequired
      }),
      handleChangeData: P.func.isRequired
    })
  )
}

export default Connectors;
