import { useCallback, FC } from 'react';
import { Handle, Position, useReactFlow, NodeProps } from 'reactflow';
import { Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

import cls from './customNode.module.css';
import './reactFlowCustomNode.css';

const optionsOperator: Record<string, string>[] = [
  { value: 'if', label: 'if' },
  { value: 'else if', label: 'else if' },
  { value: 'true', label: 'true' },
  { value: 'false', label: 'false' },
];

export const CustomNode: FC<NodeProps> = ({ id, data: { valueСondition, valueOperator }, isConnectable }) => {
  const { setNodes } = useReactFlow();

  const handleChange = useCallback(
    (value: string, property: string) => {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, [property]: value } };
          }
          return node;
        });
      });
    },
    [setNodes, id],
  );

  return (
    <div className={cls.textUpdaterNode}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Select
        value={valueOperator}
        onChange={(value) => handleChange(value, 'valueOperator')}
        options={optionsOperator}
        className={`nodrag nopan ${cls.select}`}
      />
      <TextArea
        value={valueСondition}
        onChange={(e) => handleChange(e.target.value, 'valueСondition')}
        className={'nodrag nopan'}
        autoSize
      />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

export const nodeTypes = { custom: CustomNode };
