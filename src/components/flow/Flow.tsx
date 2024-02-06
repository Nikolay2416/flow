import { FC, useState, useRef } from 'react';
import ReactFlow, {
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Panel,
  ReactFlowInstance,
} from 'reactflow';
import { Button } from 'antd';

import { nodeTypes } from 'components/customNode/CustomNode';
import { edgeTypes } from 'components/customEdge/CustomEdge';

import { useFlowSaveLocalStorage } from 'hook/useFlowSaveLocalStorage';
import { useFlowConnect } from 'hook/useFlowConnect';

import cls from './flow.module.css';

export const Flow: FC = () => {
  const connectingNodeId = useRef<string>('');
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const firstLocationNode = reactFlowWrapper.current?.clientWidth
    ? reactFlowWrapper.current.clientWidth / 2 - 146.5
    : 0;

  const { onDelete } = useFlowSaveLocalStorage(rfInstance, firstLocationNode);
  const { onConnectStart, onConnectEnd, onConnect } = useFlowConnect(connectingNodeId, reactFlowWrapper);

  const changeNodeColor = (node: Node) => {
    if (node.data.valueСondition.length >= 50) {
      return '#ff0072';
    } else if (node.data.valueСondition.length >= 30) {
      return '#ffc53d';
    } else {
      return '#eee';
    }
  };

  return (
    <div className={cls.bodyReactFlow} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        className={cls.reactFlow}
        onInit={setRfInstance}
      >
        <Controls />
        <MiniMap nodeStrokeColor={changeNodeColor} nodeColor={changeNodeColor} />
        <Panel position="top-left">
          <Button size="small" onClick={onDelete}>
            Очистить
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
