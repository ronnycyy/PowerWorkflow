import * as React from 'react';
import './Editor.less';
import { Row, Col } from 'antd';
import Canvas from "../../components/Canvas";
import { SIDEBAR_ID } from "../../configs/default";
import Sidebar from "../../components/sideBar/SideBar";

const Editor = () => {

  return (
    <div>
      <Row>
        <Col span={4} id={SIDEBAR_ID}>
          <Sidebar />
        </Col>
        <Col span={20}>
          <Canvas />
        </Col>
      </Row>
    </div>
  )
}

export default Editor
