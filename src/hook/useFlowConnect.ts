import { useCallback, MutableRefObject } from 'react';
import { useReactFlow, OnConnectStart, OnConnectEnd, OnConnect, addEdge } from 'reactflow';

export const useFlowConnect = (
  connectingNodeId: MutableRefObject<string>,
  reactFlowWrapper: MutableRefObject<HTMLDivElement | null>,
) => {
  const { setNodes, setEdges, project } = useReactFlow();

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    if (!nodeId) return;
    connectingNodeId.current = nodeId;
  }, [connectingNodeId]);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!event.target) return;
      const targetIsPane = (event.target as Element).classList?.contains('react-flow__pane');

      if (targetIsPane && reactFlowWrapper.current) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = String(Math.floor(Math.random() * 1000000) + 1);

        const newNode = {
          id,
          data: { valueOperator: '', valueСondition: '' },
          position: project({
            x: (event as MouseEvent).clientX - left - 146.5,
            y: (event as MouseEvent).clientY - top,
          }),
          type: 'custom',
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id, type: 'custom' }));
      }
    },
    [project, setEdges, setNodes, connectingNodeId, reactFlowWrapper],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((prevEdges) => addEdge({ ...params, type: 'custom' }, prevEdges));
    },
    [setEdges],
  );

  return { onConnectStart, onConnectEnd, onConnect };
};
