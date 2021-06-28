import { fabric } from "fabric";

export const addGroup = (object: fabric.Object, text: fabric.IText, canvas: fabric.Canvas, options: fabric.IGroupOptions) => {
  // 存放group的所有子项
  let items: fabric.Object[] = [];

  // 1. 新建group
  // 2. 设置dblclick事件监听
  //   - dblclick触发时，拆开group，进入textBox编辑状态
  // 3. 更新items，缓存group的子项
  items = generateGroup([object, text], canvas, text, options).getObjects();

  // textBox"结束编辑"触发
  // 1. 移除画布中，旧group散落的子项
  // 2. 渲染新的group
  // 3. 设置新group的dblclick事件监听
  // 4. 更新items，缓存group的子项
  text.on('editing:exited', () => {
    for (const item of items) {
      canvas.remove(item);
    }
    items = generateGroup(items, canvas, text).getObjects();
  });

  const obj = canvas.getObjects()[canvas.size() - 1];
  canvas.setActiveObject(obj);
  canvas.centerObject(obj);
  return obj;
}

// 1. 解开group
// 2. focus文本框
const handleDblclick = (group, canvas, text) => {
  divideGroupToRender(group, canvas);
  canvas.setActiveObject(text);
  text.enterEditing();
  text.selectAll();
  canvas.renderAll();
}


// 1. 移除原来的group
// 2. 将所有group的子项单一渲染
const divideGroupToRender = (group: fabric.Group, canvas: fabric.Canvas) => {
  const items = group._objects;
  group._restoreObjectsState();
  canvas.remove(group);
  canvas.renderAll();
  for (const item of items) {
    canvas.add(item);
  }
  // if you have disabled render on addition
  canvas.renderAll();

  return items;
}

const generateGroup = (items: fabric.Object[], canvas, text, option?: fabric.IGroupOptions) => {
  const group = new fabric.Group(items, option);
  group.on('mousedblclick', handleDblclick.bind(this, group, canvas, text));
  canvas.add(group);

  return group;
}