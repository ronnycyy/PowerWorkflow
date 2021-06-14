import * as React from 'react';
import {List} from "antd";
import {shapes} from "../configs/shapes";


const Sidebar = () => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={shapes}
      renderItem={shape => (
        <List.Item>
          <List.Item.Meta
            title={shape.title}
          />
        </List.Item>
      )}
    />
  )
}

export default Sidebar;
