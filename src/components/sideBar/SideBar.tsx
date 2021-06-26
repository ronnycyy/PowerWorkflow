import React from 'react';
import { List } from "antd";
import { shapes } from "../../configs/shapes";
import './SideBar.less';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../models/State';
import { fabric } from 'fabric';
import {editorAction} from "../../store/actions/editorAction";

const Sidebar = () => {
  const dispatch = useDispatch();
  const canvas = useSelector<State, fabric.Canvas>(state => state.editor.canvas);

  const add = () => {
    const rect = new fabric.Rect({
      type: 'rect',
      left: 100,
      top: 50,
      fill: '#D81B60',
      width: 50,
      height: 50,
      strokeWidth: 2,
      stroke: "#880E4F",
      rx: 10,
      ry: 10,
      angle: 0,
      scaleX: 3,
      scaleY: 3,
      cornerStyle: 'circle',
      lockRotation: true,
      selectable: true,
    });

    canvas.add(rect);
    const obj = canvas.getObjects()[canvas.size()-1];
    canvas.setActiveObject(obj);
    dispatch(editorAction.addShape(obj));
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={shapes}
      renderItem={shape =>
        <List.Item className="item" onClick={add}>{shape.title}</List.Item>
      }
    />
  )
}

export default Sidebar;
