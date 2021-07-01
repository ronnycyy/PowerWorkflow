import React from 'react';
import { List } from "antd";
import { shapes } from "../../configs/shapes";
import './SideBar.less';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../models/State';
import { fabric } from 'fabric';
import { editorAction } from "../../store/actions/editorAction";
import { addGroup } from "../../services/groupService";

const Sidebar = () => {
  const dispatch = useDispatch();
  const canvas = useSelector<State, fabric.Canvas>(state => state.editor.canvas);

  const add = () => {
    const text = new fabric.IText("结点", {
      fontFamily: 'Comic Sans',
      fontSize: 16,
      stroke: '#000',
      strokeWidth: 1,
      fill: "#000",
      originX:'center',
      originY:'center'
    });
    const circle = new fabric.Circle({
      strokeWidth: 5,
      radius: 64,
      fill: '#fff',
      stroke: '#000',
      originX:'center',
      originY:'center'
    });

    const options = {
      cornerStyle: 'circle',
      cornerColor: '#548DE8',
      borderColor: '#35CEE9',
      transparentCorners: false,
      lockRotation: true,
    }

    const obj = addGroup(circle, text, canvas, options as fabric.IGroupOptions);


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
