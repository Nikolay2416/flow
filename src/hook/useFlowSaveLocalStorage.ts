import { useCallback, useEffect } from 'react';
import { useReactFlow, ReactFlowInstance, Node } from 'reactflow';

const FLOW_KEY = 'example-flow';

const initialNodes: Node = {
  id: '0',
  type: 'custom',
  data: { valueOperator: 'if', valueСondition: '' },
  position: { x: 0, y: 20 },
};

export const useFlowSaveLocalStorage = (rfInstance: ReactFlowInstance | null, firstLocationNode: number) => {
  const { setNodes, setEdges, getNodes, getEdges, setViewport } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const storedFlow = localStorage.getItem(FLOW_KEY);
      if (storedFlow) {
        const flow = JSON.parse(storedFlow);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  const onDelete = useCallback(() => {
    localStorage.removeItem(FLOW_KEY);
    setEdges([]);
    setNodes((prevNodes) => {
      return prevNodes
        .filter((node) => node.id === '0')
        .map((node) => {
          return { ...node, data: { ...node.data, valueOperator: 'if', valueСondition: '' } };
        });
    });
  }, [setEdges, setNodes]);

  useEffect(() => {
    onRestore();
  }, [onRestore]);

  useEffect(() => {
    onSave();
  }, [nodes, edges, onSave]);

  useEffect(() => {
    const storedFlow = JSON.parse(localStorage.getItem(FLOW_KEY) || '');
    if (firstLocationNode && (!storedFlow || storedFlow.nodes.length === 0)) {
      setNodes((prevNodes) => prevNodes.concat({ ...initialNodes, position: { x: firstLocationNode, y: 20 } }));
    }
  }, [firstLocationNode, setNodes]);

  return { onDelete };
};
